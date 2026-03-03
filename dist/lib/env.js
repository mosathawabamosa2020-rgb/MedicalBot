"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).optional(),
    DATABASE_URL: zod_1.z.string().url(),
    NEXTAUTH_SECRET: zod_1.z.string().min(8),
    OPENAI_API_KEY: zod_1.z.string().min(10),
    REDIS_URL: zod_1.z.string().url().optional(),
    SERPAPI_KEY: zod_1.z.string().optional(),
});
exports.env = envSchema.safeParse(process.env);
if (!exports.env.success) {
    const issues = exports.env.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    // During tests, allow missing env but log a warning so test harness can run without real services.
    if (process.env.NODE_ENV === 'test') {
        // eslint-disable-next-line no-console
        console.warn('Environment validation issues (TEST):', issues);
    }
    else {
        throw new Error(`Environment validation failed: ${issues}`);
    }
}
exports.default = exports.env.data;
