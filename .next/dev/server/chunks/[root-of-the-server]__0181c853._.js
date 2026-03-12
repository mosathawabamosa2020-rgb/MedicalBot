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
"[project]/medical-content-platform/pages/api/auth/[...nextauth].ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth__$5b$external$5d$__$28$next$2d$auth$2c$__cjs$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$next$2d$auth$29$__ = __turbopack_context__.i("[externals]/next-auth [external] (next-auth, cjs, [project]/medical-content-platform/node_modules/next-auth)");
var __TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$auth$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/medical-content-platform/lib/auth.ts [api] (ecmascript)");
;
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$auth__$5b$external$5d$__$28$next$2d$auth$2c$__cjs$2c$__$5b$project$5d2f$medical$2d$content$2d$platform$2f$node_modules$2f$next$2d$auth$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$medical$2d$content$2d$platform$2f$lib$2f$auth$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["authOptions"]);
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0181c853._.js.map