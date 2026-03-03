import { useState, useEffect } from 'react'

interface Reference {
  id: string;
  title: string;
  authors: string;
  journal: string;
  pmid: string | null;
}

export default function Library() {
  const [refs, setRefs] = useState<Reference[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(20)

  useEffect(() => {
    fetch(`/api/references/library?page=${page}&limit=${limit}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        setRefs(data.items)
        setTotal(data.total)
      })
      .catch(console.error)
  }, [page, limit])

  const maxPage = Math.ceil(total / limit)

  return (
    <div className="p-6">
      <h1>Knowledge Library</h1>
      {refs.length === 0 ? (
        <p>No articles yet.</p>
      ) : (
        <ul className="space-y-2">
          {refs.map(ref => (
            <li key={ref.id} className="border p-2 rounded">
              <div className="font-semibold">{ref.title}</div>
              <div className="text-sm">{ref.authors}</div>
              <div className="text-xs text-gray-600">{ref.journal}</div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex space-x-2">
        <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p-1))}>Prev</button>
        <span>Page {page} / {maxPage || 1}</span>
        <button disabled={page >= maxPage} onClick={() => setPage(p => Math.min(maxPage, p+1))}>Next</button>
      </div>
    </div>
  )
}
