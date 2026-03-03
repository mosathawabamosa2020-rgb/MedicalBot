import { assertTransition } from '../lib/referenceState'

describe('reference state machine', () => {
  const validPairs: Array<[string,string]> = [
    ['pending_ingestion','processing'],
    ['processing','pending_review'],
    ['pending_review','verified'],
    ['pending_review','rejected'],
    ['pending_review','archived'],
    ['verified','archived'],
    ['rejected','archived'],
    ['processing','pending_review']
  ]

  for (const [cur,next] of validPairs) {
    test(`allows ${cur} -> ${next}`, () => {
      expect(() => assertTransition(cur as any, next as any)).not.toThrow()
    })
  }

  const invalidPairs: Array<[string,string]> = [
    ['pending_ingestion','verified'],
    ['processing','verified'],
    ['pending_review','processing'],
    ['verified','pending_review'],
    ['archived','pending_ingestion']
  ]

  for (const [cur,next] of invalidPairs) {
    test(`rejects ${cur} -> ${next}`, () => {
      expect(() => assertTransition(cur as any, next as any)).toThrow(/Invalid transition/)
    })
  }
})