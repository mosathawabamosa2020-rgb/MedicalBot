import { getServerSideProps } from '../pages/index'

jest.mock('next-auth/next', () => ({ getServerSession: jest.fn() }))

describe('root routing', () => {
  const { getServerSession } = require('next-auth/next') as any

  test('unauthenticated users go to signin', async () => {
    getServerSession.mockResolvedValue(null)
    const result = await getServerSideProps({ req: {}, res: {} } as any)
    expect(result).toEqual({ redirect: { destination: '/auth/signin', permanent: false } })
  })

  test('admin users go to dashboard', async () => {
    getServerSession.mockResolvedValue({ user: { role: 'admin' } })
    const result = await getServerSideProps({ req: {}, res: {} } as any)
    expect(result).toEqual({ redirect: { destination: '/admin/dashboard', permanent: false } })
  })

  test('reviewer users go to verification', async () => {
    getServerSession.mockResolvedValue({ user: { role: 'reviewer' } })
    const result = await getServerSideProps({ req: {}, res: {} } as any)
    expect(result).toEqual({ redirect: { destination: '/admin/verification', permanent: false } })
  })

  test('editor users go to content-studio', async () => {
    getServerSession.mockResolvedValue({ user: { role: 'editor' } })
    const result = await getServerSideProps({ req: {}, res: {} } as any)
    expect(result).toEqual({ redirect: { destination: '/admin/content-studio', permanent: false } })
  })
})
