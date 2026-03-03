// Local embedding generator using @xenova/transformers
// Usage: npm run local-embed (script added in package.json below)
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function run() {
    try {
        console.log('loading model... this may take a moment the first time');
        const { pipeline } = await Promise.resolve().then(() => __importStar(require('@xenova/transformers')));
        // model name covering sentence embeddings
        const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        const chunksPath = path.join(process.cwd(), 'data', 'chunks_to_embed.json');
        if (!fs.existsSync(chunksPath)) {
            console.error('chunks_to_embed.json not found; run export script first');
            process.exit(3);
        }
        const chunks = JSON.parse(fs.readFileSync(chunksPath, 'utf8'));
        console.log('CHUNKS_TO_EMBED', chunks.length);
        await p.$connect();
        for (const c of chunks) {
            try {
                const text = (c.content || '');
                const result = await embedder(text);
                // result may be a nested array: [1][dim] or [tokens][dim]
                let emb;
                if (Array.isArray(result)) {
                    if (Array.isArray(result[0][0])) {
                        // shape tokens x dim; average tokens
                        const dims = result[0][0].length;
                        emb = new Array(dims).fill(0);
                        const tokens = result[0];
                        tokens.forEach(tok => {
                            for (let i = 0; i < dims; i++)
                                emb[i] += tok[i];
                        });
                        emb = emb.map(v => v / tokens.length);
                    }
                    else {
                        // shape [dim]
                        emb = result[0];
                    }
                }
                if (!emb || !emb.length) {
                    console.warn('NO_EMBED', c.id);
                    continue;
                }
                const vecLiteral = '[' + emb.join(',') + ']';
                await p.$executeRawUnsafe(`UPDATE "KnowledgeChunk" SET embedding = ${vecLiteral}::vector WHERE id = '${c.id}'`);
                console.log('EMBEDDED', c.id);
            }
            catch (e) {
                console.error('EMBED_FAILED', c.id, e && e.message || e);
            }
            await new Promise(r => setTimeout(r, 150));
        }
        await p.$disconnect();
        console.log('DONE');
    }
    catch (e) {
        console.error('ERROR', e && e.stack || e);
        process.exit(1);
    }
}
run();
