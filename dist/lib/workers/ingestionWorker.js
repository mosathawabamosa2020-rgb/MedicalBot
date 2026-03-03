"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runIngestionWorker = runIngestionWorker;
exports.processIngestionQueue = processIngestionQueue;
exports.processReferenceById = processReferenceById;
const prisma_1 = __importDefault(require("../prisma"));
const PubMedAdapter_1 = __importDefault(require("../sources/PubMedAdapter"));
async function parseTextIntoSections(text) {
    if (!text)
        return [];
    // naive split by double newlines; each paragraph becomes a section
    const paras = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    return paras.map((p, i) => ({ title: `Section ${i + 1}`, content: p }));
}
async function logEvent(message, referenceId) {
    try {
        await prisma_1.default.ingestionLog.create({ data: { message, referenceId } });
    }
    catch (e) {
        console.error('failed to write ingestion log', e);
    }
}
async function runIngestionWorker() {
    await logEvent('Started worker run');
    // find references pending ingestion
    const refs = await prisma_1.default.reference.findMany({ where: { status: 'pending_ingestion' } });
    for (const r of refs) {
        await logEvent(`Processing reference ${r.id}`, r.id);
        try {
            let fullText = null;
            if (r.sourceName === 'PubMed') {
                const adapter = new PubMedAdapter_1.default();
                fullText = await adapter.fetchFullText(r.sourceId);
            }
            if (fullText) {
                const sections = await parseTextIntoSections(fullText);
                let order = 1;
                for (const s of sections) {
                    await prisma_1.default.section.create({ data: {
                            deviceId: r.deviceId,
                            referenceId: r.id,
                            title: s.title,
                            content: s.content,
                            order: order++
                        } });
                }
                await prisma_1.default.reference.update({ where: { id: r.id }, data: { status: 'processed', processingDate: new Date() } });
                await logEvent(`Successfully processed reference ${r.id}`, r.id);
            }
            else {
                await prisma_1.default.reference.update({ where: { id: r.id }, data: { status: 'processed_no_full_text', processingDate: new Date() } });
                await logEvent(`No full text for reference ${r.id}`, r.id);
            }
        }
        catch (e) {
            console.error('worker error for reference', r.id, e === null || e === void 0 ? void 0 : e.message);
            await prisma_1.default.reference.update({ where: { id: r.id }, data: { status: 'processed_no_full_text', processingDate: new Date() } });
            await logEvent(`Error processing reference ${r.id}: ${e === null || e === void 0 ? void 0 : e.message}`, r.id);
        }
    }
}
async function processIngestionQueue() {
    return runIngestionWorker();
}
exports.default = { processIngestionQueue, runIngestionWorker };
async function processReferenceById(referenceId) {
    const r = await prisma_1.default.reference.findUnique({ where: { id: referenceId } });
    if (!r)
        throw new Error('not found');
    // reuse logic for single reference
    try {
        let fullText = null;
        if (r.sourceName === 'PubMed') {
            const adapter = new PubMedAdapter_1.default();
            fullText = await adapter.fetchFullText(r.sourceId);
        }
        if (fullText) {
            const sections = await parseTextIntoSections(fullText);
            let order = 1;
            for (const s of sections) {
                await prisma_1.default.section.create({ data: {
                        deviceId: r.deviceId,
                        referenceId: r.id,
                        title: s.title,
                        content: s.content,
                        order: order++
                    } });
            }
            await prisma_1.default.reference.update({ where: { id: r.id }, data: { status: 'processed', processingDate: new Date() } });
            return { status: 'processed', sections: sections.length };
        }
        else {
            await prisma_1.default.reference.update({ where: { id: r.id }, data: { status: 'processed_no_full_text', processingDate: new Date() } });
            return { status: 'processed_no_full_text', sections: 0 };
        }
    }
    catch (e) {
        await prisma_1.default.reference.update({ where: { id: r.id }, data: { status: 'processed_no_full_text', processingDate: new Date() } });
        throw e;
    }
}
