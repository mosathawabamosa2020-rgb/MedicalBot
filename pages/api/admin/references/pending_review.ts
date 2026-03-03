import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import authOptions from '../../../../lib/auth'
import prisma from '../../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = (await getServerSession(req, res, authOptions as any)) as any
  if (!session || session.user?.role !== 'admin') {
    return res.status(403).json({ error: 'forbidden' })
  }

  if (req.method !== 'GET') return res.status(405).end()

  const refs = await prisma.reference.findMany({
    where: { status: 'pending_review' },
    select: { id: true, title: true, authors: true, journal: true }
  })
  res.status(200).json(refs)
}
