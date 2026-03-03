import prisma from './prisma'

// Server-side embedding adapter (explicit raw SQL for vector ops)
export async function embedText(text: string) {
  const OpenAI = await import('openai')
  const openai = new OpenAI.OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const resp = await openai.embeddings.create({ model: 'text-embedding-3-small', input: text })
  return resp.data[0].embedding as number[]
}

export async function saveReferenceEmbedding(referenceId: string, embedding: number[]) {
  const vecLiteral = '[' + embedding.join(',') + ']'
  // Use unsafe raw execution because prisma doesn't know the vector type; inputs are internal
  return prisma.$executeRawUnsafe(`UPDATE "Reference" SET embedding = ${vecLiteral}::vector WHERE id = '${referenceId}'`)
}

export async function queryVectors(queryEmbedding: number[], topK = 5) {
  const vecLiteral = '[' + queryEmbedding.join(',') + ']'
  const rows: any[] = await prisma.$queryRawUnsafe(`
    SELECT id, "parsedText" as "pageContent", "deviceId", 1 - (embedding <=> ${vecLiteral}::vector) as similarity
    FROM "Reference"
    WHERE embedding IS NOT NULL
    ORDER BY similarity DESC
    LIMIT ${topK}
  `)
  return rows
}

