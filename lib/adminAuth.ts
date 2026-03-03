import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import authOptions from './auth'

export type NextHandler = (req: NextApiRequest, res: NextApiResponse, session?: any) => Promise<any> | any

export function withAdminAuth(handler: NextHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = (await getServerSession(req, res, authOptions as any)) as any
    if (!session || session.user?.role !== 'admin') {
      return res.status(403).json({ error: 'forbidden' })
    }
    // pass session through in case handler needs it
    return handler(req, res, session)
  }
}
