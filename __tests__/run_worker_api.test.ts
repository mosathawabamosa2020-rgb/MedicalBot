import { createMocks } from 'node-mocks-http'

jest.mock('../lib/workers/ingestionWorker', () => ({
  runIngestionWorker: jest.fn().mockResolvedValue(undefined)
}))

jest.mock('next-auth/next', () => ({ getServerSession: jest.fn() }))

const { runIngestionWorker } = require('../lib/workers/ingestionWorker')

describe('run-worker endpoint', () => {
  beforeEach(() => jest.clearAllMocks())

  test('rejects non-post methods', async () => {
    const { getServerSession } = require('next-auth/next') as any
    getServerSession.mockResolvedValue({ user: { role: 'admin' } })
    const { req, res } = createMocks({ method: 'GET' })
    const handler = require('../pages/api/admin/ingestion/run-worker').default
    await handler(req as any, res as any)
    expect(res._getStatusCode()).toBe(405)
  })

  test('forbids non-admin', async () => {
    const { getServerSession } = require('next-auth/next') as any
    getServerSession.mockResolvedValue({ user: { role: 'editor' } })
    const { req, res } = createMocks({ method: 'POST' })
    const handler = require('../pages/api/admin/ingestion/run-worker').default
    await handler(req as any, res as any)
    expect(res._getStatusCode()).toBe(403)
    expect(runIngestionWorker).not.toHaveBeenCalled()
  })

  test('accepts admin and triggers worker', async () => {
    const { getServerSession } = require('next-auth/next') as any
    getServerSession.mockResolvedValue({ user: { role: 'admin' } })
    const { req, res } = createMocks({ method: 'POST' })
    const handler = require('../pages/api/admin/ingestion/run-worker').default
    await handler(req as any, res as any)
    expect(res._getStatusCode()).toBe(202)
    expect(runIngestionWorker).toHaveBeenCalled()
  })
})
