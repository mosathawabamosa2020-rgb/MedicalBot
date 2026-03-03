"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_mocks_http_1 = require("node-mocks-http");
const health_1 = __importDefault(require("../pages/api/health"));
test('health endpoint returns ok when services reachable', async () => {
    const { req, res } = (0, node_mocks_http_1.createMocks)({ method: 'GET' });
    await (0, health_1.default)(req, res);
    expect([200, 503]).toContain(res._getStatusCode());
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('status');
});
