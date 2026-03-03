"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../lib/auth");
describe('NextAuth callbacks', () => {
    test('jwt callback stores sub and role when user present', async () => {
        const token = {};
        const user = { id: '123', role: 'admin' };
        const result = await auth_1.authOptions.callbacks.jwt({ token, user });
        expect(result.sub).toBe('123');
        expect(result.role).toBe('admin');
    });
    test('session callback maps sub to session.user.id and role', async () => {
        const session = { user: {} };
        const token = { sub: '456', role: 'user' };
        const result = await auth_1.authOptions.callbacks.session({ session, token });
        expect(result.user.id).toBe('456');
        expect(result.user.role).toBe('user');
    });
});
