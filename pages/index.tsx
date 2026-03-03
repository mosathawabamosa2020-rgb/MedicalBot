import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth/next'
import authOptions from '../lib/auth'

export default function Home() {
  // page will never render because we always redirect in getServerSideProps
  return null
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions as any)
  if (!session) {
    return {
      redirect: { destination: '/auth/signin', permanent: false }
    }
  }

  const role = ((session as any).user?.role || '').toString().toLowerCase()
  let destination = '/auth/signin'
  if (role === 'admin') destination = '/admin/dashboard'
  else if (role === 'reviewer') destination = '/admin/verification'
  else if (role === 'editor') destination = '/admin/content-studio'

  return {
    redirect: { destination, permanent: false }
  }
}
