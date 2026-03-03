import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import authOptions from '../../../../lib/auth'
import prisma from '../../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = (await getServerSession(req, res, authOptions as any)) as any
  if (!session || session.user?.role !== 'admin') {
    return res.status(403).json({ error: 'forbidden' })
  }

  const { id } = req.query
  if (!id || Array.isArray(id)) return res.status(400).json({ error: 'invalid id' })

  if (req.method === 'GET') {
    const ref = await prisma.reference.findUnique({ where: { id: String(id) } })
    if (!ref) return res.status(404).json({ error: 'not found' })
    return res.status(200).json(ref)
  }
  res.status(405).end()
}
