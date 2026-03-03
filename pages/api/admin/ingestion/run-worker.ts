import type { NextApiRequest, NextApiResponse } from 'next'
import { withAdminAuth } from '../../../../lib/adminAuth'
import worker from '../../../../lib/workers/ingestionWorker'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  // trigger worker asynchronously
  worker.runIngestionWorker().then(() => console.log('worker finished')).catch(err => console.error('worker failed', err))

  return res.status(202).json({ status: 'accepted' })
}

export default withAdminAuth(handler)
