module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/medical-content-platform/lib/env.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "env",
    ()=>env
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$zod$29$__ = __turbopack_context__.i("[externals]/zod [external] (zod, esm_import, [project]/medical-content-platform/node_modules/zod)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$zod$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$zod$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const envSchema = __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$zod$29$__["z"].object({
    NODE_ENV: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$zod$29$__["z"].enum([
        'development',
        'production',
        'test'
    ]).optional(),
    DATABASE_URL: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$zod$29$__["z"].string().url(),
    NEXTAUTH_SECRET: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$zod$29$__["z"].string().min(8),
    OPENAI_API_KEY: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$zod$29$__["z"].string().min(10),
    REDIS_URL: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$zod$29$__["z"].string().url().optional(),
    SERPAPI_KEY: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$zod$29$__["z"].string().optional()
});
const env = envSchema.safeParse(process.env);
if (!env.success) {
    const issues = env.error.issues.map((i)=>`${i.path.join('.')}: ${i.message}`).join('; ');
    // During tests, allow missing env but log a warning so test harness can run without real services.
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        throw new Error(`Environment validation failed: ${issues}`);
    }
}
const __TURBOPACK__default__export__ = env.data;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/medical-content-platform/lib/prisma.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/medical-content-platform/node_modules/@prisma/client)");
// validate environment early
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$env$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/env.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$env$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$env$2e$ts__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const prisma = global.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]();
if ("TURBOPACK compile-time truthy", 1) global.prisma = prisma;
const __TURBOPACK__default__export__ = prisma;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/medical-content-platform/lib/embeddings.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "embedText",
    ()=>embedText,
    "queryVectors",
    ()=>queryVectors,
    "saveReferenceEmbedding",
    ()=>saveReferenceEmbedding
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/prisma.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
function normalizeL2(vec) {
    let sum = 0;
    for (const v of vec)sum += v * v;
    const norm = Math.sqrt(sum) || 1;
    return vec.map((v)=>v / norm);
}
// Deterministic free-tier fallback embedding (no external API dependency).
function localDeterministicEmbedding(text, dim = 1536) {
    const out = new Array(dim).fill(0);
    const input = (text || '').toLowerCase();
    let seed = 2166136261;
    for(let i = 0; i < input.length; i += 1){
        seed ^= input.charCodeAt(i);
        seed = Math.imul(seed, 16777619);
        const idx = Math.abs(seed) % dim;
        const prev = out[idx] ?? 0;
        out[idx] = prev + ((seed >>> 0) % 2000 / 1000 - 1);
    }
    return normalizeL2(out);
}
async function embedText(text) {
    const backend = (process.env.EMBEDDING_BACKEND || '').toLowerCase();
    const useLocal = backend === 'local' || !process.env.OPENAI_API_KEY;
    if (useLocal) return localDeterministicEmbedding(text);
    const OpenAI = await __turbopack_context__.A("[externals]/openai [external] (openai, esm_import, [project]/medical-content-platform/node_modules/openai, async loader)");
    const openai = new OpenAI.OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });
    const resp = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text
    });
    const first = resp.data[0];
    if (!first) throw new Error('embedding service returned no vectors');
    return first.embedding;
}
async function saveReferenceEmbedding(referenceId, embedding) {
    const vecLiteral = '[' + embedding.join(',') + ']';
    return __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].$executeRaw`
    UPDATE "Reference"
    SET embedding = ${vecLiteral}::vector
    WHERE id = ${referenceId}
  `;
}
async function queryVectors(queryEmbedding, topK = 5) {
    const vecLiteral = '[' + queryEmbedding.join(',') + ']';
    const safeTopK = Math.max(1, Math.min(100, Math.floor(topK)));
    const rows = await __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].$queryRawUnsafe(`
    SELECT id, "parsedText" as "pageContent", "deviceId", 1 - (embedding <=> ${vecLiteral}::vector) as similarity
    FROM "Reference"
    WHERE embedding IS NOT NULL
    ORDER BY similarity DESC
    LIMIT ${safeTopK}
  `);
    return rows;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/medical-content-platform/lib/services/retrieval/policy.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RETRIEVAL_POLICY",
    ()=>RETRIEVAL_POLICY
]);
const RETRIEVAL_POLICY = {
    DEFAULT_TOP_K: 5,
    MAX_TOP_K: 25,
    MAX_PAGE: 100,
    MIN_QUERY_LENGTH: 2,
    DEFAULT_MIN_SCORE: 0.35,
    RECENCY_DAYS: 180,
    PREFETCH_MULTIPLIER: 3,
    DEFAULT_IVFFLAT_PROBES: 10,
    MAX_IVFFLAT_PROBES: 40,
    VECTOR_WEIGHT: 0.75,
    KEYWORD_WEIGHT: 0.25
};
}),
"[project]/medical-content-platform/lib/services/retrieval/normalize.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildQueryCacheKey",
    ()=>buildQueryCacheKey,
    "clampTopK",
    ()=>clampTopK,
    "normalizeQuery",
    ()=>normalizeQuery,
    "normalizeRequest",
    ()=>normalizeRequest
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$policy$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/services/retrieval/policy.ts [api] (ecmascript)");
;
function clampTopK(topK) {
    const requested = Number.isFinite(topK) ? Number(topK) : __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$policy$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["RETRIEVAL_POLICY"].DEFAULT_TOP_K;
    return Math.max(1, Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$policy$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["RETRIEVAL_POLICY"].MAX_TOP_K, Math.trunc(requested)));
}
function normalizeArabic(text) {
    return text.replace(/[\u064B-\u065F\u0670]/g, '') // tashkeel
    .replace(/[\u0625\u0623\u0622\u0671]/g, '\u0627') // alef variants -> alef
    .replace(/\u0649/g, '\u064A') // alif maqsura -> ya
    .replace(/\u0629/g, '\u0647') // taa marbuta -> ha
    ;
}
function removeControlChars(text) {
    return text.replace(/[\u0000-\u001F\u007F]/g, ' ');
}
const STOPWORDS = new Set([
    'the',
    'of',
    'for',
    'to',
    'in',
    'on',
    'with',
    'and',
    'or',
    'من',
    'في',
    'على',
    'الى',
    'إلى',
    'عن',
    'و',
    'او',
    'أو',
    'التي',
    'الذي'
]);
function normalizeQuery(raw) {
    const cleaned = removeControlChars(raw || '').toLowerCase();
    const normalizedArabic = normalizeArabic(cleaned);
    const tokens = normalizedArabic.replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean).filter((t)=>!STOPWORDS.has(t)).slice(0, 64);
    return tokens.join(' ').trim().slice(0, 1000);
}
function buildQueryCacheKey(query, topK, page, deviceId) {
    return `q=${query}|k=${topK}|p=${page}|d=${deviceId || 'all'}`;
}
function normalizeRequest(input) {
    const query = normalizeQuery(input.query || '');
    const page = Number.isFinite(input.page) ? Math.max(1, Math.trunc(Number(input.page))) : 1;
    return {
        query,
        deviceId: input.deviceId,
        topK: clampTopK(input.topK),
        page,
        minScore: __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$policy$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["RETRIEVAL_POLICY"].DEFAULT_MIN_SCORE
    };
}
}),
"[project]/medical-content-platform/lib/services/retrieval/rank.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "computeFinalScore",
    ()=>computeFinalScore,
    "rankAndPackage",
    ()=>rankAndPackage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$policy$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/services/retrieval/policy.ts [api] (ecmascript)");
