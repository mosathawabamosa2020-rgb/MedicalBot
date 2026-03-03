export type ReferenceStatus =
  | 'pending_ingestion'
  | 'processing'
  | 'processed'
  | 'pending_review'
  | 'verified'
  | 'rejected'
  | 'archived'

const allowedTransitions: Record<ReferenceStatus, ReferenceStatus[]> = {
  pending_ingestion: ['processing'],
  processing: ['pending_review'],
  processed: ['pending_review'],
  pending_review: ['verified', 'rejected', 'archived'],
  verified: ['archived'],
  rejected: ['archived'],
  archived: []
}

export function assertTransition(current: ReferenceStatus, next: ReferenceStatus) {
  if (!allowedTransitions[current].includes(next)) {
    throw new Error(`Invalid transition: ${current} -> ${next}`)
  }
}
