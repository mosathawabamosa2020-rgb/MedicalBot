"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function handler(req, res) {
    const { deviceId } = req.query;
    if (req.method !== 'GET')
        return res.status(405).end();
    if (typeof deviceId !== 'string')
        return res.status(400).json({ error: 'Invalid id' });
    try {
        // try to load structured sections first (exclude rejected)
        const sections = await prisma.section.findMany({ where: { deviceId, status: { not: 'rejected' } }, orderBy: { order: 'asc' } });
        if (sections && sections.length) {
            const profile = {};
            for (const s of sections) {
                profile[s.title] = { content: s.content, status: s.status };
            }
            return res.status(200).json({ deviceId, profile });
        }
        // fallback to old KnowledgeChunk grouping
        const chunks = await prisma.knowledgeChunk.findMany({
            where: { reference: { deviceId } },
            select: { id: true, content: true, category: true, pageNumber: true }
        });
        const profile = {};
        for (const c of chunks) {
            if (!profile[c.category])
                profile[c.category] = [];
            profile[c.category].push(c);
        }
        return res.status(200).json({ deviceId, profile });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'server error' });
    }
    finally {
        await prisma.$disconnect();
    }
}
