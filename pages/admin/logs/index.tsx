import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth/next'
import authOptions from '../../../lib/auth'
import { useEffect, useState } from 'react'

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  useEffect(() => {
    fetch('/api/admin/ingestion/logs')
      .then((r) => r.json())
      .then((d) => setLogs(d.logs || []))
      .catch(() => undefined)
  }, [])
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-4 text-3xl font-bold">Admin Logs</h1>
      <ul className="space-y-2">
        {logs.map((l) => (
          <li key={l.id} className="rounded border p-2 text-sm">
            <div>{l.message}</div>
            <div className="text-xs text-gray-500">{new Date(l.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = (await getServerSession(ctx.req as any, ctx.res as any, authOptions as any)) as any
  if (!session || session.user?.role !== 'admin') {
    return { redirect: { destination: '/api/auth/signin', permanent: false } }
  }
  return { props: {} }
}
