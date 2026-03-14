import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import pdf from 'pdf-parse'
import prisma from '../../../lib/prisma'
import logger from '../../../lib/logger'
import { enforceCsrfForMutation, enforceRateLimit, setSecurityHeaders } from '../../../lib/apiSecurity'
import { computeContentHash } from '../../../lib/hash'
import { deriveSourceIdentifiers } from '../../../lib/sourceIdentifiers'
import { z } from 'zod'

export const config = {
  api: {
    bodyParser: false,
  },
}

// Schema for validating form fields
const UploadFieldsSchema = z.object({
  deviceId: z.string().min(1, 'Device ID is required'),
  sourceUrl: z.string().url().optional().or(z.literal('')),
  sourceName: z.string().optional(),
  sourceId: z.string().optional(),
  title: z.string().optional(),
})

// Schema for validating uploaded file properties
const UploadedFileSchema = z.object({
  mimetype: z.literal('application/pdf', { errorMap: () => ({ message: 'Only application/pdf is accepted' }) }),
  size: z.number().min(1, 'File size must be greater than 0').max(25 * 1024 * 1024, 'File size must be less than 25MB'),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  setSecurityHeaders(res)
  // Note: enforceRateLimit and enforceCsrfForMutation are now async
  if (!(await enforceRateLimit(req, res, 'references-upload', 60_000, 45))) return
  if (!(await enforceCsrfForMutation(req, res))) return
  if (req.method !== 'POST') return res.status(405).end()

  const form = formidable({ multiples: false })
  return await new Promise<void>((resolve) => {
    form.parse(req as any, async (err: unknown, fields: any, files: any) => {
      try {
        if (err) {
          res.status(500).json({ error: 'Upload error' })
          return resolve()
        }

        // 1. Validate Fields
        const fieldsValidation = UploadFieldsSchema.safeParse(fields)
        if (!fieldsValidation.success) {
          res.status(400).json({ 
            error: 'Invalid form fields', 
            details: fieldsValidation.error.errors 
          })
          return resolve()
        }
        const { deviceId, sourceUrl, sourceName, sourceId, title } = fieldsValidation.data

        // 2. Validate File
        const file = files.file as any
        if (!file) {
          res.status(400).json({ error: 'file required' })
          return resolve()
        }
        
        const fileValidation = UploadedFileSchema.safeParse({
          mimetype: file.mimetype,
          size: file.size,
        })

        if (!fileValidation.success) {
          res.status(400).json({ 
            error: 'Invalid file', 
            details: fileValidation.error.errors 
          })
          return resolve()
        }

        const data = fs.readFileSync(file.filepath)
        const pdfData = await pdf(data)
        const text = pdfData.text || ''
        const binaryContentHash = computeContentHash(data.toString('base64'))
        const extractedTextHash = computeContentHash(text)

        const pages: string[] = []
        if ((pdfData as any).numpages) {
          const splitted = text.split('\f')
          for (const p of splitted) pages.push(p.trim())
        } else {
          for (let i = 0; i < text.length; i += 1500) pages.push(text.slice(i, i + 1500))
        }

        const uploadsDir = path.join(process.cwd(), 'uploads')
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)
        const filename = `ref_upload_${Date.now()}.pdf`

        const identifiers = deriveSourceIdentifiers({
          sourceUrl: sourceUrl || null,
          sourceName: sourceName || null,
          sourceId: sourceId || null,
          title: title || filename,
        })

        const identifierOr = [
          ...(identifiers.pmid ? [{ pmid: identifiers.pmid }] : []),
          ...(identifiers.doi ? [{ doi: identifiers.doi }] : []),
          ...(identifiers.arxivId ? [{ arxivId: identifiers.arxivId }] : []),
          ...(identifiers.sourceFingerprint ? [{ sourceFingerprint: identifiers.sourceFingerprint }] : []),
        ]
        if (identifierOr.length > 0) {
          const duplicateByIdentifiers = await prisma.reference.findFirst({
            where: { deviceId, OR: identifierOr },
            select: { id: true },
          })
          if (duplicateByIdentifiers) {
            await prisma.ingestionLog.create({ data: { message: 'upload duplicate by identifiers', referenceId: duplicateByIdentifiers.id } })
            res.status(409).json({ error: 'duplicate source identifiers', referenceId: duplicateByIdentifiers.id })
            return resolve()
          }
        }

        const existing = await prisma.reference.findFirst({
          where: {
            deviceId,
            OR: [{ contentHash: binaryContentHash }, { contentHash: extractedTextHash }],
          },
          select: { id: true },
        })
        if (existing) {
          await prisma.ingestionLog.create({ data: { message: 'upload duplicate by content', referenceId: existing.id } })
          res.status(409).json({ error: 'duplicate reference content', referenceId: existing.id })
          return resolve()
        }

        const ref = await prisma.reference.create({
          data: {
            deviceId,
            title: title || filename,
            filePath: null,
            pageCount: pages.length,
            parsedText: text.substring(0, 2000),
            contentHash: binaryContentHash,
            sourceUrl: sourceUrl || undefined,
            sourceName: sourceName || undefined,
            sourceId: sourceId || undefined,
            doi: identifiers.doi || undefined,
            pmid: identifiers.pmid || undefined,
            arxivId: identifiers.arxivId || undefined,
            sourceFingerprint: identifiers.sourceFingerprint || undefined,
          },
        })

        // Durable write happens after dedup and DB create to avoid orphaned-file drift.
        const filepath = path.join(uploadsDir, `${ref.id}.pdf`)
        try {
          fs.writeFileSync(filepath, data)
          await prisma.reference.update({
            where: { id: ref.id },
            data: { filePath: filepath },
          })
        } catch (e: unknown) {
          await prisma.reference.delete({ where: { id: ref.id } }).catch(() => null)
          throw e
        }

        await prisma.ingestionLog.create({
          data: {
            referenceId: ref.id,
            message: `upload accepted; textHash=${extractedTextHash}; embedding deferred to worker`,
          },
        })

        res.status(201).json({ reference: { ...ref, filePath: filepath }, indexedPages: 0, embeddingMode: 'chunk-first-deferred' })
        return resolve()
      } catch (e: unknown) {
        const code = String((e as any)?.code || '')
        if (code === 'P2002') {
          res.status(409).json({ error: 'duplicate reference' })
          return resolve()
        }
        logger.error(e)
        res.status(500).json({ error: 'Parsing/indexing failed' })
        return resolve()
      }
    })
  })
}
