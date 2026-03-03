"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_mocks_http_1 = require("node-mocks-http");
jest.mock('@prisma/client', () => {
    const mPrisma = {
        section: { findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), groupBy: jest.fn(), count: jest.fn() },
        sectionAuditLog: { create: jest.fn() },
        reference: { count: jest.fn() },
        device: { count: jest.fn() },
        $disconnect: jest.fn(),
        $connect: jest.fn()
    };
    return { PrismaClient: jest.fn(() => mPrisma) };
});
jest.mock('next-auth/next', () => ({ getServerSession: jest.fn(async () => ({ user: { id: 'u1', role: 'admin' } })) }));
const { PrismaClient } = require('@prisma/client');
describe('admin sections API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('queue returns ingested sections', async () => {
        const fake = [{ id: '1', title: 'T', content: 'C', reference: { id: 'r1', filePath: '/u/f.pdf' } }];
        PrismaClient().section.findMany.mockResolvedValue(fake);
        const { req, res } = (0, node_mocks_http_1.createMocks)({ method: 'GET' });
        const handler = require('../pages/api/admin/sections/queue').default;
        await handler(req, res);
        expect(res._getStatusCode()).toBe(200);
        expect(JSON.parse(res._getData())).toEqual(fake);
    });
    test('detail GET returns single section', async () => {
        const fake = { id: '1', title: 'T', content: 'C', reference: { id: 'r1' } };
        PrismaClient().section.findUnique.mockResolvedValue(fake);
        const { req, res } = (0, node_mocks_http_1.createMocks)({ method: 'GET', query: { id: '1' } });
        const handler = require('../pages/api/admin/sections/[id]').default;
        await handler(req, res);
        expect(res._getStatusCode()).toBe(200);
        expect(JSON.parse(res._getData())).toEqual(fake);
    });
    test('verify POST updates status', async () => {
        PrismaClient().section.findUnique.mockResolvedValue({ id: '1', status: 'ingested' });
        PrismaClient().section.update.mockResolvedValue({});
        const { req, res } = (0, node_mocks_http_1.createMocks)({ method: 'POST', query: { id: '1' } });
        const handler = require('../pages/api/admin/sections/[id]/verify').default;
        await handler(req, res);
        expect(res._getStatusCode()).toBe(200);
        expect(PrismaClient().section.update).toHaveBeenCalledWith({ where: { id: '1' }, data: { status: 'verified' } });
        expect(PrismaClient().sectionAuditLog.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ sectionId: '1', userId: 'u1', previousStatus: 'ingested', newStatus: 'verified' }) }));
    });
    test('reject POST updates status', async () => {
        PrismaClient().section.findUnique.mockResolvedValue({ id: '1', status: 'ingested' });
        PrismaClient().section.update.mockResolvedValue({});
        const { req, res } = (0, node_mocks_http_1.createMocks)({ method: 'POST', query: { id: '1' } });
        const handler = require('../pages/api/admin/sections/[id]/reject').default;
        await handler(req, res);
        expect(res._getStatusCode()).toBe(200);
        expect(PrismaClient().section.update).toHaveBeenCalledWith({ where: { id: '1' }, data: { status: 'rejected' } });
        expect(PrismaClient().sectionAuditLog.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ sectionId: '1', userId: 'u1', previousStatus: 'ingested', newStatus: 'rejected' }) }));
    });
    test('metrics returns counts', async () => {
        PrismaClient().device.count.mockResolvedValue(5);
        PrismaClient().reference.count.mockResolvedValue(10);
        PrismaClient().section.count.mockResolvedValue(20);
        PrismaClient().section.groupBy.mockResolvedValue([{ status: 'ingested', _count: { status: 15 } }]);
        const { req, res } = (0, node_mocks_http_1.createMocks)({ method: 'GET' });
        const handler = require('../pages/api/admin/metrics').default;
        await handler(req, res);
        expect(res._getStatusCode()).toBe(200);
        const data = JSON.parse(res._getData());
        expect(data).toMatchObject({ deviceCount: 5, articleCount: 10, sectionCount: 20 });
    });
});
