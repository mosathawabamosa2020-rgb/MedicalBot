import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { withAdminAuth } from '../../../../../lib/adminAuth'

const prisma = new PrismaClient()

// simple in-memory rate limiter per user
const rateMap = new Map<string, { count: number; ts: number }>()
const WINDOW_MS = 60 * 1000
const MAX_PER_WINDOW = 10

async function handler(req: NextApiRequest, res: NextApiResponse, session?: any) {
  const { id } = req.query
  if (typeof id !== 'string') return res.status(400).json({ error: 'invalid id' })
  if (req.method !== 'POST') return res.status(405).end()

  // session guaranteed by wrapper
  const user = (session as any).user

  // rate limiting
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress) as string || 'anon'
  const key = user.id || ip || 'anon'
  const now = Date.now()
  const state = rateMap.get(key) || { count: 0, ts: now }
  if (now - state.ts > WINDOW_MS) { state.count = 0; state.ts = now }
  state.count += 1
  rateMap.set(key, state)
  if (state.count > MAX_PER_WINDOW) return res.status(429).json({ error: 'rate_limited' })

  try {
    const prev = await prisma.section.findUnique({ where: { id } })
    if (!prev) return res.status(404).json({ error: 'not found' })
    await prisma.section.update({ where: { id }, data: { status: 'verified' } })
    await (prisma as any).sectionAuditLog.create({ data: { sectionId: id, userId: user.id, previousStatus: prev.status as any, newStatus: 'verified' } })
    return res.status(200).json({ ok: true })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'server error' })
  } finally {
    await prisma.$disconnect()
  }
}

// wrap with admin guard
export default withAdminAuth(handler)