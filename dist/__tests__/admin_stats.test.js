"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_mocks_http_1 = require("node-mocks-http");
jest.mock('@prisma/client', () => {
    const mPrisma = {
        reference: { count: jest.fn() },
        $disconnect: jest.fn(),
        $connect: jest.fn()
    };
    // expose minimal enum so ReferenceStatus.pending_ingestion works
    const ReferenceStatus = {
        pending_ingestion: 'pending_ingestion',
        processed: 'processed',
        verified: 'verified'
    };
    return { PrismaClient: jest.fn(() => mPrisma), ReferenceStatus };
});
jest.mock('next-auth/next', () => ({ getServerSession: jest.fn() }));
const { PrismaClient } = require('@prisma/client');
describe('admin stats API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('denies non-admin users', async () => {
        const { getServerSession } = require('next-auth/next');
        getServerSession.mockResolvedValue({ user: { role: 'editor' } });
        const { req, res } = (0, node_mocks_http_1.createMocks)({ method: 'GET' });
        const handler = require('../pages/api/admin/stats').default;
        await handler(req, res);
        expect(res._getStatusCode()).toBe(403);
    });
    test('returns counts for admin', async () => {
        const { getServerSession } = require('next-auth/next');
        getServerSession.mockResolvedValue({ user: { role: 'admin' } });
        PrismaClient().reference.count.mockImplementation(({ where }) => {
            if (where.status === 'pending_ingestion')
                return Promise.resolve(7);
            if (where.status === 'processed')
                return Promise.resolve(3);
            if (where.status === 'verified')
                return Promise.resolve(11);
            return Promise.resolve(0);
        });
        const { req, res } = (0, node_mocks_http_1.createMocks)({ method: 'GET' });
        const handler = require('../pages/api/admin/stats').default;
        await handler(req, res);
        expect(res._getStatusCode()).toBe(200);
        expect(JSON.parse(res._getData())).toEqual({ ingestedCount: 7, verificationCount: 3, knowledgeLibraryCount: 11 });
    });
});
