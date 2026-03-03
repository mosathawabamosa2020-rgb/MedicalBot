import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import pdf from 'pdf-parse'
import prisma from '../../../lib/prisma'
import { embedText, saveReferenceEmbedding } from '../../../lib/embeddings'
import logger from '../../../lib/logger'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const form = formidable({ multiples: false })
  form.parse(req as any, async (err, fields, files) => {
    try {
      if (err) return res.status(500).json({ error: 'Upload error' })
      const deviceId = fields.deviceId as string
      if (!deviceId) return res.status(400).json({ error: 'deviceId required' })

      const file = files.file as formidable.File
      if (!file) return res.status(400).json({ error: 'file required' })

      const data = fs.readFileSync(file.filepath)
      const pdfData = await pdf(data)
      const text = pdfData.text || ''

      // split by pages using pdf.numpages if available or by simple heuristic
      const pages: string[] = []
      if ((pdfData as any).numpages) {
        // naive split: split on form feed if present
        const splitted = text.split('\f')
        for (const p of splitted) pages.push(p.trim())
      } else {
        // fallback: split every 1500 chars
        for (let i = 0; i < text.length; i += 1500) pages.push(text.slice(i, i + 1500))
      }

      // save file to uploads
      const uploadsDir = path.join(process.cwd(), 'uploads')
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)
      const filename = `ref_upload_${Date.now()}.pdf`
      const filepath = path.join(uploadsDir, filename)
      fs.writeFileSync(filepath, data)

      const ref = await prisma.reference.create({ data: { deviceId, title: (fields.title as string) || filename, filePath: filepath, pageCount: pages.length, parsedText: text.substring(0, 2000) } })

      // generate embeddings per page (async, but await for now)
      let indexed = 0
      for (let i = 0; i < pages.length; i++) {
        const pageText = pages[i].trim()
        if (!pageText) continue
        const emb = await embedText(pageText)
        try {
          await saveReferenceEmbedding(ref.id, emb)
          indexed++
        } catch (e: any) {
          logger.error(e, 'Failed to update reference embedding')
        }
      }

      return res.status(201).json({ reference: ref, indexedPages: indexed })
    } catch (e) {
      logger.error(e)
      return res.status(500).json({ error: 'Parsing/indexing failed' })
    }
  })
}
