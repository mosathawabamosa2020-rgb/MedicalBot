import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'

// This endpoint will use SerpAPI if SERPAPI_KEY is provided in env.
// It accepts POST { queries: string[] } and returns aggregated results.

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { queries } = req.body as { queries?: string[] }
  if (!queries || !Array.isArray(queries) || queries.length === 0) {
    return res.status(400).json({ error: 'queries required' })
  }

  const serpKey = process.env.SERPAPI_KEY
  if (!serpKey) return res.status(501).json({ error: 'Search API not configured (SERPAPI_KEY missing)' })

  try {
    const allResults: Record<string, any>[] = []
    for (const q of queries.slice(0, 8)) {
      const params = new URLSearchParams({ q, api_key: serpKey })
      const url = `https://serpapi.com/search.json?${params.toString()}`
      const r = await fetch(url)
      if (!r.ok) continue
      const json = await r.json()
      const items = json.organic_results || json.organic || json.results || []
      const mapped = (items as any[]).slice(0, 5).map((it) => ({ query: q, title: it.title || it.title, link: it.link || it.url || it.positioned_link || null, snippet: it.snippet || it.snippet || it.description || null }))
      allResults.push(...mapped)
    }

    // rudimentary dedupe by link
    const seen = new Set()
    const deduped = allResults.filter((r) => {
      if (!r.link) return false
      if (seen.has(r.link)) return false
      seen.add(r.link)
      return true
    })

    return res.json({ results: deduped })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Search failed' })
  }
}
