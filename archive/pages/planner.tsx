import { useEffect, useState } from 'react'

type Device = { id: string; name: string; model: string }
type Suggestion = { score: number; page: number; text: string; reference: { id: string; title: string; filePath?: string; sourceUrl?: string } | null }

export default function Planner() {
  const [devices, setDevices] = useState<Device[]>([])
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const [topic, setTopic] = useState('common errors')
  const [results, setResults] = useState<Suggestion[]>([])
  const topics = ['common errors', 'calibration', 'maintenance', 'safety warnings']

  useEffect(() => {
    fetch('/api/devices').then((r) => r.json()).then(setDevices)
  }, [])

  const [autoLoading, setAutoLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function run() {
    if (!deviceId) return alert('Select a device')
    const res = await fetch('/api/references/query', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: topic, deviceId, topK: 5 }) })
    const data = await res.json()
    setResults(data.results || [])
  }

  async function autoGenerate() {
    if (!deviceId) return alert('Select a device')
    setAutoLoading(true)
    setMessage(null)
    const res = await fetch('/api/planner/run', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ deviceId }) })
    if (!res.ok) {
      const err = await res.json()
      setMessage('خطأ: فشل الإنشاء التلقائي')
      setAutoLoading(false)
      return
    }
    // fetch suggestions from planner API
    const r2 = await fetch(`/api/planner?deviceId=${deviceId}`)
    const d2 = await r2.json()
    setResults(d2.suggestions || [])
    setAutoLoading(false)
    setMessage('تم إنشاء الاقتراحات بنجاح!')
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Smart Content Planner</h1>

      <div className="mb-4">
        <label className="block">Select device</label>
        {devices.length === 0 ? (
          <div className="p-4 bg-yellow-50 border rounded">لا توجد أجهزة في النظام حتى الآن. يرجى تشغيل 'العنكبوت' من 'غرفة التحكم' لإضافة أجهزة ومراجع.</div>
        ) : (
          <select className="border p-2" value={deviceId || ''} onChange={(e) => setDeviceId(e.target.value)}>
            <option value="">-- choose --</option>
            {devices.map((d) => <option key={d.id} value={d.id}>{d.name} — {d.model}</option>)}
          </select>
        )}
      </div>

      <div className="mb-4">
        <label className="block">Topic</label>
        <select className="border p-2" value={topic} onChange={(e) => setTopic(e.target.value)}>
          {topics.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="flex gap-2">
        <button onClick={run} className="px-4 py-2 bg-blue-600 text-white rounded" disabled={!deviceId || devices.length === 0}>Get Suggestions</button>
        <button onClick={autoGenerate} className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={!deviceId || devices.length === 0 || autoLoading}>{autoLoading ? 'Running...' : 'Auto-generate'}</button>
        {message ? <div className="text-green-600 font-medium">{message}</div> : null}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Suggestions</h2>
        <ul className="space-y-3 mt-3">
          {results.map((r, idx) => (
            <li key={idx} className="p-3 border rounded">
              <div className="font-semibold">{r.reference?.title || 'Unknown Reference'} (p. {r.page})</div>
              <div className="text-sm text-gray-700 mt-1">{r.text.slice(0, 300)}...</div>
              <div className="text-sm text-gray-500 mt-2">score: {r.score.toFixed(3)}</div>
              <div className="mt-2">
                <button className="px-3 py-1 bg-green-600 text-white rounded">Create Draft from this</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
