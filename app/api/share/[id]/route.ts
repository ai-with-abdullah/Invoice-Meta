import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const getStoreDir = () => path.join(process.cwd(), 'data', 'shares')

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const filePath = path.join(getStoreDir(), `${params.id}.json`)
    const json = await fs.readFile(filePath, 'utf8')
    const data = JSON.parse(json)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}


