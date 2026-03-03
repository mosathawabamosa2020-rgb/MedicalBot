require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const pdf = require('pdf-parse')
const { extractSections } = require('../dist/lib/sectionExtractor')

async function main() {
  const p = new PrismaClient()
  await p.$connect()
  try {
    const refs = await p.reference.findMany({})
    for (const r of refs) {
      if (!r.filePath || !fs.existsSync(r.filePath)) {
        console.warn('missing file for reference', r.id)
        continue
      }
      const buffer = fs.readFileSync(r.filePath)
      const data = await pdf(buffer)
      let pages = data.text ? data.text.split('\f').map(p=>p.trim()).filter(Boolean) : []
      // simple cleanup if no pages (ignore OCR here for now)
      if (!pages.length) continue
      const sections = extractSections(pages)
      // when reextracting we simply append; versioning on reference already tracked
      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i]
        await p.section.create({ data: { deviceId: r.deviceId, referenceId: r.id, title: sec.title, content: sec.content, order: i } })
      }
      // mark reference as reprocessed now
      await p.reference.update({ where: { id: r.id }, data: { processingDate: new Date() } })
      console.log(`ref ${r.id}: wrote ${sections.length} sections`)  
    }
  } catch (e) {
    console.error(e)
  } finally {
    await p.$disconnect()
  }
}

main()
