import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const name = req.query.name
  if (typeof name !== 'string') return res.status(400).end()
  // restrict to uploads directory
  const uploadsDir = path.join(process.cwd(), 'uploads')
  const safeName = path.basename(name)
  const full = path.join(uploadsDir, safeName)
  if (!fs.existsSync(full)) return res.status(404).end()
  res.setHeader('Content-Type', 'application/pdf')
  const stream = fs.createReadStream(full)
  stream.pipe(res)
}