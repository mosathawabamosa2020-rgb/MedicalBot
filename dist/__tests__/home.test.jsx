"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../pages/index");
jest.mock('next-auth/next', () => ({ getServerSession: jest.fn() }));
describe('root routing', () => {
    const { getServerSession } = require('next-auth/next');
    test('unauthenticated users go to signin', async () => {
        getServerSession.mockResolvedValue(null);
        const result = await (0, index_1.getServerSideProps)({ req: {}, res: {} });
        expect(result).toEqual({ redirect: { destination: '/auth/signin', permanent: false } });
    });
    test('admin users go to dashboard', async () => {
        getServerSession.mockResolvedValue({ user: { role: 'admin' } });
        const result = await (0, index_1.getServerSideProps)({ req: {}, res: {} });
        expect(result).toEqual({ redirect: { destination: '/admin/dashboard', permanent: false } });
    });
    test('reviewer users go to verification', async () => {
        getServerSession.mockResolvedValue({ user: { role: 'reviewer' } });
        const result = await (0, index_1.getServerSideProps)({ req: {}, res: {} });
        expect(result).toEqual({ redirect: { destination: '/admin/verification', permanent: false } });
    });
    test('editor users go to content-studio', async () => {
        getServerSession.mockResolvedValue({ user: { role: 'editor' } });
        const result = await (0, index_1.getServerSideProps)({ req: {}, res: {} });
        expect(result).toEqual({ redirect: { destination: '/admin/content-studio', permanent: false } });
    });
});
