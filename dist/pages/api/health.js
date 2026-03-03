"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const logger_1 = __importDefault(require("../../lib/logger"));
const ioredis_1 = __importDefault(require("ioredis"));
const redisUrl = process.env.REDIS_URL || '';
async function handler(req, res) {
    try {
        // simple DB check
        await prisma_1.default.$queryRaw `SELECT 1`;
    }
    catch (e) {
        logger_1.default.error(e, 'Database health check failed');
        return res.status(503).json({ status: 'error', database: 'disconnected', redis: redisUrl ? 'unknown' : 'not-configured' });
    }
    if (redisUrl) {
        try {
            const r = new ioredis_1.default(redisUrl);
            await r.ping();
            await r.quit();
        }
        catch (e) {
            logger_1.default.error(e, 'Redis health check failed');
            return res.status(503).json({ status: 'error', database: 'connected', redis: 'disconnected' });
        }
    }
    return res.status(200).json({ status: 'ok', database: 'connected', redis: redisUrl ? 'connected' : 'not-configured' });
}
