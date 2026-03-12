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
"[project]/medical-content-platform/pages/api/references/[id].ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/prisma.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end();
    const { id } = req.query;
    if (!id || Array.isArray(id)) return res.status(400).json({
        error: 'invalid id'
    });
    const ref = await __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$prisma$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].reference.findFirst({
        where: {
            id: String(id),
            status: 'verified'
        },
        include: {
            sections: {
                orderBy: {
                    order: 'asc'
                },
                select: {
                    id: true,
                    title: true,
                    content: true,
                    order: true,
                    createdAt: true
                }
            }
        }
    });
    if (!ref) return res.status(404).json({
        error: 'not found'
    });
    return res.status(200).json({
        id: ref.id,
        title: ref.title,
        sourceName: ref.sourceName,
        sourceUrl: ref.sourceUrl,
        uploadedAt: ref.uploadedAt.toISOString(),
        processingDate: ref.processingDate ? ref.processingDate.toISOString() : null,
        verificationBadge: 'verified',
        sections: ref.sections.map((s)=>({
                id: s.id,
                title: s.title,
                content: s.content,
                order: s.order,
                createdAt: s.createdAt.toISOString()
            }))
    });
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__40d0996e._.js.map