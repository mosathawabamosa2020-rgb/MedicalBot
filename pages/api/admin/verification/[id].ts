import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import authOptions from '../../../../lib/auth'
import prisma from '../../../../lib/prisma'
import { assertTransition } from '../../../../lib/referenceState'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = (await getServerSession(req, res, authOptions as any)) as any
  if (!session || session.user?.role !== 'admin') {
    return res.status(403).json({ error: 'forbidden' })
  }

  const { id } = req.query
  if (!id || Array.isArray(id)) return res.status(400).json({ error: 'invalid id' })

  if (req.method !== 'POST') return res.status(405).end()

  const { decision, comment } = req.body as { decision: 'approved' | 'rejected'; comment?: string }
  if (!decision || (decision !== 'approved' && decision !== 'rejected')) {
    return res.status(400).json({ error: 'invalid decision' })
  }

  // perform update and log in a single transaction for atomicity
  try {
    const txResult = await prisma.$transaction(async (tx) => {
      const upd = await tx.reference.updateMany({
        where: { id, status: 'pending_review' },
        data: { status: decision === 'approved' ? 'verified' : 'rejected' }
      })
      if (upd.count === 0) {
        // treat as conflict, abort transaction by throwing
        throw new Error('state_conflict')
      }
      await tx.verificationLog.create({ data: {
        referenceId: id,
        reviewerId: session.user.id,
        decision,
        comment: comment || null
      } })
      return upd
    })
    // if we reach here, transaction committed with count
    // txResult not used further
  } catch (e: any) {
    if (e.message === 'state_conflict') {
      return res.status(409).json({ error: 'state conflict' })
    }
    console.error('transaction failed', e)
    return res.status(500).json({ error: 'server error' })
  }

  try {
    assertTransition('pending_review', decision === 'approved' ? 'verified' : 'rejected')
  } catch (e: any) {
    // should not happen, but log
    console.error('transition assertion failed', e.message)
  }

  res.status(200).json({ ok: true })
}