;
function isRecent(uploadedAt) {
    if (!uploadedAt) return false;
    const ageMs = Date.now() - new Date(uploadedAt).getTime();
    return ageMs <= __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$policy$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["RETRIEVAL_POLICY"].RECENCY_DAYS * 24 * 60 * 60 * 1000;
}
function reliabilityBoost(score) {
    if (score == null || Number.isNaN(score)) return 0;
    const clamped = Math.max(0, Math.min(1, score));
    return clamped * 0.1;
}
function keywordScore(text, query) {
    const qTokens = query.split(/\s+/).filter(Boolean);
    if (!qTokens.length) return 0;
    const lowered = text.toLowerCase();
    let matches = 0;
    for (const t of qTokens){
        if (lowered.includes(t)) matches += 1;
    }
    return matches / qTokens.length;
}
function computeFinalScore(candidate, normalizedQuery) {
    const similarity = Number(candidate.similarity || 0);
    const keyword = keywordScore(candidate.pageContent || '', normalizedQuery);
    const weightedSimilarity = similarity * __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$policy$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["RETRIEVAL_POLICY"].VECTOR_WEIGHT + keyword * __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$policy$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["RETRIEVAL_POLICY"].KEYWORD_WEIGHT;
    const recentBoost = isRecent(candidate.uploadedAt) ? 0.05 : 0;
    return weightedSimilarity + reliabilityBoost(candidate.sourceReliabilityScore) + recentBoost;
}
function rankAndPackage(candidates, topK, minScore, normalizedQuery) {
    return candidates.map((c)=>({
            c,
            score: computeFinalScore(c, normalizedQuery)
        })).filter((x)=>x.score >= minScore).sort((a, b)=>b.score - a.score).slice(0, topK).map((x)=>({
            id: x.c.id,
            score: Number(x.score.toFixed(6)),
            snippet: (x.c.pageContent || '').slice(0, 240),
            sectionMatch: x.c.title || 'Section',
            source: 'semantic',
            reference: {
                id: x.c.referenceId,
                title: x.c.title || null,
                sourceUrl: x.c.sourceUrl || null,
                deviceId: x.c.deviceId || '',
                uploadedAt: x.c.uploadedAt ? new Date(x.c.uploadedAt).toISOString() : null
            }
        }));
}
}),
"[project]/medical-content-platform/lib/logger.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$pino__$5b$external$5d$__$28$pino$2c$__cjs$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$pino$29$__ = __turbopack_context__.i("[externals]/pino [external] (pino, cjs, [project]/medical-content-platform/node_modules/pino)");
;
let logger;
function createLogger() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if ("TURBOPACK compile-time truthy", 1) {
        try {
            // pino.transport exists in newer pino versions; cast to any to avoid TS issues
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const transport = __TURBOPACK__imported__module__$5b$externals$5d2f$pino__$5b$external$5d$__$28$pino$2c$__cjs$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$pino$29$__["default"].transport ? __TURBOPACK__imported__module__$5b$externals$5d2f$pino__$5b$external$5d$__$28$pino$2c$__cjs$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$pino$29$__["default"].transport({
                target: 'pino-pretty',
                options: {
                    colorize: true
                }
            }) : undefined;
            return transport ? (0, __TURBOPACK__imported__module__$5b$externals$5d2f$pino__$5b$external$5d$__$28$pino$2c$__cjs$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$pino$29$__["default"])(transport) : (0, __TURBOPACK__imported__module__$5b$externals$5d2f$pino__$5b$external$5d$__$28$pino$2c$__cjs$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$pino$29$__["default"])();
        } catch (e) {
            return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$pino__$5b$external$5d$__$28$pino$2c$__cjs$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$pino$29$__["default"])();
        }
    }
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$pino__$5b$external$5d$__$28$pino$2c$__cjs$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$pino$29$__["default"])();
}
logger = createLogger();
const __TURBOPACK__default__export__ = logger;
}),
"[project]/medical-content-platform/lib/services/retrieval/retrieve.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "retrieveVectorCandidates",
    ()=>retrieveVectorCandidates
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$policy$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/services/retrieval/policy.ts [api] (ecmascript)");
;
function normalizeProbe(probe) {
    const raw = Number(probe || process.env.RETRIEVAL_IVFFLAT_PROBES || __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$policy$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["RETRIEVAL_POLICY"].DEFAULT_IVFFLAT_PROBES);
    if (Number.isNaN(raw)) return __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$policy$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["RETRIEVAL_POLICY"].DEFAULT_IVFFLAT_PROBES;
    return Math.max(1, Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$policy$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["RETRIEVAL_POLICY"].MAX_IVFFLAT_PROBES, Math.floor(raw)));
}
async function retrieveVectorCandidates(prisma, queryEmbedding, topK, deviceId, page = 1, probe) {
    const limit = Math.max(1, topK * __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$policy$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["RETRIEVAL_POLICY"].PREFETCH_MULTIPLIER);
    const sectionProbeLimit = Math.max(200, limit * 8);
    const vecLiteral = `[${queryEmbedding.join(',')}]`;
    const ivfProbe = normalizeProbe(probe);
    const vectorStart = Date.now();
    const lightweight = await prisma.$transaction(async (tx)=>{
        await tx.$executeRawUnsafe(`SET LOCAL ivfflat.probes = ${ivfProbe}`);
        if (deviceId) {
            return tx.$queryRaw`
      SELECT
        cand.id,
        cand."referenceId" as "referenceId",
        1 - cand.distance as similarity
      FROM (
        SELECT
          s.id,
          s."referenceId",
          (s.embedding <=> ${vecLiteral}::vector) as distance
        FROM "Section" s
        JOIN "Reference" r ON r.id = s."referenceId"
        WHERE s.embedding IS NOT NULL
          AND r.status = 'verified'
          AND r."deviceId" = ${deviceId}
        ORDER BY s.embedding <=> ${vecLiteral}::vector
        LIMIT ${sectionProbeLimit}
      ) cand
      JOIN "Reference" r ON r.id = cand."referenceId"
      WHERE r.status = 'verified'
      ORDER BY cand.distance ASC
      LIMIT ${limit}
    `;
        }
        return tx.$queryRaw`
      SELECT
        cand.id,
        cand."referenceId" as "referenceId",
        1 - cand.distance as similarity
      FROM (
        SELECT
          s.id,
          s."referenceId",
          (s.embedding <=> ${vecLiteral}::vector) as distance
        FROM "Section" s
        JOIN "Reference" r ON r.id = s."referenceId"
        WHERE s.embedding IS NOT NULL
          AND r.status = 'verified'
        ORDER BY s.embedding <=> ${vecLiteral}::vector
        LIMIT ${sectionProbeLimit}
      ) cand
      JOIN "Reference" r ON r.id = cand."referenceId"
      WHERE r.status = 'verified'
      ORDER BY cand.distance ASC
      LIMIT ${limit}
    `;
    });
    const dbVectorMs = Date.now() - vectorStart;
    const hydrationStart = Date.now();
    const ids = lightweight.map((r)=>`'${r.id}'`).join(',');
    const details = ids.length ? await prisma.$queryRawUnsafe(`
      SELECT
        s.id,
        s."referenceId" as "referenceId",
        s.content as "pageContent",
        r."deviceId" as "deviceId",
        r."sourceReliabilityScore" as "sourceReliabilityScore",
        r."uploadedAt" as "uploadedAt",
        r."sourceUrl" as "sourceUrl",
        s.title as title
      FROM "Section" s
      JOIN "Reference" r ON r.id = s."referenceId"
      WHERE s.id IN (${ids})
    `) : [];
    const hydrationMs = Date.now() - hydrationStart;
    const byId = new Map();
    for (const d of details)byId.set(d.id, d);
    const rows = [];
    for (const c of lightweight){
        const hydrated = byId.get(c.id);
        if (!hydrated) continue;
        rows.push({
            ...hydrated,
            similarity: c.similarity
        });
    }
    return {
        rows,
        probe: ivfProbe,
        dbVectorMs,
        hydrationMs
    };
}
}),
"[project]/medical-content-platform/lib/services/retrieval/engine.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "runRetrievalQuery",
    ()=>runRetrievalQuery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$logger$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/logger.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$normalize$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/services/retrieval/normalize.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$rank$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/services/retrieval/rank.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$retrieve$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/services/retrieval/retrieve.ts [api] (ecmascript)");
