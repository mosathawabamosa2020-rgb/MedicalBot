import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import authOptions from '../../lib/auth'
import { GetServerSideProps } from 'next'

interface SectionItem {
  id: string
  title: string
  content: string
  reference: { id: string; filePath?: string; sourceUrl?: string; title?: string; version?: number }
}

export default function Verification() {
  const [sections, setSections] = useState<SectionItem[]>([])
  const [metrics, setMetrics] = useState<any>(null)

  async function loadData() {
    try {
      const [secRes, metRes] = await Promise.all([
        fetch('/api/admin/sections/queue'),
        fetch('/api/admin/metrics')
      ])
      if (secRes.ok) setSections(await secRes.json())
      if (metRes.ok) setMetrics(await metRes.json())
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { loadData() }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Verification Queue</h1>

      {metrics && <MetricsDisplay data={metrics} />}

      <div className="mt-4">
        {sections.length === 0 ? (
          <p>No sections awaiting review.</p>
        ) : (
          <ul className="space-y-2">
            {sections.map(s => (
              <li key={s.id} className="border p-3 rounded hover:bg-gray-50">
                <Link href={`/admin/sections/${s.id}`} className="block">
                  <div className="font-semibold">{s.title || '(no title)'}</div>
                  <div className="text-sm text-gray-600">
                    {s.content.slice(0, 200).replace(/\n/g, ' ')}{s.content.length > 200 ? '…' : ''}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Source: {s.reference?.title || s.reference?.filePath || 'unknown'}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
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

function MetricsDisplay({ data }: { data: any }) {
  return (
    <div className="mt-6 p-4 bg-blue-50 rounded">
      <h2 className="font-semibold">Project Metrics</h2>
      <div>Total Devices: {data.deviceCount}</div>
      <div>Total Articles: {data.articleCount}</div>
      <div>Total Sections: {data.sectionCount}</div>
      <div className="mt-2">
        <span className="font-medium">Status Breakdown:</span>
        <ul className="ml-4 list-disc">
          {data.statusBreakdown.map((s:any) => (
            <li key={s.status}>{s.status}: {s._count.status}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
