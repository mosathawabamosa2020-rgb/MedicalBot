import type { NextApiRequest, NextApiResponse } from 'next'

// unauthenticated simple liveness check
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()
  res.status(200).json({ status: 'ok' })
}
