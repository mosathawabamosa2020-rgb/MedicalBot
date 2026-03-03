"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const PubMedAdapter_1 = __importDefault(require("../../../lib/sources/PubMedAdapter"));
// simple in-memory cache: key -> { ts, data }
const cache = new Map();
const TTL = 5 * 60 * 1000; // 5 minutes
async function handler(req, res) {
    if (req.method !== 'GET')
        return res.status(405).end();
    const q = req.query.q || '';
    if (!q)
        return res.status(400).json({ error: 'missing query' });
    const key = `pubmed:${q}`;
    const now = Date.now();
    const cached = cache.get(key);
    if (cached && now - cached.ts < TTL) {
        return res.status(200).json({ source: 'cache', results: cached.data });
    }
    const adapter = new PubMedAdapter_1.default();
    try {
        const results = await adapter.search(q);
        cache.set(key, { ts: now, data: results });
        return res.status(200).json({ source: 'pubmed', results });
    }
    catch (e) {
        return res.status(500).json({ error: e.message || 'search failed' });
    }
}
