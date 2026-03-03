"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.embedText = embedText;
exports.saveReferenceEmbedding = saveReferenceEmbedding;
exports.queryVectors = queryVectors;
const prisma_1 = __importDefault(require("./prisma"));
// Server-side embedding adapter (explicit raw SQL for vector ops)
async function embedText(text) {
    const OpenAI = await Promise.resolve().then(() => __importStar(require('openai')));
    const openai = new OpenAI.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const resp = await openai.embeddings.create({ model: 'text-embedding-3-small', input: text });
    return resp.data[0].embedding;
}
async function saveReferenceEmbedding(referenceId, embedding) {
    const vecLiteral = '[' + embedding.join(',') + ']';
    // Use unsafe raw execution because prisma doesn't know the vector type; inputs are internal
    return prisma_1.default.$executeRawUnsafe(`UPDATE "Reference" SET embedding = ${vecLiteral}::vector WHERE id = '${referenceId}'`);
}
async function queryVectors(queryEmbedding, topK = 5) {
    const vecLiteral = '[' + queryEmbedding.join(',') + ']';
    const rows = await prisma_1.default.$queryRawUnsafe(`
    SELECT id, "parsedText" as "pageContent", "deviceId", 1 - (embedding <=> ${vecLiteral}::vector) as similarity
    FROM "Reference"
    WHERE embedding IS NOT NULL
    ORDER BY similarity DESC
    LIMIT ${topK}
  `);
    return rows;
}
