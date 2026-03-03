import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { withAdminAuth } from '../../../lib/adminAuth'

// replicate computeMetrics logic from tools
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()
  const prisma = new PrismaClient()
  try {
    await prisma.$connect()
    const deviceCount = await prisma.device.count()
    const articleCount = await prisma.reference.count()
    const sectionCount = await prisma.section.count()
    const statusBreakdown = await prisma.section.groupBy({ by: ['status'], _count: { status: true } })
    res.status(200).json({ deviceCount, articleCount, sectionCount, statusBreakdown })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'server error' })
  } finally {
    await prisma.$disconnect()
  }
}

export default withAdminAuth(handler)