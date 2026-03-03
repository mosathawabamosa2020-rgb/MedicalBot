"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const next_1 = require("next-auth/next");
const auth_1 = __importDefault(require("../../../../lib/auth"));
const prisma_1 = __importDefault(require("../../../../lib/prisma"));
async function handler(req, res) {
    var _a;
    if (req.method !== 'POST')
        return res.status(405).end();
    const session = await (0, next_1.getServerSession)(req, res, auth_1.default);
    if (!session || ((_a = session.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
        return res.status(403).json({ error: 'forbidden' });
    }
    const { deviceId, pmid, title, authors, pubDate, sourceUrl } = req.body;
    if (!deviceId || !pmid || !title)
        return res.status(400).json({ error: 'missing fields' });
    try {
        const dup = await prisma_1.default.reference.findFirst({ where: { deviceId, sourceName: 'PubMed', sourceId: pmid } });
        if (dup)
            return res.status(409).json({ error: 'duplicate', referenceId: dup.id });
        const ref = await prisma_1.default.reference.create({ data: {
                deviceId,
                title,
                sourceName: 'PubMed',
                sourceId: pmid,
                sourceUrl: sourceUrl || undefined,
                sourceReliabilityScore: 0.0,
                status: undefined
            } });
        await prisma_1.default.reference.update({ where: { id: ref.id }, data: { processingDate: null } });
        return res.status(201).json({ referenceId: ref.id });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ error: e.message });
    }
}
