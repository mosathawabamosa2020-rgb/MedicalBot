"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const LOG_PATH = path_1.default.join(process.cwd(), 'data', 'scraper.log');
function handler(req, res) {
    if (req.method !== 'GET')
        return res.status(405).end();
    if (!fs_1.default.existsSync(LOG_PATH))
        fs_1.default.writeFileSync(LOG_PATH, '');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    // send last chunk
    try {
        const tail = fs_1.default.readFileSync(LOG_PATH, 'utf8').slice(-20000);
        if (tail)
            res.write(`data: ${JSON.stringify(tail)}\n\n`);
    }
    catch (e) { }
    let lastSize = fs_1.default.statSync(LOG_PATH).size;
    if (!lastSize)
        lastSize = 0;
    const watcher = fs_1.default.watch(LOG_PATH, (event) => {
        try {
            const stats = fs_1.default.statSync(LOG_PATH);
            if (stats.size > lastSize) {
                const stream = fs_1.default.createReadStream(LOG_PATH, { start: lastSize, end: stats.size - 1, encoding: 'utf8' });
                let buf = '';
                stream.on('data', (c) => { buf += c; });
                stream.on('end', () => {
                    lastSize = stats.size;
                    // send as single event
                    res.write(`data: ${JSON.stringify(buf)}\n\n`);
                });
            }
        }
        catch (e) { /* ignore */ }
    });
    req.on('close', () => {
        try {
            watcher.close();
        }
        catch (e) { }
        res.end();
    });
}
