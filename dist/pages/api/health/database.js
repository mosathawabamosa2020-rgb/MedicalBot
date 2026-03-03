"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const prisma_1 = __importDefault(require("../../../lib/prisma"));
const logger_1 = __importDefault(require("../../../lib/logger"));
async function handler(req, res) {
    if (req.method !== 'GET')
        return res.status(405).end();
    try {
        await prisma_1.default.$queryRaw `SELECT 1`;
        return res.status(200).json({ status: 'ok' });
    }
    catch (err) {
        logger_1.default.error(err, 'database health check failed');
        return res.status(503).json({ status: 'error' });
    }
    finally {
        await prisma_1.default.$disconnect();
    }
}
