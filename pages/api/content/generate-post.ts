import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import logger from '../../../lib/logger'

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { suggestionId, contentType } = req.body as { suggestionId?: string; contentType?: string }
  if (!suggestionId) return res.status(400).json({ error: 'suggestionId required' })

  try {
    const sug = await prisma.plannerSuggestion.findUnique({ where: { id: suggestionId }, include: { device: true } })
    if (!sug) return res.status(404).json({ error: 'Suggestion not found' })

    const title = sug.referenceId ? (await prisma.reference.findUnique({ where: { id: sug.referenceId } }))?.title : 'Source Document'

    const prompt = `You are an expert medical content creator. Based on the following trusted source: '${title}' (page ${sug.page || 'N/A'}) which says: "${(sug.snippet || '').replace(/\n/g,' ')}", write a complete, engaging, and technically accurate Facebook post for an audience of lab technicians. The post should be of type: ${contentType || 'General'}. Include relevant emojis and hashtags. Keep it professional and actionable.`

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) return res.status(500).json({ error: 'OPENAI_API_KEY not configured' })

    const body = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that writes social media posts for technical audiences.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7
    }

    const r = await fetch(OPENAI_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` }, body: JSON.stringify(body) })
    if (!r.ok) {
      const txt = await r.text()
      return res.status(500).json({ error: 'OpenAI error', details: txt })
    }
    const j = await r.json()
    const post = j.choices && j.choices[0] && j.choices[0].message ? j.choices[0].message.content : (j.choices && j.choices[0] && j.choices[0].text ? j.choices[0].text : '')

    return res.json({ post })
  } catch (e: any) {
    logger.error(e)
    return res.status(500).json({ error: e.message })
  }
}
