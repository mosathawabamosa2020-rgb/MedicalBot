import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function ReferenceReview() {
  const router = useRouter()
  const { id } = router.query
  const [ref, setRef] = useState<any | null>(null)
  const [sections, setSections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const r = await fetch(`/api/admin/references/${id}`)
        if (!r.ok) throw new Error('failed to load reference')
        const data = await r.json()
        if (cancelled) return
        setRef(data)
        // load sections
        const s = await fetch(`/api/admin/sections/queue?referenceId=${id}`)
        if (s.ok) {
          const sd = await s.json()
          setSections(sd.sections || [])
        }
      } catch (e: any) {
        setMessage(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  async function action(decision: 'approved' | 'rejected') {
    if (!id) return
    try {
      setMessage(null)
      const res = await fetch(`/api/admin/verification/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ decision: decision === 'approved' ? 'approved' : 'rejected' }) })
      if (res.status === 409) {
        setMessage('This item has already been actioned by another user. Refreshing...')
        setTimeout(() => router.replace(router.asPath), 2000)
        return
      }
      if (!res.ok) throw new Error('action failed')
      // success — refresh
      router.replace(router.asPath)
    } catch (e: any) {
      setMessage(e.message)
    }
  }

  if (loading) return <div style={{ padding: 20 }}>Loading…</div>
  if (!ref) return <div style={{ padding: 20 }}>Not found</div>

  return (
    <div style={{ padding: 20 }}>
      <h1>Reference Review</h1>
      {message && <div style={{ background: '#fee', padding: 8, marginBottom: 12 }}>{message}</div>}
      <div style={{ marginBottom: 12 }}>
        <strong>{ref.title}</strong>
        <div>ID: {ref.id}</div>
        <div>Source: {ref.sourceName} {ref.sourceId}</div>
        <div>Status: <span style={{ padding: '4px 8px', background: '#ffd', borderRadius: 4 }}>{ref.status}</span></div>
      </div>

      <h2>Sections</h2>
      <ol>
        {sections.map(s => (
          <li key={s.id} style={{ marginBottom: 8 }}>
            <strong>{s.title}</strong>
            <div style={{ whiteSpace: 'pre-wrap' }}>{s.content}</div>
          </li>
        ))}
      </ol>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => action('approved')} style={{ marginRight: 8 }}>Verify</button>
        <button onClick={() => action('rejected')}>Reject</button>
      </div>
    </div>
  )
}
