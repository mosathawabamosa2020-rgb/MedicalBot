"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function handler(req, res) {
    const { id } = req.query;
    if (typeof id !== 'string')
        return res.status(400).json({ error: 'invalid id' });
    try {
        if (req.method === 'GET') {
            const sec = await prisma.section.findUnique({
                where: { id },
                include: { reference: true }
            });
            if (!sec)
                return res.status(404).json({ error: 'not found' });
            return res.status(200).json(sec);
        }
        return res.status(405).end();
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'server error' });
    }
    finally {
        await prisma.$disconnect();
    }
}
