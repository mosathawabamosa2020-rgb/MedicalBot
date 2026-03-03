"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const prisma_1 = __importDefault(require("../../../../lib/prisma"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function handler(req, res) {
    if (req.method !== 'POST')
        return res.status(405).end();
    const { url, deviceId, title } = req.body;
    if (!url || !deviceId)
        return res.status(400).json({ error: 'url and deviceId required' });
    try {
        const resp = await fetch(url);
        if (!resp.ok)
            return res.status(400).json({ error: 'Failed to fetch URL' });
        const contentType = resp.headers.get('content-type') || '';
        const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
        if (!fs_1.default.existsSync(uploadsDir))
            fs_1.default.mkdirSync(uploadsDir);
        if (contentType.includes('pdf')) {
            const buffer = Buffer.from(await resp.arrayBuffer());
            const filename = `ref_${Date.now()}.pdf`;
            const filePath = path_1.default.join(uploadsDir, filename);
            fs_1.default.writeFileSync(filePath, buffer);
            const created = await prisma_1.default.reference.create({ data: { deviceId, title: title || filename, filePath } });
            return res.status(201).json({ created });
        }
        // For non-PDF: save HTML snapshot
        const text = await resp.text();
        const filename = `ref_${Date.now()}.html`;
        const filePath = path_1.default.join(uploadsDir, filename);
        fs_1.default.writeFileSync(filePath, text, 'utf8');
        const created = await prisma_1.default.reference.create({ data: { deviceId, title: title || filename, filePath, parsedText: text.substring(0, 2000) } });
        return res.status(201).json({ created });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Ingest failed' });
    }
}
