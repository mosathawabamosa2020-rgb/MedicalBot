import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth/next'
import authOptions from '../../../../lib/auth'

export default function ReferenceVerificationDetail() {
  const router = useRouter()
  const { id } = router.query
  const [ref, setRef] = useState<any>(null)
  const [decision, setDecision] = useState<'approved'|'rejected'|''>('')
  const [comment, setComment] = useState('')
  const [error, setError] = useState<string|null>(null)

  useEffect(() => {
    if (id) {
      fetch(`/api/admin/references/${id}`)
        .then(r => r.ok ? r.json() : Promise.reject('not found'))
        .then(setRef)
        .catch(() => setError('Failed to load reference'))
    }
  }, [id])

  const submit = async () => {
    if (!decision) return
    const res = await fetch(`/api/admin/verification/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, comment })
    })
    if (res.ok) {
      router.push('/admin/verification/references')
    } else {
      const data = await res.json()
      setError(data.error || 'submission failed')
    }
  }

  if (error) return <div className="p-6"><p>{error}</p></div>
  if (!ref) return <div className="p-6"><p>Loading...</p></div>

  return (
    <div className="p-6">
      <h1>Verify Reference</h1>
      <div className="mb-4">
        <strong>Title:</strong> {ref.title}<br />
        <strong>Authors:</strong> {ref.authors}<br />
        <strong>Journal:</strong> {ref.journal}<br />
        <strong>PMID:</strong> {ref.pmid}
      </div>
      <div className="mb-4">
        <label className="block"><input type="radio" name="decision" value="approved" onChange={() => setDecision('approved')} checked={decision==='approved'} /> Approve</label>
        <label className="block"><input type="radio" name="decision" value="rejected" onChange={() => setDecision('rejected')} checked={decision==='rejected'} /> Reject</label>
      </div>
      <div className="mb-4">
        <textarea className="w-full" placeholder="Optional comment" value={comment} onChange={e => setComment(e.target.value)} />
      </div>
      <button className="px-4 py-2 bg-blue-600 text-white" onClick={submit} disabled={!decision}>Submit</button>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req as any, ctx.res as any, authOptions as any)
  if (!session || (session as any).user?.role !== 'admin') {
    return { redirect: { destination: '/api/auth/signin', permanent: false } }
  }
  return { props: {} }
}
