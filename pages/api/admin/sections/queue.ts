import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { withAdminAuth } from '../../../../lib/adminAuth'

const prisma = new PrismaClient()

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()
  try {
    const sections = await prisma.section.findMany({
      where: { status: 'ingested' },
      include: { reference: { select: { id: true, filePath: true, sourceUrl: true, title: true, version: true } } },
      orderBy: { createdAt: 'asc' }
    })
    return res.status(200).json(sections)
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'server error' })
  } finally {
    await prisma.$disconnect()
  }
}

export default withAdminAuth(handler)
