"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function handler(req, res) {
    if (req.method !== 'GET')
        return res.status(405).end();
    try {
        const sections = await prisma.section.findMany({
            where: { status: 'ingested' },
            include: { reference: { select: { id: true, filePath: true, sourceUrl: true, title: true, version: true } } },
            orderBy: { createdAt: 'asc' }
        });
        return res.status(200).json(sections);
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'server error' });
    }
    finally {
        await prisma.$disconnect();
    }
}
