/**
 * One-time migration script to move vectors from data/vectors.json into
 * the Reference.embedding column (pgvector).
 *
 * Usage: node scripts/migrate_vectors.js
 */
const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')

async function main() {
  const prisma = new PrismaClient()
  const p = path.join(process.cwd(), 'data', 'vectors.json')
  if (!fs.existsSync(p)) {
    console.error('No data/vectors.json found, aborting')
    process.exit(1)
  }
  const data = JSON.parse(fs.readFileSync(p, 'utf8'))
  let migrated = 0
  for (const v of data) {
    if (!v.referenceId || !v.embedding) continue
    const vec = '[' + v.embedding.join(',') + ']'
    try {
      await prisma.$executeRaw`UPDATE "Reference" SET embedding = ${vec}::vector WHERE id = ${v.referenceId}`
      migrated++
      if (migrated % 100 === 0) console.log('Migrated', migrated)
    } catch (e) {
      console.error('Failed to migrate vector for', v.referenceId, e.message)
    }
  }
  console.log('Done. Migrated vectors:', migrated)
  await prisma.$disconnect()
}

main().catch((e) => { console.error(e); process.exit(1) })
