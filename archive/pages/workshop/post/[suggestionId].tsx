import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

type Suggestion = {
  id: string
  topic: string
  snippet?: string
  page?: number
  score?: number
  deviceId: string
  device?: { id: string; name: string }
  reference?: { id: string; title?: string; filePath?: string; sourceUrl?: string }
}

export default function PostWorkshop() {
  const router = useRouter()
  const { suggestionId } = router.query
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null)
  const [contentType, setContentType] = useState('Common Mistake')
  const [generated, setGenerated] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!suggestionId) return
    fetch(`/api/planner?deviceId=${encodeURIComponent((suggestionId as string))}`) // temporary fetch; we'll use a dedicated endpoint
  }, [suggestionId])

  useEffect(() => {
    async function load() {
      if (!suggestionId) return
      const res = await fetch(`/api/planner?id=${suggestionId}`)
      const data = await res.json()
      // support two forms: if planner API returns suggestions or single suggestion endpoint
      if (data.suggestion) setSuggestion(data.suggestion)
      else if (data.suggestions && data.suggestions.length) setSuggestion(data.suggestions[0])
      else if (data.suggestions === undefined && data.id) setSuggestion(data as any)
    }
    load()
  }, [suggestionId])

  async function generate() {
    if (!suggestionId) return alert('No suggestion selected')
    setLoading(true)
    setGenerated('')
    try {
      const res = await fetch('/api/content/generate-post', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ suggestionId, contentType }) })
      const data = await res.json()
      if (res.ok) setGenerated(data.post)
      else alert('Generation failed: ' + (data.error || JSON.stringify(data)))
    } catch (e) { alert('Error: ' + e.message) }
    setLoading(false)
  }

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="border p-4 rounded">
        <h2 className="text-lg font-semibold">Source</h2>
        {suggestion ? (
          <div className="mt-3">
            <div className="font-medium">الجهاز: {suggestion.device?.name || suggestion.deviceId}</div>
            <div className="text-sm text-gray-600">الموضوع: {suggestion.topic}</div>
            <div className="mt-3 bg-gray-50 p-3 rounded">{suggestion.snippet}</div>
            {suggestion.reference ? (
              <div className="text-sm text-gray-500 mt-2">
                مرجع: {suggestion.reference.title} {suggestion.page ? `(صفحة ${suggestion.page})` : ''}
              </div>
            ) : (
              <div className="text-sm text-gray-500 mt-2">مرجع: صفحة {suggestion.page}</div>
            )}
          </div>
        ) : (<div>Loading...</div>)}
      </div>

      <div className="border p-4 rounded">
        <h2 className="text-lg font-semibold">Workshop</h2>
        <div className="mt-3">
          <label className="block mb-2">Content Type</label>
          <select value={contentType} onChange={(e) => setContentType(e.target.value)} className="border p-2 w-full">
            <option>Technical Post</option>
            <option>Common Mistake</option>
            <option>Educational Tip</option>
          </select>
        </div>

        <div className="mt-4">
          <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading? 'Generating...' : 'Generate Facebook Post Draft'}</button>
        </div>

        <div className="mt-4">
          <label className="block mb-2">Generated Post</label>
          <textarea value={generated} onChange={(e) => setGenerated(e.target.value)} className="w-full h-64 border p-2" />
        </div>
      </div>
    </div>
  )
}
