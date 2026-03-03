"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runScraper = runScraper;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pdf = require('pdf-parse');
// Master scraper exported function — will be compiled to dist/scripts/master_scraper.js
async function runScraper(input) {
    const loggerModule = require(path_1.default.join(process.cwd(), 'dist', 'lib', 'logger'));
    const logger = loggerModule && loggerModule.default ? loggerModule.default : loggerModule;
    const prismaModule = require(path_1.default.join(process.cwd(), 'dist', 'lib', 'prisma'));
    const { prisma } = prismaModule.prisma ? prismaModule : prismaModule.default ? prismaModule.default : prismaModule;
    const { embedText, saveReferenceEmbedding } = require(path_1.default.join(process.cwd(), 'dist', 'lib', 'embeddings'));
    const BASE_HOST = 'https://www.accessdata.fda.gov';
    const BASE_URL = `${BASE_HOST}/scripts/cdrh/cfdocs/cfPMN/pmn.cfm`;
    const DELAY_MS = parseInt(process.env.SCRAPER_DELAY_MS || '1200', 10);
    const STATE_PATH = path_1.default.join(process.cwd(), 'data', 'scrape_state.json');
    const STOP_FLAG = path_1.default.join(process.cwd(), 'data', 'scraper_stop.flag');
    function ensureDataFiles() {
        const dir = path_1.default.join(process.cwd(), 'data');
        if (!fs_1.default.existsSync(dir))
            fs_1.default.mkdirSync(dir);
        if (!fs_1.default.existsSync(STATE_PATH))
            fs_1.default.writeFileSync(STATE_PATH, JSON.stringify({ processedDetails: [], lastSearch: null, lastPageUrl: null }, null, 2));
    }
    function loadState() {
        ensureDataFiles();
        return JSON.parse(fs_1.default.readFileSync(STATE_PATH, 'utf8'));
    }
    function saveState(state) {
        fs_1.default.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
    }
    async function fetchRobots() {
        try {
            const r = await fetch(BASE_HOST + '/robots.txt');
            if (!r.ok)
                return null;
            const txt = await r.text();
            return txt;
        }
        catch (e) {
            return null;
        }
    }
    function isAllowedByRobots(robotsTxt, url) {
        if (!robotsTxt)
            return true;
        const lines = robotsTxt.split(/\r?\n/).map((l) => l.trim());
        let inStar = false;
        const disallows = [];
        for (const l of lines) {
            if (!l)
                continue;
            if (/^User-agent:\s*\*/i.test(l)) {
                inStar = true;
                continue;
            }
            if (/^User-agent:/i.test(l) && inStar)
                break;
            if (inStar && /^Disallow:/i.test(l)) {
                const p = l.split(':')[1].trim();
                disallows.push(p);
            }
        }
        try {
            const u = new URL(url);
            const pathName = u.pathname;
            for (const d of disallows) {
                if (!d)
                    continue;
                if (pathName.startsWith(d))
                    return false;
            }
            return true;
        }
        catch (e) {
            return false;
        }
    }
    async function parseAndIndexPdf(buffer, deviceId, referenceId) {
        try {
            const data = await pdf(buffer);
            const text = data.text || '';
            const pages = text.split('\f').map(p => p.trim()).filter(Boolean);
            const apiKey = process.env.OPENAI_API_KEY;
            if (!apiKey)
                throw new Error('OPENAI_API_KEY missing');
            for (let i = 0; i < pages.length; i++) {
                const pageText = pages[i];
                if (!pageText)
                    continue;
                // leave page-level embedding to KnowledgeChunk generation
                await new Promise(r => setTimeout(r, 200));
            }
            return { indexedPages: pages.length };
        }
        catch (e) {
            logger.warn({ err: e.message }, 'parseAndIndexPdf error');
            return { indexedPages: 0 };
        }
    }
    async function ocrSpaceParse(buffer) {
        const apiKey = process.env.OCR_SPACE_API_KEY;
        if (!apiKey)
            throw new Error('OCR_SPACE_API_KEY missing');
        try {
            // Send PDF as base64 string in a urlencoded form; avoids relying on FormData/Blob in Node
            const params = new URLSearchParams();
            params.append('apikey', apiKey);
            params.append('language', 'eng');
            params.append('isOverlayRequired', 'false');
            params.append('base64Image', 'data:application/pdf;base64,' + buffer.toString('base64'));
            const resp = await fetch('https://api.ocr.space/parse/image', { method: 'POST', body: params });
            const j = await resp.json();
            try {
                logger.info({ ocrResponse: j && j.ParsedResults && j.ParsedResults[0] ? j.ParsedResults[0] : j }, 'ocrSpaceParse response');
            }
            catch (e) { /* ignore logging errors */ }
            if (j && j.ParsedResults && j.ParsedResults[0] && j.ParsedResults[0].ParsedText)
                return j.ParsedResults[0].ParsedText;
            return '';
        }
        catch (e) {
            return '';
        }
    }
    async function processPdfChunks(buffer, deviceId, referenceId) {
        var _a, _b, _c, _d;
        try {
            const data = await pdf(buffer);
            const text = data.text || '';
            let pages = text.split('\f').map(p => p.trim()).filter(Boolean);
            // If pdf-parse yields no text, use OCR.space as a fallback (requires OCR_SPACE_API_KEY)
            if (!pages.length) {
                try {
                    try {
                        logger.info({ referenceId, note: 'pdf-parse yielded no text; invoking OCR.space fallback' });
                    }
                    catch (e) { }
                    const ocrText = await ocrSpaceParse(buffer);
                    try {
                        logger.info({ referenceId, ocrTextSample: (ocrText || '').slice(0, 200) });
                    }
                    catch (e) { }
                    if (ocrText && ocrText.trim().length) {
                        pages = ocrText.split('\f').map(p => p.trim()).filter(Boolean);
                    }
                }
                catch (e) { /* ignore OCR errors */ }
            }
            // store raw text in reference for potential reprocessing
            try {
                await prisma.reference.update({ where: { id: referenceId }, data: { parsedText: pages.join('\n\f\n') } });
            }
            catch (e) {
                logger.warn({ err: e.message }, 'Failed to update reference.parsedText');
            }
            // Section detection & storage
            try {
                const { extractSections } = require(path_1.default.join(process.cwd(), 'dist', 'lib', 'sectionExtractor'));
                const sections = extractSections(pages);
                // do not delete previous sections; versioning preserves history
                for (let si = 0; si < sections.length; si++) {
                    const sec = sections[si];
                    await prisma.section.create({ data: { deviceId, referenceId, title: sec.title, content: sec.content, order: si } });
                }
            }
            catch (e) {
                logger.warn({ err: e.message }, 'Section extraction failed');
            }
            const OpenAI = await Promise.resolve().then(() => __importStar(require('openai')));
            const client = new OpenAI.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            for (let i = 0; i < pages.length; i++) {
                const pageNumber = i + 1;
                const pageText = pages[i];
                // split into paragraphs by two or more newlines
                const paragraphs = pageText.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
                for (const para of paragraphs) {
                    // classify via OpenAI
                    let category = 'Other';
                    try {
                        const prompt = `Classify the following paragraph into one of: Scientific Definition, Principle of Operation, Core Components, Calibration, Common Failures, Preventive Maintenance, Risks and Warnings, Other. Respond with a single category name only.\n\nParagraph:\n"""${para.replace(/"""/g, '')}"""`;
                        const resp = await client.responses.create({ model: 'gpt-4.1-mini', input: prompt });
                        category = (resp.output_text || ((_d = (_c = (_b = (_a = resp.output) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.text) || 'Other').trim();
                    }
                    catch (e) {
                        logger.warn({ err: e.message }, 'Classification failed; defaulting to Other');
                        category = 'Other';
                    }
                    // create KnowledgeChunk record
                    try {
                        const kc = await prisma.knowledgeChunk.create({ data: { referenceId, content: para, category, pageNumber } });
                        // embed paragraph and store vector via raw SQL
                        try {
                            const emb = await embedText(para);
                            const vecLiteral = '[' + emb.join(',') + ']';
                            await prisma.$executeRawUnsafe(`UPDATE "KnowledgeChunk" SET embedding = ${vecLiteral}::vector WHERE id = '${kc.id}'`);
                        }
                        catch (e) {
                            logger.warn({ err: e.message }, 'Embedding save failed for KnowledgeChunk');
                        }
                    }
                    catch (e) {
                        logger.warn({ err: e.message }, 'Failed to create KnowledgeChunk');
                    }
                    await new Promise(r => setTimeout(r, 150));
                }
            }
            return { pages: pages.length };
        }
        catch (e) {
            logger.warn({ err: e.message }, 'processPdfChunks error');
            return { pages: 0 };
        }
    }
    // BEGIN run — Operation Human-in-the-Loop: PDF Processor
    ensureDataFiles();
    const state = loadState();
    state.lastSearch = input || 'PDF_PROCESS';
    saveState(state);
    const incomingDir = path_1.default.join(process.cwd(), 'data', 'incoming_pdfs');
    if (!fs_1.default.existsSync(incomingDir)) {
        logger.info({ dir: incomingDir }, 'Incoming PDF directory not found — creating and waiting for uploads');
        fs_1.default.mkdirSync(incomingDir, { recursive: true });
        return;
    }
    const files = fs_1.default.readdirSync(incomingDir).filter(f => f.toLowerCase().endsWith('.pdf'));
    if (!files.length) {
        logger.info({ dir: incomingDir }, 'No PDF files found in incoming directory');
        return;
    }
    for (const file of files) {
        try {
            if (fs_1.default.existsSync(STOP_FLAG)) {
                logger.info('Stop flag detected; exiting');
                break;
            }
            const filePath = path_1.default.join(incomingDir, file);
            if (state.processedFiles && state.processedFiles.includes(filePath)) {
                logger.info({ filePath }, 'Already processed; skipping');
                continue;
            }
            // extract K number and device name from filename: e.g., K192027_Device_Name.pdf
            const m = file.match(/K?(\d{5,6})[_\- ]*(.*)\.pdf$/i);
            let kNumber = m ? ('K' + m[1]) : null;
            let deviceNameFromFile = m && m[2] ? m[2].replace(/[_\-]+/g, ' ').trim() : null;
            const buffer = fs_1.default.readFileSync(filePath);
            // if no K in filename, attempt to extract from PDF text
            if (!kNumber) {
                try {
                    const data = await pdf(buffer);
                    const txt = data.text || '';
                    const km = txt.match(/(K\d{5,6}|k\d{5,6})/i);
                    if (km)
                        kNumber = km[0].toUpperCase();
                }
                catch (e) { /* ignore PDF parse errors */ }
            }
            if (!kNumber) {
                logger.warn({ file }, 'No K number found in filename or PDF — skipping');
                state.processedFiles = state.processedFiles || [];
                state.processedFiles.push(filePath);
                saveState(state);
                continue;
            }
            // create or find device
            let device = await prisma.device.findFirst({ where: { model: kNumber } });
            if (!device) {
                device = await prisma.device.create({ data: { name: deviceNameFromFile || kNumber, model: kNumber, description: `Imported from uploaded FDA 510(k) PDF` } });
                logger.info({ deviceId: device.id, kNumber }, 'Created device from PDF');
            }
            else {
                logger.info({ deviceId: device.id, kNumber }, 'Device already exists');
            }
            // copy PDF to uploads and create Reference
            const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
            if (!fs_1.default.existsSync(uploadsDir))
                fs_1.default.mkdirSync(uploadsDir);
            const outFilename = `fda_${kNumber}_${Date.now()}.pdf`;
            const outPath = path_1.default.join(uploadsDir, outFilename);
            fs_1.default.copyFileSync(filePath, outPath);
            // determine version for this new reference
            const lastRef = await prisma.reference.findFirst({ where: { deviceId: device.id }, orderBy: { version: 'desc' } });
            const version = lastRef ? lastRef.version + 1 : 1;
            const ref = await prisma.reference.create({ data: { deviceId: device.id, title: `FDA PDF ${kNumber}`, filePath: outPath, sourceUrl: null, version, processingDate: new Date() } });
            logger.info({ referenceId: ref.id, file: outPath, version }, 'Created reference from PDF');
            // parse, classify, and index PDF into KnowledgeChunks
            try {
                const { pages } = await processPdfChunks(buffer, device.id, ref.id);
                logger.info({ pages, referenceId: ref.id }, 'Processed PDF into KnowledgeChunks');
            }
            catch (e) {
                logger.warn({ err: e.message }, 'PDF processing error');
            }
            state.processedFiles = state.processedFiles || [];
            state.processedFiles.push(filePath);
            saveState(state);
        }
        catch (e) {
            logger.warn({ err: e.message, file }, 'Error processing incoming PDF');
        }
    }
}