;
;
;
;
async function runRetrievalQuery(input, deps) {
    const startedAt = Date.now();
    const normalizeStart = Date.now();
    const request = (0, __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$normalize$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["normalizeRequest"])(input);
    const normalizationMs = Date.now() - normalizeStart;
    const embedStart = Date.now();
    const qEmb = await deps.embedder(request.query);
    const embeddingMs = Date.now() - embedStart;
    const retrievalTopK = request.topK * request.page;
    const { rows: candidates, probe, dbVectorMs, hydrationMs } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$retrieve$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["retrieveVectorCandidates"])(deps.prisma, qEmb, retrievalTopK, request.deviceId, 1, deps.probe);
    const rankStart = Date.now();
    const ranked = (0, __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$rank$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["rankAndPackage"])(candidates, retrievalTopK, request.minScore, request.query);
    const rankingMs = Date.now() - rankStart;
    const start = (request.page - 1) * request.topK;
    const end = start + request.topK;
    const serializeStart = Date.now();
    const results = ranked.slice(start, end);
    const serializationMs = Date.now() - serializeStart;
    const totalMs = Date.now() - startedAt;
    const out = {
        results,
        meta: {
            topK: request.topK,
            page: request.page,
            hasMore: ranked.length > end,
            candidates: candidates.length,
            fallbackUsed: false,
            probeUsed: probe,
            normalizationMs,
            embeddingMs,
            dbVectorMs,
            hydrationMs,
            rankingMs,
            serializationMs,
            totalMs,
            durationMs: totalMs
        }
    };
    (deps.logger || __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$logger$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"]).info({
        event: 'retrieval.query',
        topKUsed: request.topK,
        probeUsed: probe,
        resultCount: results.length,
        fallbackUsed: false,
        durationMs: out.meta.durationMs,
        queryLength: request.query.length,
        normalizationMs,
        embeddingMs,
        dbVectorMs,
        hydrationMs,
        rankingMs,
        serializationMs
    }, 'retrieval query completed');
    return out;
}
}),
"[project]/medical-content-platform/lib/services/retrieval/index.ts [api] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$policy$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/services/retrieval/policy.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$normalize$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/services/retrieval/normalize.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$rank$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/services/retrieval/rank.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$engine$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/services/retrieval/engine.ts [api] (ecmascript)");
;
;
;
;
}),
"[project]/medical-content-platform/lib/apiSecurity.ts [api] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/medical-content-platform/pages/api/references/query.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$zod$29$__ = __turbopack_context__.i("[externals]/zod [external] (zod, esm_import, [project]/medical-content-platform/node_modules/zod)");
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/prisma.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$embeddings$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/embeddings.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$index$2e$ts__$5b$api$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/services/retrieval/index.ts [api] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$policy$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/services/retrieval/policy.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$engine$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/services/retrieval/engine.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$apiSecurity$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/apiSecurity.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$zod$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$embeddings$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$zod$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$embeddings$2e$ts__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
const querySchema = __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$zod$29$__["z"].object({
    query: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$zod$29$__["z"].string().min(__TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$policy$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["RETRIEVAL_POLICY"].MIN_QUERY_LENGTH),
    deviceId: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$zod$29$__["z"].string().min(1).optional(),
    topK: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$zod$29$__["z"].number().int().positive().max(__TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$policy$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["RETRIEVAL_POLICY"].MAX_TOP_K).optional(),
    page: __TURBOPACK__imported__module__$5b$externals$5d2f$zod__$5b$external$5d$__$28$zod$2c$__esm_import$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$zod$29$__["z"].number().int().positive().max(__TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$policy$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["RETRIEVAL_POLICY"].MAX_PAGE).optional()
});
async function handler(req, res) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$apiSecurity$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["setSecurityHeaders"])(res);
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$apiSecurity$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["enforceRateLimit"])(req, res, 'references-query', 60_000, 90)) return;
    if (req.method !== 'POST') return res.status(405).end();
    const parsed = querySchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            error: 'invalid payload',
            details: parsed.error.flatten()
        });
    }
    try {
        const input = parsed.data;
        const output = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$engine$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["runRetrievalQuery"])(input, {
            prisma: __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"],
            embedder: __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$embeddings$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["embedText"]
        });
        return res.status(200).json(output);
    } catch (err) {
        const logger = __turbopack_context__.r("[project]/medical-content-platform/lib/logger.ts [api] (ecmascript)");
        logger.error({
            event: 'retrieval.query.error',
            failureCode: 'retrieval_query_failed',
            retryCount: 0,
            topKUsed: parsed.data.topK || __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$policy$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["RETRIEVAL_POLICY"].DEFAULT_TOP_K,
            probeUsed: Number(process.env.RETRIEVAL_IVFFLAT_PROBES || __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$policy$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["RETRIEVAL_POLICY"].DEFAULT_IVFFLAT_PROBES),
            error: err?.message || String(err)
        }, 'retrieval query failed');
        return res.status(500).json({
            error: 'Query failed',
            failureCode: 'retrieval_query_failed'
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__5d3b0bf3._.js.map