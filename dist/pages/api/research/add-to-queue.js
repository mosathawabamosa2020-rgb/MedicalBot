"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const prisma_1 = __importDefault(require("../../../lib/prisma"));
async function handler(req, res) {
    if (req.method !== 'POST')
        return res.status(405).end();
    const { deviceId, sourceName, sourceId, title, sourceUrl, sourceReliabilityScore } = req.body;
    if (!deviceId || !sourceName || !sourceId || !title)
        return res.status(400).json({ error: 'missing fields' });
    try {
        // duplicate guard: ensure no reference with same sourceName+sourceId exists for device
        const dup = await prisma_1.default.reference.findFirst({ where: { deviceId, sourceName, sourceId } });
        if (dup)
            return res.status(409).json({ error: 'duplicate', referenceId: dup.id });
        const ref = await prisma_1.default.reference.create({ data: {
                deviceId,
                title,
                sourceUrl: sourceUrl || undefined,
                sourceName,
                sourceId,
                sourceReliabilityScore: sourceReliabilityScore || 0.0,
                status: undefined
            } });
        // mark as pending_ingestion via processingDate=null and version increment; we use processingDate to signal
        await prisma_1.default.reference.update({ where: { id: ref.id }, data: { processingDate: null } });
        return res.status(201).json({ referenceId: ref.id });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ error: e.message });
    }
}
