import prisma from '../prisma'
import PubMedAdapter from '../sources/PubMedAdapter'
import { assertTransition } from '../referenceState'

async function parseTextIntoSections(text: string): Promise<{ title: string; content: string }[]> {
  if (!text) return []
  // naive split by double newlines; each paragraph becomes a section
  const paras = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
  return paras.map((p, i) => ({ title: `Section ${i + 1}`, content: p }))
}

async function logEvent(message: string, referenceId?: string) {
  try {
    await prisma.ingestionLog.create({ data: { message, referenceId } })
  } catch (e) {
    console.error('failed to write ingestion log', e)
  }
}

export async function runIngestionWorker() {
  await logEvent('Started worker run')
  // find references pending ingestion
  const refs = await prisma.reference.findMany({ where: { status: 'pending_ingestion' } })
  for (const r of refs) {
    await logEvent(`Processing reference ${r.id}`, r.id)
    // mark as processing to prevent double-work
    await prisma.reference.update({ where: { id: r.id }, data: { status: 'processing' } })
    try {
      let fullText: string | null = null
      if ((r as any).sourceName === 'PubMed') {
        const adapter = new PubMedAdapter()
        fullText = await adapter.fetchFullText((r as any).sourceId)
      }

      if (fullText) {
        const sections = await parseTextIntoSections(fullText)
        let order = 1
        for (const s of sections) {
          await prisma.section.create({ data: {
            deviceId: r.deviceId,
            referenceId: r.id,
            title: s.title,
            content: s.content,
            order: order++
          } })
        }
      }
      // regardless of fullText outcome, move to pending_review
      await prisma.reference.update({ where: { id: r.id }, data: { status: 'pending_review', processingDate: new Date() } })
      assertTransition('processing', 'pending_review')
      await logEvent(`Finished processing reference ${r.id}`, r.id)
    } catch (e: any) {
      console.error('worker error for reference', r.id, e?.message)
      // errors also send to pending_review so human can inspect
      await prisma.reference.update({ where: { id: r.id }, data: { status: 'pending_review', processingDate: new Date() } })
      assertTransition('processing', 'pending_review')
      await logEvent(`Error processing reference ${r.id}: ${e?.message}`, r.id)
    }
  }
}

export async function processIngestionQueue() {
  return runIngestionWorker()
}

export default { processIngestionQueue, runIngestionWorker }

export async function processReferenceById(referenceId: string) {
  const r = await prisma.reference.findUnique({ where: { id: referenceId } })
  if (!r) throw new Error('not found')
  // reuse logic for single reference
  try {
    await prisma.reference.update({ where: { id: r.id }, data: { status: 'processing' } })
    assertTransition(r.status as any, 'processing')
    let fullText: string | null = null
    if ((r as any).sourceName === 'PubMed') {
      const adapter = new PubMedAdapter()
      fullText = await adapter.fetchFullText((r as any).sourceId)
    }

    if (fullText) {
      const sections = await parseTextIntoSections(fullText)
      let order = 1
      for (const s of sections) {
        await prisma.section.create({ data: {
          deviceId: r.deviceId,
          referenceId: r.id,
          title: s.title,
          content: s.content,
          order: order++
        } })
      }
    }
    await prisma.reference.update({ where: { id: r.id }, data: { status: 'pending_review', processingDate: new Date() } })
    assertTransition('processing', 'pending_review')
    return { status: 'pending_review', sections: fullText ? fullText.split(/\n\s*\n/).length : 0 }
  } catch (e: any) {
    await prisma.reference.update({ where: { id: r.id }, data: { status: 'pending_review', processingDate: new Date() } })
    throw e
  }
}

