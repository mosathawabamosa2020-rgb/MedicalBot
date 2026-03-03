"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.default = handler;
const formidable_1 = __importDefault(require("formidable"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const prisma_1 = __importDefault(require("../../../lib/prisma"));
const embeddings_1 = require("../../../lib/embeddings");
const logger_1 = __importDefault(require("../../../lib/logger"));
exports.config = {
    api: {
        bodyParser: false,
    },
};
async function handler(req, res) {
    if (req.method !== 'POST')
        return res.status(405).end();
    const form = (0, formidable_1.default)({ multiples: false });
    form.parse(req, async (err, fields, files) => {
        try {
            if (err)
                return res.status(500).json({ error: 'Upload error' });
            const deviceId = fields.deviceId;
            if (!deviceId)
                return res.status(400).json({ error: 'deviceId required' });
            const file = files.file;
            if (!file)
                return res.status(400).json({ error: 'file required' });
            const data = fs_1.default.readFileSync(file.filepath);
            const pdfData = await (0, pdf_parse_1.default)(data);
            const text = pdfData.text || '';
            // split by pages using pdf.numpages if available or by simple heuristic
            const pages = [];
            if (pdfData.numpages) {
                // naive split: split on form feed if present
                const splitted = text.split('\f');
                for (const p of splitted)
                    pages.push(p.trim());
            }
            else {
                // fallback: split every 1500 chars
                for (let i = 0; i < text.length; i += 1500)
                    pages.push(text.slice(i, i + 1500));
            }
            // save file to uploads
            const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
            if (!fs_1.default.existsSync(uploadsDir))
                fs_1.default.mkdirSync(uploadsDir);
            const filename = `ref_upload_${Date.now()}.pdf`;
            const filepath = path_1.default.join(uploadsDir, filename);
            fs_1.default.writeFileSync(filepath, data);
            const ref = await prisma_1.default.reference.create({ data: { deviceId, title: fields.title || filename, filePath: filepath, pageCount: pages.length, parsedText: text.substring(0, 2000) } });
            // generate embeddings per page (async, but await for now)
            let indexed = 0;
            for (let i = 0; i < pages.length; i++) {
                const pageText = pages[i].trim();
                if (!pageText)
                    continue;
                const emb = await (0, embeddings_1.embedText)(pageText);
                try {
                    await (0, embeddings_1.saveReferenceEmbedding)(ref.id, emb);
                    indexed++;
                }
                catch (e) {
                    logger_1.default.error(e, 'Failed to update reference embedding');
                }
            }
            return res.status(201).json({ reference: ref, indexedPages: indexed });
        }
        catch (e) {
            logger_1.default.error(e);
            return res.status(500).json({ error: 'Parsing/indexing failed' });
        }
    });
}
