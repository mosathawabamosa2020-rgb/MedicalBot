"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_mocks_http_1 = require("node-mocks-http");
// import handlers
const system_1 = __importDefault(require("../pages/api/health/system"));
const database_1 = __importDefault(require("../pages/api/health/database"));
// mock prisma and logger for database endpoint
jest.mock('@prisma/client', () => {
    const mPrisma = {
        $queryRaw: jest.fn(),
        $disconnect: jest.fn()
    };
    return { PrismaClient: jest.fn(() => mPrisma) };
});
jest.mock('../lib/logger');
describe('health endpoints', () => {
    test('/api/health/system returns ok', async () => {
        const { req, res } = (0, node_mocks_http_1.createMocks)({ method: 'GET' });
        await (0, system_1.default)(req, res);
        expect(res._getStatusCode()).toBe(200);
        expect(JSON.parse(res._getData())).toEqual({ status: 'ok' });
    });
    test('/api/health/system rejects other methods', async () => {
        const { req, res } = (0, node_mocks_http_1.createMocks)({ method: 'POST' });
        await (0, system_1.default)(req, res);
        expect(res._getStatusCode()).toBe(405);
    });
    test('/api/health/database returns ok when query succeeds', async () => {
        const { req, res } = (0, node_mocks_http_1.createMocks)({ method: 'GET' });
        const { PrismaClient } = require('@prisma/client');
        PrismaClient().$queryRaw.mockResolvedValue(1);
        await (0, database_1.default)(req, res);
        expect(res._getStatusCode()).toBe(200);
        expect(JSON.parse(res._getData())).toEqual({ status: 'ok' });
    });
    test('/api/health/database returns error when query fails', async () => {
        const { req, res } = (0, node_mocks_http_1.createMocks)({ method: 'GET' });
        const { PrismaClient } = require('@prisma/client');
        PrismaClient().$queryRaw.mockRejectedValue(new Error('nope'));
        await (0, database_1.default)(req, res);
        expect(res._getStatusCode()).toBe(503);
        expect(JSON.parse(res._getData())).toEqual({ status: 'error' });
    });
    test('/api/health/database rejects non-GET', async () => {
        const { req, res } = (0, node_mocks_http_1.createMocks)({ method: 'DELETE' });
        await (0, database_1.default)(req, res);
        expect(res._getStatusCode()).toBe(405);
    });
});
