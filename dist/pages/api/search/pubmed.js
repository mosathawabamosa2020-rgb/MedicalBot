"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const PubMedAdapter_1 = __importDefault(require("../../../lib/sources/PubMedAdapter"));
// simple in-memory cache keyed by term
const cache = new Map();
const TTL = 5 * 60 * 1000;
async function handler(req, res) {
    if (req.method !== 'GET')
        return res.status(405).end();
    const term = req.query.term;
    if (!term)
        return res.status(400).json({ error: 'term query required' });
    const now = Date.now();
    const cached = cache.get(term);
    if (cached && cached.expires > now) {
        return res.status(200).json({ results: cached.results });
    }
    try {
        const adapter = new PubMedAdapter_1.default();
        const results = await adapter.search(term);
        cache.set(term, { results, expires: now + TTL });
        res.status(200).json({ results });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: 'search failed' });
    }
}
