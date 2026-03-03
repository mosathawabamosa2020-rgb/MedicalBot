"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_mocks_http_1 = require("node-mocks-http");
// mock Prisma to avoid hitting real DB
jest.mock('@prisma/client', () => {
    const mPrisma = {
        section: {
            findMany: jest.fn()
        },
        knowledgeChunk: {
            findMany: jest.fn()
        },
        $disconnect: jest.fn()
    };
    return { PrismaClient: jest.fn(() => mPrisma) };
});
const profile_1 = __importDefault(require("../pages/api/devices/[deviceId]/profile"));
describe('profile API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('returns sections with status when available', async () => {
        const { req, res } = (0, node_mocks_http_1.createMocks)({ method: 'GET', query: { deviceId: 'dev1' } });
        const fakeSections = [
            { title: 'A', content: '1', status: 'ingested' },
            { title: 'B', content: '2', status: 'verified' }
        ];
        const { PrismaClient } = require('@prisma/client');
        PrismaClient().section.findMany.mockResolvedValue(fakeSections);
        await (0, profile_1.default)(req, res);
        expect(res._getStatusCode()).toBe(200);
        const data = JSON.parse(res._getData());
        expect(data.profile).toEqual({ A: { content: '1', status: 'ingested' }, B: { content: '2', status: 'verified' } });
        expect(PrismaClient().section.findMany).toHaveBeenCalledWith({ where: { deviceId: 'dev1', status: { not: 'rejected' } }, orderBy: { order: 'asc' } });
    });
    test('falls back to knowledge chunks when no sections', async () => {
        const { req, res } = (0, node_mocks_http_1.createMocks)({ method: 'GET', query: { deviceId: 'dev2' } });
        const { PrismaClient } = require('@prisma/client');
        PrismaClient().section.findMany.mockResolvedValue([]);
        PrismaClient().knowledgeChunk.findMany.mockResolvedValue([
            { id: '1', content: 'C', category: 'Cat', pageNumber: 3 }
        ]);
        await (0, profile_1.default)(req, res);
        expect(res._getStatusCode()).toBe(200);
        const data = JSON.parse(res._getData());
        expect(data.profile).toHaveProperty('Cat');
        expect(data.profile.Cat[0]).toEqual({ id: '1', content: 'C', category: 'Cat', pageNumber: 3 });
    });
});
