// Load environment variables from .env.local so DATABASE_URL is available
require('dotenv').config({ path: '.env.local' })
const fs = require('fs')
const path = require('path')
const { Client } = require('pg')

async function run() {
  const dir = path.join(process.cwd(), 'prisma', 'manual_migrations')
  if (!fs.existsSync(dir)) {
    console.log('No manual migrations directory found at', dir)
    process.exit(0)
  }
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort()
  if (!files.length) {
    console.log('No SQL files to run')
    process.exit(0)
  }

  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.error('DATABASE_URL not set')
    process.exit(1)
  }

  const client = new Client({ connectionString: dbUrl })
  await client.connect()
  try {
    for (const f of files) {
      const p = path.join(dir, f)
      const sql = fs.readFileSync(p, 'utf8')
      console.log('Running', f)
      await client.query(sql)
      console.log('Applied', f)
    }
    console.log('All manual migrations applied')
  } finally {
    await client.end()
  }
}

run().catch(e => { console.error(e); process.exit(1) })
