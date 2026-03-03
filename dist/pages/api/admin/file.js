"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function handler(req, res) {
    const name = req.query.name;
    if (typeof name !== 'string')
        return res.status(400).end();
    // restrict to uploads directory
    const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
    const safeName = path_1.default.basename(name);
    const full = path_1.default.join(uploadsDir, safeName);
    if (!fs_1.default.existsSync(full))
        return res.status(404).end();
    res.setHeader('Content-Type', 'application/pdf');
    const stream = fs_1.default.createReadStream(full);
    stream.pipe(res);
}
