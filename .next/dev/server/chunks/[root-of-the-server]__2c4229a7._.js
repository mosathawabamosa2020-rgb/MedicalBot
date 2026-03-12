module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/medical-content-platform/lib/auth.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authOptions",
    ()=>authOptions,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/medical-content-platform/node_modules/@prisma/client)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$providers$2f$credentials__$5b$external$5d$__$28$next$2d$auth$2f$providers$2f$credentials$2c$__cjs$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$next$2d$auth$29$__ = __turbopack_context__.i("[externals]/next-auth/providers/credentials [external] (next-auth/providers/credentials, cjs, [project]/medical-content-platform/node_modules/next-auth)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__cjs$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$bcryptjs$29$__ = __turbopack_context__.i("[externals]/bcryptjs [external] (bcryptjs, cjs, [project]/medical-content-platform/node_modules/bcryptjs)");
;
;
;
const prisma = new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]();
let adapter = undefined;
try {
    // adapter is optional in tests if package not installed
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaAdapter } = __turbopack_context__.r("[externals]/@next-auth/prisma-adapter [external] (@next-auth/prisma-adapter, cjs, [project]/medical-content-platform/node_modules/@next-auth/prisma-adapter)");
    adapter = PrismaAdapter(prisma);
} catch (e) {
    // package not available in test env; proceed without adapter
    adapter = undefined;
}
const authOptions = {
    adapter,
    providers: [
        (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$providers$2f$credentials__$5b$external$5d$__$28$next$2d$auth$2f$providers$2f$credentials$2c$__cjs$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$next$2d$auth$29$__["default"])({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text'
                },
                password: {
                    label: 'Password',
                    type: 'password'
                }
            },
            async authorize (credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });
                if (!user) return null;
                const ok = await __TURBOPACK__imported__module__$5b$externals$5d2f$bcryptjs__$5b$external$5d$__$28$bcryptjs$2c$__cjs$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$bcryptjs$29$__["default"].compare(credentials.password, user.password);
                if (!ok) return null;
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                };
            }
        })
    ],
    session: {
        strategy: 'jwt',
        maxAge: 8 * 60 * 60,
        updateAge: 60 * 60
    },
    callbacks: {
        async jwt ({ token, user }) {
            if (user) token.role = user.role || token.role;
            if (user) {
                // also store sub for compatibility with default NextAuth JWT
                token.sub = user.id || token.sub;
            }
            return token;
        },
        async session ({ session, token }) {
            // avoid calling properties as functions; use token.sub for id
            if (session?.user && token?.sub) {
                session.user.id = token.sub;
            }
            if (session?.user && token?.role) {
                session.user.role = token.role;
            }
            return session;
        }
    }
};
const __TURBOPACK__default__export__ = authOptions;
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
"[project]/medical-content-platform/lib/services/contentGeneration.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildGeneratedContent",
    ()=>buildGeneratedContent
]);
const PROFANITY = [
    'damn',
    'shit',
    'fuck'
];
const POLICY_SENSITIVE = [
    'self harm',
    'bomb',
    'bioweapon',
    'hate speech'
];
const INJECTION_PATTERNS = [
    /ignore previous instructions/i,
    /system prompt/i,
    /developer mode/i
];
const MAX_CONTEXT_SECTIONS = 12;
const MAX_CONTEXT_CHARS = 14_000;
const MAX_OUTPUT_CHARS = 2_000;
const CATEGORY_RULES = [
    {
        key: 'definition',
        patterns: [
            /definition|is a|defined as|describes/i
        ]
    },
    {
        key: 'workingPrinciple',
        patterns: [
            /works by|mechanism|principle|operates/i
        ]
    },
    {
        key: 'components',
        patterns: [
            /component|includes|consists of|module|sensor/i
        ]
    },
    {
        key: 'advantages',
        patterns: [
            /advantage|benefit|improve|reduce/i
        ]
    },
    {
        key: 'limitations',
        patterns: [
            /limitation|risk|drawback|contraindication|warning/i
        ]
    },
    {
        key: 'useCases',
        patterns: [
            /use case|used for|indicated|application|clinical/i
        ]
    }
];
function normalizeTopic(topic) {
    return topic.replace(/\s+/g, ' ').trim().toLowerCase();
}
function safetyValidate(topic) {
    const text = normalizeTopic(topic);
    if (PROFANITY.some((w)=>text.includes(w))) return {
        ok: false,
        code: 'profanity_rejected'
    };
    if (POLICY_SENSITIVE.some((w)=>text.includes(w))) return {
        ok: false,
        code: 'policy_sensitive_topic'
    };
    return {
        ok: true
    };
}
function sanitizeContext(text) {
    let out = text;
    for (const p of INJECTION_PATTERNS)out = out.replace(p, '');
    return out.replace(/\s+/g, ' ').trim();
}
function assembleContext(results) {
    const selected = [];
    const seenRef = new Map();
    let usedChars = 0;
    for (const item of results){
        if (selected.length >= MAX_CONTEXT_SECTIONS) break;
        const refCount = seenRef.get(item.reference.id) || 0;
        // Cross-reference diversity guard: max 3 snippets/reference
        if (refCount >= 3) continue;
        const clean = sanitizeContext(item.snippet);
        if (!clean) continue;
        if (usedChars + clean.length > MAX_CONTEXT_CHARS) break;
        seenRef.set(item.reference.id, refCount + 1);
        selected.push({
            text: clean,
            referenceId: item.reference.id
        });
        usedChars += clean.length;
    }
    return selected;
}
function hashTagsFromTopic(topic) {
    const parts = normalizeTopic(topic).split(/\s+/).slice(0, 4);
    return parts.map((p)=>`#${p.replace(/[^a-z0-9\u0600-\u06FF]/gi, '')}`).filter(Boolean);
}
function classifyScientificBlocks(context) {
    const defaultRefs = Array.from(new Set(context.slice(0, 2).map((x)=>x.referenceId)));
    const byKey = {
        definition: [],
        workingPrinciple: [],
        components: [],
        advantages: [],
        limitations: [],
        useCases: []
    };
    for (const item of context){
        const text = item.text;
        let matched = false;
        for (const rule of CATEGORY_RULES){
            if (rule.patterns.some((p)=>p.test(text))) {
                byKey[rule.key].push(item);
                matched = true;
                break;
            }
        }
        if (!matched) byKey.definition.push(item);
    }
    const pick = (arr, fallback)=>{
        const first = arr[0];
        if (!first) return {
            text: fallback,
            referenceIds: defaultRefs
        };
        const refs = Array.from(new Set(arr.slice(0, 2).map((x)=>x.referenceId)));
        return {
            text: first.text.slice(0, 260),
            referenceIds: refs
        };
    };
    return {
        definition: pick(byKey.definition, 'Definition pending further verified evidence.'),
        workingPrinciple: pick(byKey.workingPrinciple, 'Working principle requires additional validated context.'),
        components: pick(byKey.components, 'Core components were not explicitly identified in the selected context.'),
        advantages: pick(byKey.advantages, 'Advantages not explicitly available in selected verified snippets.'),
        limitations: pick(byKey.limitations, 'Limitations not explicitly available in selected verified snippets.'),
        useCases: pick(byKey.useCases, 'Use cases require additional verified references for precision.')
    };
}
function buildReelScript(topic, scientific) {
    const hook = `0-5s Hook: What makes ${topic} scientifically reliable in clinical workflows?`;
    const explanationA = `5-20s Explanation: ${scientific.definition.text}`;
    const explanationB = `20-35s Explanation: ${scientific.workingPrinciple.text}`;
    const insight = `35-45s Key Insight: ${scientific.advantages.text} Limitation note: ${scientific.limitations.text}`;
    const cta = `45-60s CTA: Review verified references before applying ${topic} in practice.`;
    return {
        durationSec: 60,
        text: [
            hook,
            explanationA,
            explanationB,
            insight,
            cta
        ].join('\n'),
        breakdown: [
            {
                at: '00:00',
                text: hook,
                referenceIds: scientific.definition.referenceIds
            },
            {
                at: '00:05',
                text: explanationA,
                referenceIds: scientific.definition.referenceIds
            },
            {
                at: '00:20',
                text: explanationB,
                referenceIds: scientific.workingPrinciple.referenceIds
            },
            {
                at: '00:35',
                text: insight,
                referenceIds: [
                    ...scientific.advantages.referenceIds,
                    ...scientific.limitations.referenceIds
                ]
            },
            {
                at: '00:45',
                text: cta,
                referenceIds: scientific.useCases.referenceIds
            }
        ]
    };
}
async function fetchPublicDomainImage(topic) {
    try {
        const q = encodeURIComponent(topic);
        const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${q}&gsrnamespace=6&prop=imageinfo&iiprop=url&format=json&origin=*`;
        const res = await fetch(url, {
            method: 'GET'
        });
        if (!res.ok) return null;
        const data = await res.json();
        const pages = data?.query?.pages ? Object.values(data.query.pages) : [];
        for (const page of pages){
            const img = page?.imageinfo?.[0]?.url;
            if (typeof img === 'string' && img.length > 0) return img;
        }
        return null;
    } catch  {
        return null;
    }
}
function buildImagePrompt(topic, scientific) {
    return [
        `Professional scientific illustration of ${topic}.`,
        'Technical medical-device accuracy, real scale proportions.',
        `Visible components: ${scientific.components.text}`,
        'Setting: modern laboratory/clinical engineering workstation.',
        'Lighting: realistic neutral white, high detail, no artistic stylization.',
        `Mechanism hint: ${scientific.workingPrinciple.text}`
    ].join(' ');
}
async function buildGeneratedContent(input, retrievalResults) {
    const safety = safetyValidate(input.topic);
    if (!safety.ok) {
        return {
            failureCode: safety.code,
            contentType: input.contentType || 'generic',
            script: '',
            caption: '',
            hashtags: [],
            voiceoverText: '',
            references: [],
            imageSourceUrl: null,
            imagePrompt: null,
            reel: null,
            citationTrace: []
        };
    }
    const context = assembleContext(retrievalResults);
    const contextText = context.map((x)=>x.text).join(' ');
    const hashtags = hashTagsFromTopic(input.topic);
    const scientific = classifyScientificBlocks(context);
    const contentType = input.contentType || 'scientific_device';
    const platformLabel = input.platform.toUpperCase();
    let script = '';
    let caption = '';
    let voiceoverText = '';
    let reel = null;
    let imageSourceUrl = null;
    let imagePrompt = null;
    const citationTrace = [];
    if (contentType === 'scientific_device') {
        script = [
            `Definition: ${scientific.definition.text}`,
            `Working Principle: ${scientific.workingPrinciple.text}`,
            `Components: ${scientific.components.text}`,
            `Advantages: ${scientific.advantages.text}`,
            `Limitations: ${scientific.limitations.text}`,
            `Use Cases: ${scientific.useCases.text}`
        ].join('\n\n');
        caption = `[${platformLabel}] ${input.topic}\nDefinition: ${scientific.definition.text}\nUse case: ${scientific.useCases.text}`;
        voiceoverText = `Today we explain ${input.topic}. ${scientific.definition.text}. It works by ${scientific.workingPrinciple.text}. Key limitation: ${scientific.limitations.text}.`;
        reel = input.includeReel ? buildReelScript(input.topic, scientific) : null;
        citationTrace.push({
            paragraph: 'Definition',
            referenceIds: scientific.definition.referenceIds
        }, {
            paragraph: 'Working Principle',
            referenceIds: scientific.workingPrinciple.referenceIds
        }, {
            paragraph: 'Components',
            referenceIds: scientific.components.referenceIds
        }, {
            paragraph: 'Advantages',
            referenceIds: scientific.advantages.referenceIds
        }, {
            paragraph: 'Limitations',
            referenceIds: scientific.limitations.referenceIds
        }, {
            paragraph: 'Use Cases',
            referenceIds: scientific.useCases.referenceIds
        });
        imageSourceUrl = await fetchPublicDomainImage(input.topic);
        if (!imageSourceUrl) {
            imagePrompt = buildImagePrompt(input.topic, scientific);
        }
    } else {
        const shortContext = contextText.slice(0, 600);
        script = `Hook: ${input.topic}\n\nKey insight: ${shortContext}\n\nAction: Apply this evidence in practice.`;
        caption = `[${platformLabel}] ${input.topic} - Evidence-based summary in a ${input.tone} tone.`;
        voiceoverText = `Today we discuss ${input.topic}. ${shortContext}. This guidance is based on verified references.`;
    }
    return {
        failureCode: null,
        contentType,
        script: script.slice(0, MAX_OUTPUT_CHARS),
        caption: caption.slice(0, 700),
        hashtags: hashtags.slice(0, 10),
        voiceoverText: voiceoverText.slice(0, MAX_OUTPUT_CHARS),
        references: Array.from(new Set(retrievalResults.map((r)=>r.reference.id))).slice(0, 8),
        imageSourceUrl,
        imagePrompt,
        reel,
        citationTrace: citationTrace.filter((c)=>c.referenceIds.length > 0)
    };
}
}),
"[project]/medical-content-platform/pages/api/content/generate.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$next__$5b$external$5d$__$28$next$2d$auth$2f$next$2c$__cjs$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$next$2d$auth$29$__ = __turbopack_context__.i("[externals]/next-auth/next [external] (next-auth/next, cjs, [project]/medical-content-platform/node_modules/next-auth)");
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$auth$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/auth.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/prisma.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$apiSecurity$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/apiSecurity.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$index$2e$ts__$5b$api$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/services/retrieval/index.ts [api] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$engine$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/services/retrieval/engine.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$embeddings$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/embeddings.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$contentGeneration$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/services/contentGeneration.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$logger$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/logger.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$embeddings$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$embeddings$2e$ts__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
async function handler(req, res) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$apiSecurity$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["setSecurityHeaders"])(res);
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$apiSecurity$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["enforceRateLimit"])(req, res, 'content-generate-ip', 60_000, 30)) return;
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$apiSecurity$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["enforceCsrfForMutation"])(req, res)) return;
    if (req.method !== 'POST') return res.status(405).end();
    const session = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth$2f$next__$5b$external$5d$__$28$next$2d$auth$2f$next$2c$__cjs$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$next$2d$auth$29$__["getServerSession"])(req, res, __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$auth$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"]);
    if (!session?.user?.id) return res.status(401).json({
        error: 'unauthorized'
    });
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$apiSecurity$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["enforceRateLimit"])(req, res, `content-generate-user-${session.user.id}`, 60 * 60 * 1000, 20)) return;
    const body = req.body;
    if (!body?.topic || !body?.tone || !body?.platform) {
        return res.status(400).json({
            error: 'topic, tone and platform are required'
        });
    }
    if (![
        'facebook',
        'instagram',
        'x'
    ].includes(body.platform)) {
        return res.status(400).json({
            error: 'invalid platform'
        });
    }
    if (body.contentType && ![
        'generic',
        'scientific_device'
    ].includes(body.contentType)) {
        return res.status(400).json({
            error: 'invalid contentType'
        });
    }
    const start = Date.now();
    try {
        const topKUsed = 12;
        const retrievalStart = Date.now();
        const retrieval = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$retrieval$2f$engine$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["runRetrievalQuery"])({
            query: body.topic,
            topK: topKUsed,
            page: 1
        }, {
            prisma: __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"],
            embedder: __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$embeddings$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["embedText"],
            logger: __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$logger$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"]
        });
        const retrievalLatencyMs = Date.now() - retrievalStart;
        const generated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$services$2f$contentGeneration$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["buildGeneratedContent"])(body, retrieval.results);
        const generationLatencyMs = Date.now() - start;
        const tokenUsageInput = Math.min(3000, Math.ceil((body.topic.length + retrieval.results.map((r)=>r.snippet.length).join('').length) / 4));
        const tokenUsageOutput = Math.ceil((generated.script.length + generated.caption.length + generated.voiceoverText.length) / 4);
        const generationCostEstimate = Number(((tokenUsageInput + tokenUsageOutput) * 0.000001).toFixed(6));
        const created = await __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].generatedContent.create({
            data: {
                userId: session.user.id,
                contentType: generated.contentType,
                topic: body.topic,
                tone: body.tone,
                platform: body.platform,
                script: generated.script,
                caption: generated.caption,
                hashtags: generated.hashtags,
                voiceoverText: generated.voiceoverText,
                imageSourceUrl: generated.imageSourceUrl,
                imagePrompt: generated.imagePrompt,
                generationCostEstimate,
                tokenUsageInput,
                tokenUsageOutput,
                generationLatencyMs,
                retrievalLatencyMs,
                topKUsed,
                probeUsed: Number(retrieval.meta.probeUsed || 0),
                failureCode: generated.failureCode,
                retryCount: 0,
                references: {
                    create: generated.references.map((referenceId)=>({
                            referenceId
                        }))
                }
            }
        });
        await __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].contentDraft.create({
            data: {
                generatedContentId: created.id,
                draftJson: JSON.stringify({
                    script: generated.script,
                    caption: generated.caption,
                    hashtags: generated.hashtags,
                    voiceoverText: generated.voiceoverText,
                    imageSourceUrl: generated.imageSourceUrl,
                    imagePrompt: generated.imagePrompt,
                    contentType: generated.contentType,
                    reelTimestampBreakdown: generated.reel?.breakdown || null,
                    citationTrace: generated.citationTrace || []
                }),
                version: 1
            }
        });
        if (generated.reel) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].reelScript.create({
                data: {
                    generatedContentId: created.id,
                    durationSec: generated.reel.durationSec,
                    scriptText: generated.reel.text,
                    timestampBreakdown: JSON.stringify(generated.reel.breakdown)
                }
            });
        }
        const out = {
            id: created.id,
            contentType: created.contentType,
            topic: created.topic,
            tone: created.tone,
            platform: created.platform,
            script: created.script,
            caption: created.caption,
            hashtags: created.hashtags,
            voiceoverText: created.voiceoverText,
            imageSourceUrl: created.imageSourceUrl,
            imagePrompt: created.imagePrompt,
            topKUsed: created.topKUsed,
            probeUsed: created.probeUsed,
            reelTimestampBreakdown: generated.reel?.breakdown || undefined,
            citationTrace: generated.citationTrace || [],
            generationCostEstimate: created.generationCostEstimate,
            tokenUsageInput: created.tokenUsageInput,
            tokenUsageOutput: created.tokenUsageOutput,
            generationLatencyMs: created.generationLatencyMs,
            retrievalLatencyMs: created.retrievalLatencyMs
        };
        __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$logger$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].info({
            event: 'content.generate',
            generatedContentId: created.id,
            contentType: created.contentType,
            retrievalLatencyMs,
            generationLatencyMs,
            tokenUsageInput,
            tokenUsageOutput,
            topKUsed,
            probeUsed: Number(retrieval.meta.probeUsed || 0),
            failureCode: generated.failureCode,
            retryCount: 0
        }, 'content generation completed');
        return res.status(201).json(out);
    } catch (err) {
        __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$logger$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].error({
            err
        }, 'content generation failed');
        return res.status(500).json({
            error: 'generation failed'
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2c4229a7._.js.map