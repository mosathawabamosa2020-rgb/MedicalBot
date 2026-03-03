import useSWR from 'swr'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth/next'
import authOptions from '../../../../lib/auth'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function ReferenceVerificationList() {
  const { data, error } = useSWR('/api/admin/references/pending_review', fetcher)

  if (error) return <div className="p-6"><p>Error loading references</p></div>
  if (!data) return <div className="p-6"><p>Loading...</p></div>

  return (
    <div className="p-6">
      <h1>Reference Verification</h1>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2">Title</th>
            <th className="border px-2">Authors</th>
            <th className="border px-2">Journal</th>
            <th className="border px-2"></th>
          </tr>
        </thead>
        <tbody>
          {data.map((ref: any) => (
            <tr key={ref.id} className="hover:bg-gray-100">
              <td className="border px-2">{ref.title}</td>
              <td className="border px-2">{ref.authors}</td>
              <td className="border px-2">{ref.journal}</td>
              <td className="border px-2">
                <Link href={`/admin/verification/references/${ref.id}`} className="text-blue-600 underline">Review</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
