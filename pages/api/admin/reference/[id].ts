import type { NextApiRequest, NextApiResponse } from 'next'
import { withAdminAuth } from '../../../../lib/adminAuth'
import prisma from '../../../../lib/prisma'
import type { ReferenceDetailResponse, VerificationDecisionPayload } from '../../../../lib/contracts/api'
import { applyReferenceVerificationDecision } from '../../../../lib/services/verificationService'
import logger from '../../../../lib/logger'
import { z } from 'zod'

// Schema for route parameters (e.g., /api/admin/reference/123)
const ParamsSchema = z.object({
  id: z.string().min(1, 'ID is required'),
})

// Schema for PATCH request body
const PatchBodySchema = z.object({
  decision: z.enum(['approved', 'rejected'], { 
    errorMap: () => ({ message: 'Decision must be either "approved" or "rejected"' }) 
  }),
  reason: z.string().optional(),
})

async function handler(req: NextApiRequest, res: NextApiResponse, session?: any) {
  // 1. Validate Route Parameters
  const paramsValidation = ParamsSchema.safeParse(req.query)
  if (!paramsValidation.success) {
    return res.status(400).json({ 
      error: 'Invalid request parameters', 
      details: paramsValidation.error.errors 
    })
  }
  const { id } = paramsValidation.data

  if (req.method === 'GET') {
    const ref = await prisma.reference.findUnique({ where: { id } })
    if (!ref) return res.status(404).json({ error: 'not found' })
    const payload: ReferenceDetailResponse = {
      ...ref,
      uploadedAt: ref.uploadedAt.toISOString(),
      processingDate: ref.processingDate ? ref.processingDate.toISOString() : null,
    }
    return res.status(200).json(payload)
  }

  if (req.method === 'PATCH') {
    // 2. Validate Request Body for PATCH
    const bodyValidation = PatchBodySchema.safeParse(req.body)
    if (!bodyValidation.success) {
      return res.status(400).json({ 
        error: 'Invalid request body', 
        details: bodyValidation.error.errors 
      })
    }
    const body = bodyValidation.data

    try {
      const status = await applyReferenceVerificationDecision(
        prisma as any,
        id,
        String(session?.user?.id),
        body as VerificationDecisionPayload
      )
      if (status === 'conflict') return res.status(409).json({ error: 'state conflict' })
      const ref = await prisma.reference.findUnique({ where: { id } })
      if (!ref) return res.status(404).json({ error: 'not found' })
      const payload: ReferenceDetailResponse = {
        ...ref,
        uploadedAt: ref.uploadedAt.toISOString(),
        processingDate: ref.processingDate ? ref.processingDate.toISOString() : null,
      }
      return res.status(200).json(payload)
    } catch (err: unknown) {
      logger.error({ err, referenceId: id }, 'reference patch failed')
      return res.status(500).json({ error: 'server error' })
    }
  }

  return res.status(405).end()
}

export default withAdminAuth(handler)
