import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import logger from '../../lib/logger'
import Redis from 'ioredis'

const redisUrl = process.env.REDIS_URL || ''

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // simple DB check
    await prisma.$queryRaw`SELECT 1`
  } catch (e: any) {
    logger.error(e, 'Database health check failed')
    return res.status(503).json({ status: 'error', database: 'disconnected', redis: redisUrl ? 'unknown' : 'not-configured' })
  }

  if (redisUrl) {
    try {
      const r = new Redis(redisUrl)
      await r.ping()
      await r.quit()
    } catch (e: any) {
      logger.error(e, 'Redis health check failed')
      return res.status(503).json({ status: 'error', database: 'connected', redis: 'disconnected' })
    }
  }

  return res.status(200).json({ status: 'ok', database: 'connected', redis: redisUrl ? 'connected' : 'not-configured' })
}
