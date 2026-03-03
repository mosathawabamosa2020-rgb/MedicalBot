"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// import { getQueue } from '../../../../lib/queue'
const PID_PATH = path_1.default.join(process.cwd(), 'data', 'scraper_pid.json');
const LOG_PATH = path_1.default.join(process.cwd(), 'data', 'scraper.log');
const STOP_FLAG = path_1.default.join(process.cwd(), 'data', 'scraper_stop.flag');
let controllerRunning = false;
async function handler(req, res) {
    if (req.method !== 'POST')
        return res.status(405).end();
    const { terms } = req.body;
    let termsArr = [];
    if (!terms)
        return res.status(400).json({ error: 'terms required' });
    if (Array.isArray(terms))
        termsArr = terms.map(t => String(t).trim()).filter(Boolean);
    else
        termsArr = String(terms).split(/\r?\n/).map(t => t.trim()).filter(Boolean);
    if (!termsArr.length)
        return res.status(400).json({ error: 'no search terms provided' });
    if (fs_1.default.existsSync(PID_PATH) || controllerRunning)
        return res.status(400).json({ error: 'Scraper already running' });
    // Single-process direct execution model: import compiled runScraper and call sequentially
    controllerRunning = true;
    try {
        const scraperModulePath = path_1.default.join(process.cwd(), 'dist', 'scripts', 'master_scraper');
        const { runScraper } = require(scraperModulePath);
        for (const term of termsArr) {
            if (fs_1.default.existsSync(STOP_FLAG))
                break;
            await runScraper(term);
        }
        return res.json({ ok: true, completedAt: new Date().toISOString(), termsCount: termsArr.length });
    }
    catch (e) {
        try {
            fs_1.default.appendFileSync(LOG_PATH, `\nStart error: ${String(e)}\n`);
        }
        catch (e) { }
        return res.status(500).json({ error: String(e) });
    }
    finally {
        controllerRunning = false;
    }
}
