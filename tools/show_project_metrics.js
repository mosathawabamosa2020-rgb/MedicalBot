require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
  await p.$connect()
  try {
    const deviceCount = await p.device.count()
    const articleCount = await p.reference.count()
    const sectionCount = await p.section.count()
    const statusBreakdown = await p.section.groupBy({ by: ['status'], _count: { status: true } })

    console.log('=== Project Metrics ===')
    console.log('Total Devices Processed:', deviceCount)
    console.log('Total Articles Aggregated:', articleCount)
    console.log('Total Sections Extracted:', sectionCount)
    console.log('Section Status Breakdown:')
    statusBreakdown.forEach(s => {
      console.log(`  ${s.status}: ${s._count.status}`)
    })
    console.log('=======================')
  } finally {
    await p.$disconnect()
  }
}
// utility that returns metrics object for programmatic use
async function computeMetrics() {
  await p.$connect()
  try {
    const deviceCount = await p.device.count()
    const articleCount = await p.reference.count()
    const sectionCount = await p.section.count()
    const statusBreakdown = await p.section.groupBy({ by: ['status'], _count: { status: true } })
    return { deviceCount, articleCount, sectionCount, statusBreakdown }
  } finally {
    await p.$disconnect()
  }
}

async function mainCli() {
  try {
    const m = await computeMetrics()
    console.log('=== Project Metrics ===')
    console.log('Total Devices Processed:', m.deviceCount)
    console.log('Total Articles Aggregated:', m.articleCount)
    console.log('Total Sections Extracted:', m.sectionCount)
    console.log('Section Status Breakdown:')
    m.statusBreakdown.forEach(s => {
      console.log(`  ${s.status}: ${s._count.status}`)
    })
    console.log('=======================')
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

module.exports = { computeMetrics }

if (require.main === module) {
  mainCli()
}
