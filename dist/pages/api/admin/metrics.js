"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const client_1 = require("@prisma/client");
// replicate computeMetrics logic from tools
async function handler(req, res) {
    if (req.method !== 'GET')
        return res.status(405).end();
    const prisma = new client_1.PrismaClient();
    try {
        await prisma.$connect();
        const deviceCount = await prisma.device.count();
        const articleCount = await prisma.reference.count();
        const sectionCount = await prisma.section.count();
        const statusBreakdown = await prisma.section.groupBy({ by: ['status'], _count: { status: true } });
        res.status(200).json({ deviceCount, articleCount, sectionCount, statusBreakdown });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'server error' });
    }
    finally {
        await prisma.$disconnect();
    }
}
