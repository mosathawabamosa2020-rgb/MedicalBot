import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs'
import { withAdminAuth } from '../../../../lib/adminAuth'
import logger from '../../../../lib/logger'
import { runScraper } from '../../../../scripts/master_scraper'
import { z } from 'zod'
// import { getQueue } from '../../../../lib/queue'

const PID_PATH = path.join(process.cwd(), 'data', 'scraper_pid.json')
const LOG_PATH = path.join(process.cwd(), 'data', 'scraper.log')
const STOP_FLAG = path.join(process.cwd(), 'data', 'scraper_stop.flag')

let controllerRunning = false

// Schema for validating the request body
const StartScraperBodySchema = z.object({
  terms: z.union([
    z.string().min(1, 'Terms string cannot be empty'),
    z.array(z.string().min(1, 'Term cannot be empty')).min(1, 'Terms array cannot be empty')
  ]).transform((val) => {
    // Normalize to array of trimmed strings
    if (typeof val === 'string') {
      return val.split(/\r?\n/).map(t => t.trim()).filter(Boolean)
    }
    return val.map(t => t.trim()).filter(Boolean)
  })
})

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  // Validate request body
  const validationResult = StartScraperBodySchema.safeParse(req.body)

  if (!validationResult.success) {
    return res.status(400).json({ 
      error: 'Invalid request body', 
      details: validationResult.error.errors 
    })
  }

  const termsArr = validationResult.data

  if (fs.existsSync(PID_PATH) || controllerRunning) return res.status(400).json({ error: 'Scraper already running' })

  // Single-process direct execution model: call the shared scraper entrypoint sequentially
  controllerRunning = true
  try {
    for (const term of termsArr) {
      if (fs.existsSync(STOP_FLAG)) break
      await runScraper(term)
    }

    return res.json({ ok: true, completedAt: new Date().toISOString(), termsCount: termsArr.length })
  } catch (e) {
    try {
      fs.appendFileSync(LOG_PATH, `\nStart error: ${String(e)}\n`)
    } catch (writeErr: unknown) {
      logger.error({ err: writeErr }, 'failed to append scraper start error')
    }
    return res.status(500).json({ error: String(e) })
  } finally {
    controllerRunning = false
  }
}

export default withAdminAuth(handler)
