module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/medical-content-platform/lib/sources/PubMedAdapter.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PubMedAdapter
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$fetch__$5b$external$5d$__$28$node$2d$fetch$2c$__cjs$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$node$2d$fetch$29$__ = __turbopack_context__.i("[externals]/node-fetch [external] (node-fetch, cjs, [project]/medical-content-platform/node_modules/node-fetch)");
;
const PUBMED_SEARCH_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';
const PUBMED_SUMMARY_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi';
class PubMedAdapter {
    async search(query) {
        // use esearch to get ids, then esummary to fetch metadata
        const params = new URLSearchParams({
            db: 'pubmed',
            term: query,
            retmode: 'json',
            retmax: '20'
        });
        const r = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$fetch__$5b$external$5d$__$28$node$2d$fetch$2c$__cjs$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$node$2d$fetch$29$__["default"])(`${PUBMED_SEARCH_URL}?${params.toString()}`);
        const j = await r.json();
        const ids = j.esearchresult?.idlist || [];
        if (!ids.length) return [];
        const sumParams = new URLSearchParams({
            db: 'pubmed',
            id: ids.join(','),
            retmode: 'json'
        });
        const s = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$fetch__$5b$external$5d$__$28$node$2d$fetch$2c$__cjs$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$node$2d$fetch$29$__["default"])(`${PUBMED_SUMMARY_URL}?${sumParams.toString()}`);
        const sj = await s.json();
        const results = ids.map((id)=>{
            const rec = sj.result?.[id];
            return {
                id,
                title: rec?.title || 'No title',
                authors: (rec?.authors || []).map((a)=>a.name),
                summary: rec?.summary || rec?.title || undefined,
                sourceUrl: `https://pubmed.ncbi.nlm.nih.gov/${id}/`
            };
        });
        return results;
    }
    async fetchById(id) {
        // fetch summary for now
        const sumParams = new URLSearchParams({
            db: 'pubmed',
            id,
            retmode: 'json'
        });
        const s = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$fetch__$5b$external$5d$__$28$node$2d$fetch$2c$__cjs$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$node$2d$fetch$29$__["default"])(`${PUBMED_SUMMARY_URL}?${sumParams.toString()}`);
        const sj = await s.json();
        return sj.result?.[id];
    }
    async fetchFullText(id) {
        // PubMed often doesn't host full text; try to obtain abstract/summary as fallback
        try {
            const summary = await this.fetchById(id);
            // prefer 'extract' fields if available, otherwise return title+summary
            const txt = summary?.extract || summary?.title || summary?.summary || null;
            return txt;
        } catch (e) {
            return null;
        }
    }
}
}),
"[project]/medical-content-platform/lib/search/SearchAggregatorService.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SearchAggregatorService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$sources$2f$PubMedAdapter$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/sources/PubMedAdapter.ts [api] (ecmascript)");
;
class SearchAggregatorService {
    adapters;
    constructor(){
        // future: instantiate other adapters based on config
        this.adapters = [
            new __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$sources$2f$PubMedAdapter$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"]()
        ];
    }
    /** perform query across all registered sources */ async searchAll(query) {
        // collecting results from each adapter sequentially; duplicates not deduped
        const results = [];
        for (const a of this.adapters){
            const r = await a.search(query);
            results.push(...r);
        }
        return results;
    }
}
}),
"[project]/medical-content-platform/pages/api/search/pubmed.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$search$2f$SearchAggregatorService$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/search/SearchAggregatorService.ts [api] (ecmascript)");
;
// simple in-memory cache keyed by term
const cache = new Map();
const TTL = 5 * 60 * 1000;
async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end();
    const term = req.query.term;
    if (!term) return res.status(400).json({
        error: 'term query required'
    });
    const now = Date.now();
    const cached = cache.get(term);
    if (cached && cached.expires > now) {
        return res.status(200).json({
            results: cached.results
        });
    }
    try {
        const service = new __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$search$2f$SearchAggregatorService$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"]();
        const results = await service.searchAll(term);
        cache.set(term, {
            results,
            expires: now + TTL
        });
        res.status(200).json({
            results
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: 'search failed'
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__50d9951d._.js.map