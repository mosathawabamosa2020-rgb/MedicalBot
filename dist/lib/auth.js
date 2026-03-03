"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authOptions = void 0;
const client_1 = require("@prisma/client");
const credentials_1 = __importDefault(require("next-auth/providers/credentials"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
let adapter = undefined;
try {
    // adapter is optional in tests if package not installed
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaAdapter } = require('@next-auth/prisma-adapter');
    adapter = PrismaAdapter(prisma);
}
catch (e) {
    // package not available in test env; proceed without adapter
    adapter = undefined;
}
exports.authOptions = {
    adapter,
    providers: [
        (0, credentials_1.default)({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!(credentials === null || credentials === void 0 ? void 0 : credentials.email) || !(credentials === null || credentials === void 0 ? void 0 : credentials.password))
                    return null;
                const user = await prisma.user.findUnique({ where: { email: credentials.email } });
                if (!user)
                    return null;
                const ok = await bcryptjs_1.default.compare(credentials.password, user.password);
                if (!ok)
                    return null;
                return { id: user.id, name: user.name, email: user.email, role: user.role };
            }
        })
    ],
    session: { strategy: 'jwt' },
    callbacks: {
        async jwt({ token, user }) {
            if (user)
                token.role = user.role || token.role;
            if (user) {
                // also store sub for compatibility with default NextAuth JWT
                token.sub = user.id || token.sub;
            }
            return token;
        },
        async session({ session, token }) {
            // avoid calling properties as functions; use token.sub for id
            if ((session === null || session === void 0 ? void 0 : session.user) && (token === null || token === void 0 ? void 0 : token.sub)) {
                session.user.id = token.sub;
            }
            if ((session === null || session === void 0 ? void 0 : session.user) && (token === null || token === void 0 ? void 0 : token.role)) {
                session.user.role = token.role;
            }
            return session;
        }
    }
};
exports.default = exports.authOptions;
