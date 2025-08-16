import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

type SharePayload = {
  invoice: any
  design: any
}

const getStoreDir = () => path.join(process.cwd(), 'data', 'shares')

async function ensureStoreDir() {
  const dir = getStoreDir()
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch {}
  return dir
}

async function purgeOldShares(maxAgeDays = 30) {
  const dir = await ensureStoreDir()
  try {
    const entries = await fs.readdir(dir)
    const now = Date.now()
    const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000
    await Promise.all(
      entries.map(async (name) => {
        if (!name.endsWith('.json')) return
        const full = path.join(dir, name)
        try {
          const content = await fs.readFile(full, 'utf8')
          const data = JSON.parse(content)
          const created = Date.parse(data.createdAt || '')
          if (!Number.isNaN(created) && now - created > maxAgeMs) {
            await fs.unlink(full)
          }
        } catch {}
      })
    )
  } catch {}
}

function generateId(length = 8) {
  return Math.random().toString(36).slice(2, 2 + length).toUpperCase()
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SharePayload
    if (!body || !body.invoice) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const dir = await ensureStoreDir()
    const id = generateId(8)
    const record = {
      id,
      createdAt: new Date().toISOString(),
      invoice: body.invoice,
      design: body.design ?? null,
    }
    const filePath = path.join(dir, `${id}.json`)
    await fs.writeFile(filePath, JSON.stringify(record, null, 2), 'utf8')

    // Best-effort purge of old shares on write
    purgeOldShares().catch(() => {})

    return NextResponse.json({ id }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save share' }, { status: 500 })
  }
}


