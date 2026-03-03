import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { embedText, queryVectors } from '../../../lib/embeddings'
import logger from '../../../lib/logger'

const TOPICS = ['common errors', 'calibration', 'maintenance', 'safety warnings']

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  try {
    const { deviceId } = req.body as { deviceId?: string }

    const devices = deviceId ? await prisma.device.findMany({ where: { id: deviceId } }) : await prisma.device.findMany()

    for (const device of devices) {
      // For each topic, run embedding + vector query, then store top results
      for (const topic of TOPICS) {
        const qemb = await embedText(topic)
        const matches = await queryVectors(qemb, 10)
        // filter for this device
        const deviceMatches = matches.filter((m: any) => m.deviceId === device.id)

        // clear previous suggestions for this device+topic
        await prisma.plannerSuggestion.deleteMany({ where: { deviceId: device.id, topic } })

        // create suggestions
        const toCreate = deviceMatches.slice(0, 5).map((m: any) => ({
          deviceId: device.id,
          topic,
          referenceId: m.referenceId,
          page: m.page,
          snippet: m.text.slice(0, 1000),
          score: m.score,
        }))

        for (const s of toCreate) {
          await prisma.plannerSuggestion.create({ data: s })
        }
      }
    }

    return res.json({ ok: true })
  } catch (err) {
    logger.error(err)
    return res.status(500).json({ error: 'Planner run failed' })
  }
}
