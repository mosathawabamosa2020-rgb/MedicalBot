"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
// unauthenticated simple liveness check
function handler(req, res) {
    if (req.method !== 'GET')
        return res.status(405).end();
    res.status(200).json({ status: 'ok' });
}
