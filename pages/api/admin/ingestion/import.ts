import type { NextApiRequest, NextApiResponse } from 'next'
import { withAdminAuth } from '../../../../lib/adminAuth'
import prisma from '../../../../lib/prisma'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { deviceId, pmid, title, authors, pubDate, sourceUrl } = req.body
  if (!deviceId || !pmid || !title) return res.status(400).json({ error: 'missing fields' })

  try {
    const dup = await prisma.reference.findFirst({ where: { deviceId, sourceName: 'PubMed', sourceId: pmid } })
    if (dup) return res.status(409).json({ error: 'duplicate', referenceId: dup.id })

    const ref = await prisma.reference.create({ data: {
      deviceId,
      title,
      sourceName: 'PubMed',
      sourceId: pmid,
      sourceUrl: sourceUrl || undefined,
      sourceReliabilityScore: 0.0,
      status: undefined
    } as any })

    await prisma.reference.update({ where: { id: ref.id }, data: { processingDate: null } })
    return res.status(201).json({ referenceId: ref.id })
  } catch (e: any) {
    console.error(e)
    return res.status(500).json({ error: e.message })
  }
}

export default withAdminAuth(handler)
