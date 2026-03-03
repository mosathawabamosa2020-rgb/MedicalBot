"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const prisma_1 = __importDefault(require("../../../lib/prisma"));
const embeddings_1 = require("../../../lib/embeddings");
async function handler(req, res) {
    if (req.method !== 'POST')
        return res.status(405).end();
    const { query, deviceId, topK } = req.body;
    if (!query)
        return res.status(400).json({ error: 'query required' });
    try {
        const qemb = await (0, embeddings_1.embedText)(query);
        const results = await (0, embeddings_1.queryVectors)(qemb, topK || 5);
        // enrich with reference metadata
        const enriched = await Promise.all(results.map(async (r) => {
            const ref = await prisma_1.default.reference.findUnique({ where: { id: r.id } });
            return {
                id: r.id,
                score: r.similarity,
                text: r.pageContent,
                reference: ref ? { id: ref.id, title: ref.title, filePath: ref.filePath, sourceUrl: ref.sourceUrl, deviceId: ref.deviceId } : null,
            };
        }));
        // if deviceId provided, filter by deviceId
        const filtered = deviceId ? enriched.filter((e) => e.reference && e.reference.deviceId === deviceId) : enriched;
        return res.json({ results: filtered });
    }
    catch (err) {
        const logger = require('../../../lib/logger');
        logger.error(err);
        return res.status(500).json({ error: 'Query failed' });
    }
}
