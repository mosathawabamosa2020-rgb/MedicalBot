"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
describe('admin dashboard page', () => {
    test('contains placeholder metrics and navigation links', () => {
        const file = fs_1.default.readFileSync(path_1.default.join(__dirname, '../pages/admin/dashboard.tsx'), 'utf8');
        expect(file).toMatch(/New Items Ingested/);
        expect(file).toMatch(/Items Pending Verification/);
        expect(file).toMatch(/Knowledge Library Count/);
        expect(file).toMatch(/User Activity Log/);
        expect(file).toMatch(/href="\/admin\/research"/);
        expect(file).toMatch(/href="\/admin\/verification"/);
        expect(file).toMatch(/href="\/admin\/ingestion-monitor"/);
        expect(file).toMatch(/useSWR/); // dashboard uses SWR for stats
        expect(file).toMatch(/\/api\/admin\/stats/); // ensures endpoint is referenced
    });
});
