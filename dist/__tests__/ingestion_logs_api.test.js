"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_mocks_http_1 = require("node-mocks-http");
jest.mock('@prisma/client', () => {
    const mPrisma = {
        ingestionLog: { findMany: jest.fn() },
        $disconnect: jest.fn(),
        $connect: jest.fn()
    };
    return { PrismaClient: jest.fn(() => mPrisma) };
});
jest.mock('next-auth/next', () => ({ getServerSession: jest.fn() }));
const { PrismaClient } = require('@prisma/client');
describe('ingestion logs API', () => {
    beforeEach(() => jest.clearAllMocks());
    test('denies non-admin', async () => {
        const { getServerSession } = require('next-auth/next');
        getServerSession.mockResolvedValue({ user: { role: 'editor' } });
        const { req, res } = (0, node_mocks_http_1.createMocks)({ method: 'GET' });
        const handler = require('../pages/api/admin/ingestion/logs').default;
        await handler(req, res);
        expect(res._getStatusCode()).toBe(403);
    });
    test('returns log entries for admin', async () => {
        const { getServerSession } = require('next-auth/next');
        getServerSession.mockResolvedValue({ user: { role: 'admin' } });
        const fakeLogs = [{ id: 'l1', message: 'hi', createdAt: '2026-03-02T00:00:00Z' }];
        PrismaClient().ingestionLog.findMany.mockResolvedValue(fakeLogs);
        const { req, res } = (0, node_mocks_http_1.createMocks)({ method: 'GET' });
        const handler = require('../pages/api/admin/ingestion/logs').default;
        await handler(req, res);
        expect(res._getStatusCode()).toBe(200);
        expect(JSON.parse(res._getData())).toEqual({ logs: fakeLogs });
    });
});
