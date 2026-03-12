module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[project]/lib/ops/readiness.js [api] (ecmascript)", ((__turbopack_context__, module, exports) => {

const fs = __turbopack_context__.r("[externals]/node:fs [external] (node:fs, cjs)");
const path = __turbopack_context__.r("[externals]/node:path [external] (node:path, cjs)");
const DEFAULT_TIMEOUT_MS = 3000;
function nowMs() {
    return Date.now();
}
function withTimeout(promiseFactory, timeoutMs, timeoutCode) {
    return new Promise((resolve)=>{
        const timer = setTimeout(()=>resolve({
                timedOut: true,
                timeoutCode
            }), timeoutMs);
        Promise.resolve().then(promiseFactory).then((value)=>{
            clearTimeout(timer);
            resolve({
                timedOut: false,
                value
            });
        }).catch((error)=>{
            clearTimeout(timer);
            resolve({
                timedOut: false,
                error
            });
        });
    });
}
function normalizeCheck(name, required, status, message, details, startedAt) {
    return {
        name,
        required,
        status,
        message,
        details: details || null,
        durationMs: Math.max(0, nowMs() - startedAt)
    };
}
async function checkDatabase(timeoutMs, opts = {}) {
    const startedAt = nowMs();
    const checkFn = opts.checkDatabase;
    const probe = async ()=>{
        if (typeof checkFn === 'function') return checkFn();
        const { PrismaClient } = __turbopack_context__.r("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
        const prisma = new PrismaClient();
        try {
            await prisma.$queryRaw`SELECT 1`;
            await prisma.$disconnect();
            return {
                ok: true
            };
        } catch (error) {
            await prisma.$disconnect().catch(()=>null);
            throw error;
        }
    };
    const result = await withTimeout(probe, timeoutMs, 'db_timeout');
    if (result.timedOut) return normalizeCheck('database', true, 'blocked', 'database check timed out', result.timeoutCode, startedAt);
    if (result.error) return normalizeCheck('database', true, 'blocked', result.error.message || 'database check failed', null, startedAt);
    return normalizeCheck('database', true, 'ok', 'database query succeeded', null, startedAt);
}
async function checkRedis(timeoutMs, opts = {}) {
    const startedAt = nowMs();
    const redisUrl = opts.redisUrl || process.env.REDIS_URL || '';
    if (!redisUrl) {
        return normalizeCheck('redis', false, 'not_configured', 'REDIS_URL not configured', null, startedAt);
    }
    const checkFn = opts.checkRedis;
    const probe = async ()=>{
        if (typeof checkFn === 'function') return checkFn(redisUrl);
        const Redis = __turbopack_context__.r("[externals]/ioredis [external] (ioredis, cjs, [project]/node_modules/ioredis)");
        const redis = new Redis(redisUrl, {
            lazyConnect: true,
            maxRetriesPerRequest: 1
        });
        try {
            await redis.connect();
            await redis.ping();
            await redis.quit();
            return {
                ok: true
            };
        } catch (error) {
            try {
                await redis.quit();
            } catch  {}
            throw error;
        }
    };
    const result = await withTimeout(probe, timeoutMs, 'redis_timeout');
    if (result.timedOut) return normalizeCheck('redis', false, 'degraded', 'redis check timed out', result.timeoutCode, startedAt);
    if (result.error) return normalizeCheck('redis', false, 'degraded', result.error.message || 'redis check failed', null, startedAt);
    return normalizeCheck('redis', false, 'ok', 'redis ping succeeded', null, startedAt);
}
function checkEnvRequired(opts = {}) {
    const startedAt = nowMs();
    const env = opts.env || process.env;
    const requiredVars = opts.requiredEnv || [
        'DATABASE_URL',
        'NEXTAUTH_SECRET'
    ];
    const missing = requiredVars.filter((name)=>!env[name]);
    if (missing.length > 0) {
        return normalizeCheck('environment', true, 'blocked', `missing required env vars: ${missing.join(', ')}`, {
            missing
        }, startedAt);
    }
    return normalizeCheck('environment', true, 'ok', 'required env vars are present', null, startedAt);
}
function checkWritablePath(name, filePath, required) {
    const startedAt = nowMs();
    const abs = path.join(process.cwd(), filePath);
    try {
        const dir = path.dirname(abs);
        fs.mkdirSync(dir, {
            recursive: true
        });
        if (!fs.existsSync(abs)) {
            return normalizeCheck(name, required, required ? 'degraded' : 'not_configured', `${filePath} missing`, {
                path: filePath
            }, startedAt);
        }
        fs.accessSync(abs, fs.constants.W_OK);
        return normalizeCheck(name, required, 'ok', `${filePath} writable`, {
            path: filePath
        }, startedAt);
    } catch (error) {
        return normalizeCheck(name, required, required ? 'blocked' : 'degraded', error.message || `${filePath} check failed`, {
            path: filePath
        }, startedAt);
    }
}
function checkBackupManifest() {
    const startedAt = nowMs();
    const filePath = path.join('artifacts', 'backups', 'latest.json');
    const abs = path.join(process.cwd(), filePath);
    if (!fs.existsSync(abs)) {
        return normalizeCheck('backup_manifest', false, 'not_configured', 'backup manifest missing', {
            path: filePath
        }, startedAt);
    }
    return normalizeCheck('backup_manifest', false, 'ok', 'backup manifest found', {
        path: filePath
    }, startedAt);
}
function deriveOverallStatus(checks) {
    const values = Object.values(checks);
    const required = values.filter((c)=>c.required);
    const optional = values.filter((c)=>!c.required);
    const hasRequiredFailure = required.some((c)=>c.status !== 'ok');
    if (hasRequiredFailure) return 'blocked';
    const hasOptionalIssue = optional.some((c)=>c.status !== 'ok');
    if (hasOptionalIssue) return 'degraded';
    return 'ok';
}
async function getReadinessSnapshot(opts = {}) {
    const timeoutMs = Number(opts.timeoutMs || process.env.HEALTH_CHECK_TIMEOUT_MS || DEFAULT_TIMEOUT_MS);
    const checks = {};
    checks.environment = checkEnvRequired(opts);
    checks.database = await checkDatabase(timeoutMs, opts);
    checks.redis = await checkRedis(timeoutMs, opts);
    checks.settings_store = checkWritablePath('settings_store', path.join('data', 'platform-settings.json'), true);
    checks.audit_trail = checkWritablePath('audit_trail', path.join('data', 'audit-trail.log'), true);
    checks.backup_manifest = checkBackupManifest();
    const overall = deriveOverallStatus(checks);
    return {
        generatedAt: new Date().toISOString(),
        timeoutMs,
        checks,
        overallStatus: overall,
        summary: {
            requiredOk: Object.values(checks).filter((c)=>c.required && c.status === 'ok').length,
            requiredTotal: Object.values(checks).filter((c)=>c.required).length,
            optionalIssues: Object.values(checks).filter((c)=>!c.required && c.status !== 'ok').length
        }
    };
}
module.exports = {
    getReadinessSnapshot,
    deriveOverallStatus
};
}),
"[project]/pages/api/health.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ops$2f$readiness$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/ops/readiness.js [api] (ecmascript)");
;
async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({
        error: 'method not allowed'
    });
    const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$ops$2f$readiness$2e$js__$5b$api$5d$__$28$ecmascript$29$__["getReadinessSnapshot"])();
    const httpStatus = snapshot.overallStatus === 'blocked' ? 503 : 200;
    return res.status(httpStatus).json({
        status: snapshot.overallStatus,
        model: {
            liveness: '/api/health/system',
            readiness: '/api/health',
            dependencies: '/api/health/dependencies'
        },
        readiness: snapshot.overallStatus,
        checks: snapshot.checks,
        summary: snapshot.summary
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__284bf28a._.js.map