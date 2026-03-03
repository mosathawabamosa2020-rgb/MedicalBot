"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
let logger;
function createLogger() {
    if (process.env.NODE_ENV !== 'production') {
        try {
            // pino.transport exists in newer pino versions; cast to any to avoid TS issues
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const transport = pino_1.default.transport ? pino_1.default.transport({ target: 'pino-pretty', options: { colorize: true } }) : undefined;
            return transport ? (0, pino_1.default)(transport) : (0, pino_1.default)();
        }
        catch (e) {
            return (0, pino_1.default)();
        }
    }
    return (0, pino_1.default)();
}
logger = createLogger();
exports.default = logger;
