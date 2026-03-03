"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const client_1 = require("@prisma/client");
const next_1 = require("next-auth/next");
const auth_1 = __importDefault(require("../../../../lib/auth"));
async function handler(req, res) {
    var _a;
    if (req.method !== 'GET')
        return res.status(405).end();
    const session = await (0, next_1.getServerSession)(req, res, auth_1.default);
    if (!session || ((_a = session.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
        return res.status(403).json({ error: 'forbidden' });
    }
    const prisma = new client_1.PrismaClient();
    try {
        await prisma.$connect();
        const logs = await prisma.ingestionLog.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
        res.status(200).json({ logs });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'server error' });
    }
    finally {
        await prisma.$disconnect();
    }
}
