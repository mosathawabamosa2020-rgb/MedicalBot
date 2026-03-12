module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/lib/apiSecurity.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "enforceCsrfForMutation",
    ()=>enforceCsrfForMutation,
    "enforceRateLimit",
    ()=>enforceRateLimit,
    "setSecurityHeaders",
    ()=>setSecurityHeaders
]);
const inMemoryBuckets = new Map();
function getClientIp(req) {
    const xff = req.headers['x-forwarded-for'];
    if (typeof xff === 'string' && xff.length > 0) {
        return xff.split(',')[0]?.trim() || 'unknown';
    }
    return req.socket.remoteAddress || 'unknown';
}
function setSecurityHeaders(res) {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader('Content-Security-Policy', "default-src 'self'; frame-ancestors 'none'; base-uri 'self'");
}
function enforceCsrfForMutation(req, res) {
    if (![
        'POST',
        'PUT',
        'PATCH',
        'DELETE'
    ].includes(req.method || '')) return true;
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const origin = req.headers.origin;
    const referer = req.headers.referer;
    const host = req.headers.host;
    if (!host) {
        res.status(403).json({
            error: 'csrf validation failed'
        });
        return false;
    }
    if (!origin && referer) {
        try {
            const refererHost = new URL(referer).host;
            if (refererHost === host) return true;
        } catch  {
            res.status(403).json({
                error: 'csrf validation failed'
            });
            return false;
        }
    }
    if (!origin) return true;
    try {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
            res.status(403).json({
                error: 'csrf validation failed'
            });
            return false;
        }
    } catch  {
        res.status(403).json({
            error: 'csrf validation failed'
        });
        return false;
    }
    return true;
}
function enforceRateLimit(req, res, scope, windowMs, maxRequests) {
    const now = Date.now();
    const key = `${scope}:${getClientIp(req)}`;
    const current = inMemoryBuckets.get(key);
    if (!current || current.resetAt <= now) {
        inMemoryBuckets.set(key, {
            count: 1,
            resetAt: now + windowMs
        });
        return true;
    }
    if (current.count >= maxRequests) {
        res.status(429).json({
            error: 'rate limit exceeded'
        });
        return false;
    }
    current.count += 1;
    inMemoryBuckets.set(key, current);
    return true;
}
}),
"[project]/lib/logger.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$pino__$5b$external$5d$__$28$pino$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$pino$29$__ = __turbopack_context__.i("[externals]/pino [external] (pino, cjs, [project]/node_modules/pino)");
;
function createLogger() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if ("TURBOPACK compile-time truthy", 1) {
        try {
            // pino.transport exists in newer pino versions; cast to any to avoid TS issues
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const transport = __TURBOPACK__imported__module__$5b$externals$5d2f$pino__$5b$external$5d$__$28$pino$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$pino$29$__["default"].transport ? __TURBOPACK__imported__module__$5b$externals$5d2f$pino__$5b$external$5d$__$28$pino$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$pino$29$__["default"].transport({
                target: 'pino-pretty',
                options: {
                    colorize: true
                }
            }) : undefined;
            return transport ? (0, __TURBOPACK__imported__module__$5b$externals$5d2f$pino__$5b$external$5d$__$28$pino$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$pino$29$__["default"])(transport) : (0, __TURBOPACK__imported__module__$5b$externals$5d2f$pino__$5b$external$5d$__$28$pino$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$pino$29$__["default"])();
        } catch (e) {
            return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$pino__$5b$external$5d$__$28$pino$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$pino$29$__["default"])();
        }
    }
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$pino__$5b$external$5d$__$28$pino$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$pino$29$__["default"])();
}
const logger = createLogger();
const __TURBOPACK__default__export__ = logger;
}),
"[project]/lib/sources/PubMedAdapter.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PubMedAdapter
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$fetch__$5b$external$5d$__$28$node$2d$fetch$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$node$2d$fetch$29$__ = __turbopack_context__.i("[externals]/node-fetch [external] (node-fetch, cjs, [project]/node_modules/node-fetch)");
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
        const r = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$fetch__$5b$external$5d$__$28$node$2d$fetch$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$node$2d$fetch$29$__["default"])(`${PUBMED_SEARCH_URL}?${params.toString()}`);
        const j = await r.json();
        const ids = j.esearchresult?.idlist || [];
        if (!ids.length) return [];
        const sumParams = new URLSearchParams({
            db: 'pubmed',
            id: ids.join(','),
            retmode: 'json'
        });
        const s = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$fetch__$5b$external$5d$__$28$node$2d$fetch$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$node$2d$fetch$29$__["default"])(`${PUBMED_SUMMARY_URL}?${sumParams.toString()}`);
        const sj = await s.json();
        const results = ids.map((id)=>{
            const rec = sj.result?.[id];
            return {
                id,
                title: rec?.title || 'No title',
                authors: (rec?.authors || []).map((a)=>a.name),
                summary: rec?.summary || rec?.title || undefined,
                sourceUrl: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
                sourceName: 'PubMed',
                reliabilityScore: 0.95
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
        const s = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$fetch__$5b$external$5d$__$28$node$2d$fetch$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$node$2d$fetch$29$__["default"])(`${PUBMED_SUMMARY_URL}?${sumParams.toString()}`);
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
"[project]/lib/sources/FdaAdapter.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FdaAdapter
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$fetch__$5b$external$5d$__$28$node$2d$fetch$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$node$2d$fetch$29$__ = __turbopack_context__.i("[externals]/node-fetch [external] (node-fetch, cjs, [project]/node_modules/node-fetch)");
;
const FDA_510K_URL = 'https://api.fda.gov/device/510k.json';
class FdaAdapter {
    async search(query) {
        const normalized = (query || '').trim();
        if (!normalized) return [];
        const search = encodeURIComponent(`device_name:${normalized}*`);
        const url = `${FDA_510K_URL}?search=${search}&limit=10`;
        const response = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$fetch__$5b$external$5d$__$28$node$2d$fetch$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$node$2d$fetch$29$__["default"])(url);
        if (!response.ok) return [];
        const data = await response.json();
        const results = Array.isArray(data?.results) ? data.results : [];
        return results.map((r)=>{
            const kNumber = r?.k_number || r?.kNumber || 'unknown';
            return {
                id: String(kNumber),
                title: r?.device_name || `FDA 510(k) ${kNumber}`,
                summary: r?.statement_or_summary || r?.applicant || undefined,
                sourceUrl: `https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=${kNumber}`,
                sourceName: 'FDA',
                reliabilityScore: 0.98
            };
        });
    }
    async fetchById(id) {
        const search = encodeURIComponent(`k_number:${id}`);
        const url = `${FDA_510K_URL}?search=${search}&limit=1`;
        const response = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$fetch__$5b$external$5d$__$28$node$2d$fetch$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$node$2d$fetch$29$__["default"])(url);
        if (!response.ok) return null;
        const data = await response.json();
        return Array.isArray(data?.results) ? data.results[0] || null : null;
    }
    async fetchFullText(_id) {
        return null;
    }
}
}),
"[project]/lib/sources/WikimediaAdapter.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WikimediaAdapter
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$fetch__$5b$external$5d$__$28$node$2d$fetch$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$node$2d$fetch$29$__ = __turbopack_context__.i("[externals]/node-fetch [external] (node-fetch, cjs, [project]/node_modules/node-fetch)");
;
class WikimediaAdapter {
    async search(query) {
        const q = encodeURIComponent((query || '').trim());
        if (!q) return [];
        const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${q}&format=json&utf8=1`;
        const response = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$fetch__$5b$external$5d$__$28$node$2d$fetch$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$node$2d$fetch$29$__["default"])(url);
        if (!response.ok) return [];
        const data = await response.json();
        const list = Array.isArray(data?.query?.search) ? data.query.search : [];
        return list.slice(0, 8).map((item)=>({
                id: String(item?.pageid || ''),
                title: item?.title || 'Wikimedia entry',
                summary: item?.snippet?.replace(/<[^>]+>/g, '') || undefined,
                sourceUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(item?.title || '')}`,
                sourceName: 'Wikimedia',
                reliabilityScore: 0.7
            }));
    }
    async fetchById(id) {
        return {
            id
        };
    }
    async fetchFullText(_id) {
        return null;
    }
}
}),
"[project]/lib/sources/OpenMedicalLibrariesAdapter.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OpenMedicalLibrariesAdapter
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$fetch__$5b$external$5d$__$28$node$2d$fetch$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$node$2d$fetch$29$__ = __turbopack_context__.i("[externals]/node-fetch [external] (node-fetch, cjs, [project]/node_modules/node-fetch)");
;
class OpenMedicalLibrariesAdapter {
    async search(query) {
        const q = encodeURIComponent((query || '').trim());
        if (!q) return [];
        const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${q}&format=json&pageSize=10`;
        const response = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$fetch__$5b$external$5d$__$28$node$2d$fetch$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$node$2d$fetch$29$__["default"])(url);
        if (!response.ok) return [];
        const data = await response.json();
        const list = Array.isArray(data?.resultList?.result) ? data.resultList.result : [];
        return list.map((r)=>({
                id: String(r?.id || r?.pmid || ''),
                title: r?.title || 'Open medical library result',
                summary: r?.authorString || r?.journalTitle || undefined,
                sourceUrl: r?.doi ? `https://doi.org/${r.doi}` : undefined,
                sourceName: 'Open Medical Libraries',
                reliabilityScore: 0.9
            }));
    }
    async fetchById(id) {
        return {
            id
        };
    }
    async fetchFullText(_id) {
        return null;
    }
}
}),
"[project]/lib/sources/ManufacturerDocsAdapter.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ManufacturerDocsAdapter
]);
const MANUFACTURERS = [
    {
        name: 'GE Healthcare',
        host: 'gehealthcare.com'
    },
    {
        name: 'Philips',
        host: 'philips.com'
    },
    {
        name: 'Siemens Healthineers',
        host: 'siemens-healthineers.com'
    },
    {
        name: 'Mindray',
        host: 'mindray.com'
    }
];
class ManufacturerDocsAdapter {
    async search(query) {
        const q = (query || '').trim();
        if (!q) return [];
        return MANUFACTURERS.map((m)=>({
                id: `${m.name}:${q}`.replace(/\s+/g, '_'),
                title: `${m.name} documentation for ${q}`,
                summary: `Manufacturer documentation lookup target for ${q}`,
                sourceUrl: `https://${m.host}`,
                sourceName: `${m.name} Docs`,
                reliabilityScore: 0.88
            }));
    }
    async fetchById(id) {
        return {
            id
        };
    }
    async fetchFullText(_id) {
        return null;
    }
}
}),
"[project]/lib/search/SearchAggregatorService.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SearchAggregatorService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sources$2f$PubMedAdapter$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/sources/PubMedAdapter.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sources$2f$FdaAdapter$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/sources/FdaAdapter.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sources$2f$WikimediaAdapter$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/sources/WikimediaAdapter.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sources$2f$OpenMedicalLibrariesAdapter$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/sources/OpenMedicalLibrariesAdapter.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sources$2f$ManufacturerDocsAdapter$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/sources/ManufacturerDocsAdapter.ts [api] (ecmascript)");
;
;
;
;
;
class SearchAggregatorService {
    adapters;
    constructor(){
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        this.adapters = [
            new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sources$2f$PubMedAdapter$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"](),
            new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sources$2f$FdaAdapter$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"](),
            new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sources$2f$WikimediaAdapter$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"](),
            new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sources$2f$OpenMedicalLibrariesAdapter$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"](),
            new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sources$2f$ManufacturerDocsAdapter$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"]()
        ];
    }
    async searchAll(query) {
        const results = [];
        for (const a of this.adapters){
            try {
                const r = await a.search(query);
                results.push(...r);
            } catch  {
            // continue with remaining sources to keep discovery resilient
            }
        }
        const deduped = this.deduplicate(results);
        return deduped.sort((a, b)=>(b.reliabilityScore || 0) - (a.reliabilityScore || 0));
    }
    deduplicate(items) {
        const seen = new Set();
        const out = [];
        for (const item of items){
            const key = `${item.sourceUrl || ''}|${(item.title || '').toLowerCase()}`.trim();
            if (!key || seen.has(key)) continue;
            seen.add(key);
            out.push(item);
        }
        return out;
    }
}
}),
"[project]/pages/api/references/discovery/search.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$fetch__$5b$external$5d$__$28$node$2d$fetch$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$node$2d$fetch$29$__ = __turbopack_context__.i("[externals]/node-fetch [external] (node-fetch, cjs, [project]/node_modules/node-fetch)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiSecurity$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/apiSecurity.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logger.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$search$2f$SearchAggregatorService$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/search/SearchAggregatorService.ts [api] (ecmascript)");
;
;
;
;
async function handler(req, res) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiSecurity$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["setSecurityHeaders"])(res);
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$apiSecurity$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["enforceRateLimit"])(req, res, 'discovery-search', 60_000, 90)) return;
    if (req.method !== 'POST') return res.status(405).end();
    const { queries } = req.body;
    if (!queries || !Array.isArray(queries) || queries.length === 0) {
        return res.status(400).json({
            error: 'queries required'
        });
    }
    const serpKey = process.env.SERPAPI_KEY;
    if (!serpKey) {
        // Open-source default mode fallback: use internal multi-source adapters.
        const service = new __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$search$2f$SearchAggregatorService$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"]();
        const all = [];
        for (const q of queries.slice(0, 8)){
            const results = await service.searchAll(q);
            all.push(...results.map((r)=>({
                    query: q,
                    title: r.title,
                    link: r.sourceUrl || null,
                    snippet: r.summary || null,
                    sourceName: r.sourceName || 'unknown',
                    reliabilityScore: r.reliabilityScore || 0
                })));
        }
        return res.json({
            results: all
        });
    }
    try {
        const allResults = [];
        for (const q of queries.slice(0, 8)){
            const params = new URLSearchParams({
                q,
                api_key: serpKey
            });
            const url = `https://serpapi.com/search.json?${params.toString()}`;
            const r = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$2d$fetch__$5b$external$5d$__$28$node$2d$fetch$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$node$2d$fetch$29$__["default"])(url);
            if (!r.ok) continue;
            const json = await r.json();
            const items = json.organic_results || json.organic || json.results || [];
            const mapped = items.slice(0, 5).map((it)=>({
                    query: q,
                    title: it.title || it.title,
                    link: it.link || it.url || it.positioned_link || null,
                    snippet: it.snippet || it.snippet || it.description || null
                }));
            allResults.push(...mapped);
        }
        // rudimentary dedupe by link
        const seen = new Set();
        const deduped = allResults.filter((r)=>{
            if (!r.link) return false;
            if (seen.has(r.link)) return false;
            seen.add(r.link);
            return true;
        });
        return res.json({
            results: deduped
        });
    } catch (err) {
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].error({
            err
        }, 'discovery search failed');
        return res.status(500).json({
            error: 'Search failed'
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a3d591c0._.js.map