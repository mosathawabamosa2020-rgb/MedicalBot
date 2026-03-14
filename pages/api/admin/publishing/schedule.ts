import type { NextApiRequest, NextApiResponse } from 'next'
import { withAdminAuth } from '../../../../lib/adminAuth'
import { scheduleDailyPublishingTasks } from '../../../../lib/services/publishingScheduler'
import { writeAuditEvent } from '../../../../lib/auditTrail'
import { z } from 'zod'

// Schema for validating request body
const ScheduleBodySchema = z.object({
  limit: z.number({
    required_error: 'Limit is required',
    invalid_type_error: 'Limit must be a number',
  }).int('Limit must be an integer')
   .positive('Limit must be positive')
   .max(1000, 'Limit cannot exceed 1000')
   .default(10)
})

async function handler(req: NextApiRequest, res: NextApiResponse, session?: any) {
  if (req.method !== 'POST') return res.status(405).end()

  // Validate request body
  const validationResult = ScheduleBodySchema.safeParse(req.body)

  if (!validationResult.success) {
    return res.status(400).json({ 
      error: 'Invalid request body', 
      details: validationResult.error.errors 
    })
  }

  const { limit } = validationResult.data

  const result = await scheduleDailyPublishingTasks(limit)
  
  writeAuditEvent({
    event: 'publishing.schedule.executed',
    actorId: String(session?.user?.id || ''),
    entityType: 'publishingTask',
    entityId: 'bulk',
    payload: { limit, createdCount: result.createdCount },
  })
  
  return res.status(200).json(result)
}

export default withAdminAuth(handler)
