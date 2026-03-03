import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import logger from '../../../lib/logger'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { deviceId, id } = req.query
    if (id) {
      const sid = Array.isArray(id) ? id[0] : id
      const suggestion = await prisma.plannerSuggestion.findUnique({ where: { id: sid }, include: { device: true } })
      if (!suggestion) return res.status(404).json({ error: 'Not found' })
      // enrich with reference if present
      if (suggestion.referenceId) {
        const ref = await prisma.reference.findUnique({ where: { id: suggestion.referenceId } })
        // attach minimal reference data
        // convert to plain object to add property
        const out = { ...suggestion, reference: ref ? { id: ref.id, title: ref.title, filePath: ref.filePath, sourceUrl: ref.sourceUrl } : null }
        return res.json(out)
      }
      return res.json(suggestion)
    }
    if (!deviceId || Array.isArray(deviceId)) return res.status(400).json({ error: 'deviceId required' })
    const suggestions = await prisma.plannerSuggestion.findMany({ where: { deviceId: deviceId as string }, orderBy: { score: 'desc' } })
    return res.json({ suggestions })
  } catch (err) {
    logger.error(err)
    return res.status(500).json({ error: 'Failed to fetch suggestions' })
  }
}
