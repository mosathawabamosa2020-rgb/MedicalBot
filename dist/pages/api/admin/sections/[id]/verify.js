"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const client_1 = require("@prisma/client");
const next_1 = require("next-auth/next");
const auth_1 = __importDefault(require("../../../../../lib/auth"));
const prisma = new client_1.PrismaClient();
// simple in-memory rate limiter per user
const rateMap = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 10;
async function handler(req, res) {
    const { id } = req.query;
    if (typeof id !== 'string')
        return res.status(400).json({ error: 'invalid id' });
    if (req.method !== 'POST')
        return res.status(405).end();
    const session = await (0, next_1.getServerSession)(req, res, auth_1.default);
    if (!session || !session.user)
        return res.status(401).json({ error: 'unauthenticated' });
    const user = session.user;
    if (user.role !== 'admin')
        return res.status(403).json({ error: 'forbidden' });
    // rate limiting
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress) || 'anon';
    const key = user.id || ip || 'anon';
    const now = Date.now();
    const state = rateMap.get(key) || { count: 0, ts: now };
    if (now - state.ts > WINDOW_MS) {
        state.count = 0;
        state.ts = now;
    }
    state.count += 1;
    rateMap.set(key, state);
    if (state.count > MAX_PER_WINDOW)
        return res.status(429).json({ error: 'rate_limited' });
    try {
        const prev = await prisma.section.findUnique({ where: { id } });
        if (!prev)
            return res.status(404).json({ error: 'not found' });
        await prisma.section.update({ where: { id }, data: { status: 'verified' } });
        await prisma.sectionAuditLog.create({ data: { sectionId: id, userId: user.id, previousStatus: prev.status, newStatus: 'verified' } });
        return res.status(200).json({ ok: true });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'server error' });
    }
    finally {
        await prisma.$disconnect();
    }
}
