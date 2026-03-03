import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { embedText, queryVectors } from '../../../lib/embeddings'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { query, deviceId, topK } = req.body as { query?: string; deviceId?: string; topK?: number }
  if (!query) return res.status(400).json({ error: 'query required' })

  try {
    const qemb = await embedText(query)
    const results = await queryVectors(qemb, topK || 5)

    // enrich with reference metadata
    const enriched = await Promise.all(results.map(async (r: any) => {
      const ref = await prisma.reference.findUnique({ where: { id: r.id } })
      return {
        id: r.id,
        score: r.similarity,
        text: r.pageContent,
        reference: ref ? { id: ref.id, title: ref.title, filePath: ref.filePath, sourceUrl: ref.sourceUrl, deviceId: ref.deviceId } : null,
      }
    }))

    // if deviceId provided, filter by deviceId
    const filtered = deviceId ? enriched.filter((e) => e.reference && e.reference.deviceId === deviceId) : enriched

    return res.json({ results: filtered })
  } catch (err) {
    const logger = require('../../../lib/logger')
    logger.error(err)
    return res.status(500).json({ error: 'Query failed' })
  }
}
