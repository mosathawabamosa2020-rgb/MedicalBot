import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

// public endpoint to browse verified references with simple pagination
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()
  const { page = '1', limit = '20' } = req.query as Record<string, string>
  const p = parseInt(page, 10)
  const l = parseInt(limit, 10)
  if (isNaN(p) || p < 1 || isNaN(l) || l < 1) {
    return res.status(400).json({ error: 'invalid pagination' })
  }
  const skip = (p - 1) * l
  const filter = { status: 'verified', sections: { some: {} } }
  const [items, total] = await Promise.all([
    prisma.reference.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
      skip,
      take: l
    }),
    prisma.reference.count({ where: filter })
  ])
  res.status(200).json({ items, total, page: p, limit: l })
}
