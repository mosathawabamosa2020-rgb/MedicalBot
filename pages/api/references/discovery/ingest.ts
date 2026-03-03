import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../lib/prisma'
import fs from 'fs'
import path from 'path'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { url, deviceId, title } = req.body as { url?: string; deviceId?: string; title?: string }
  if (!url || !deviceId) return res.status(400).json({ error: 'url and deviceId required' })

  try {
    const resp = await fetch(url)
    if (!resp.ok) return res.status(400).json({ error: 'Failed to fetch URL' })

    const contentType = resp.headers.get('content-type') || ''
    const uploadsDir = path.join(process.cwd(), 'uploads')
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)

    if (contentType.includes('pdf')) {
      const buffer = Buffer.from(await resp.arrayBuffer())
      const filename = `ref_${Date.now()}.pdf`
      const filePath = path.join(uploadsDir, filename)
      fs.writeFileSync(filePath, buffer)

      const created = await prisma.reference.create({ data: { deviceId, title: title || filename, filePath } })
      return res.status(201).json({ created })
    }

    // For non-PDF: save HTML snapshot
    const text = await resp.text()
    const filename = `ref_${Date.now()}.html`
    const filePath = path.join(uploadsDir, filename)
    fs.writeFileSync(filePath, text, 'utf8')
    const created = await prisma.reference.create({ data: { deviceId, title: title || filename, filePath, parsedText: text.substring(0, 2000) } })
    return res.status(201).json({ created })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Ingest failed' })
  }
}
