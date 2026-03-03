"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const next_1 = require("next-auth/next");
const auth_1 = __importDefault(require("../../../../../lib/auth"));
const ingestionWorker_1 = require("../../../../../lib/workers/ingestionWorker");
async function handler(req, res) {
    var _a;
    if (req.method !== 'POST')
        return res.status(405).end();
    const session = (await (0, next_1.getServerSession)(req, res, auth_1.default));
    if (!session || ((_a = session.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin')
        return res.status(403).json({ error: 'forbidden' });
    const { referenceId } = req.query;
    if (!referenceId || Array.isArray(referenceId))
        return res.status(400).json({ error: 'invalid id' });
    // trigger processing asynchronously
    (0, ingestionWorker_1.processReferenceById)(referenceId).then(result => console.log('processed', result)).catch(err => console.error('process failed', err));
    return res.status(202).json({ status: 'accepted' });
}
