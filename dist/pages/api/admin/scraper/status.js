"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const PID_PATH = path_1.default.join(process.cwd(), 'data', 'scraper_pid.json');
const LOG_PATH = path_1.default.join(process.cwd(), 'data', 'scraper.log');
const STOP_FLAG = path_1.default.join(process.cwd(), 'data', 'scraper_stop.flag');
async function handler(req, res) {
    const status = { running: false };
    if (fs_1.default.existsSync(PID_PATH)) {
        const info = JSON.parse(fs_1.default.readFileSync(PID_PATH, 'utf8'));
        status.running = true;
        status.info = info;
    }
    if (fs_1.default.existsSync(STOP_FLAG))
        status.stopRequested = true;
    if (fs_1.default.existsSync(LOG_PATH))
        status.log = fs_1.default.readFileSync(LOG_PATH, 'utf8').slice(-20000);
    return res.json(status);
}
