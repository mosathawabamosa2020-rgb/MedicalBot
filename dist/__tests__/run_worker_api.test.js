"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_mocks_http_1 = require("node-mocks-http");
jest.mock('../lib/workers/ingestionWorker', () => ({
    runIngestionWorker: jest.fn().mockResolvedValue(undefined)
}));
jest.mock('next-auth/next', () => ({ getServerSession: jest.fn() }));
const { runIngestionWorker } = require('../lib/workers/ingestionWorker');
describe('run-worker endpoint', () => {
    beforeEach(() => jest.clearAllMocks());
    test('rejects non-post methods', async () => {
        const { req, res } = (0, node_mocks_http_1.createMocks)({ method: 'GET' });
        const handler = require('../pages/api/admin/ingestion/run-worker').default;
        await handler(req, res);
        expect(res._getStatusCode()).toBe(405);
    });
    test('forbids non-admin', async () => {
        const { getServerSession } = require('next-auth/next');
        getServerSession.mockResolvedValue({ user: { role: 'editor' } });
        const { req, res } = (0, node_mocks_http_1.createMocks)({ method: 'POST' });
        const handler = require('../pages/api/admin/ingestion/run-worker').default;
        await handler(req, res);
        expect(res._getStatusCode()).toBe(403);
        expect(runIngestionWorker).not.toHaveBeenCalled();
    });
    test('accepts admin and triggers worker', async () => {
        const { getServerSession } = require('next-auth/next');
        getServerSession.mockResolvedValue({ user: { role: 'admin' } });
        const { req, res } = (0, node_mocks_http_1.createMocks)({ method: 'POST' });
        const handler = require('../pages/api/admin/ingestion/run-worker').default;
        await handler(req, res);
        expect(res._getStatusCode()).toBe(202);
        expect(runIngestionWorker).toHaveBeenCalled();
    });
});
