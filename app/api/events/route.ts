import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'events.json')
const ARCHIVE_FILE = path.join(DATA_DIR, 'archive.json')

async function ensureDataFile() {
  try {
    await fs.access(DATA_DIR)
  } catch (e) {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
  try {
    await fs.access(DATA_FILE)
  } catch (e) {
    await fs.writeFile(DATA_FILE, '[]', 'utf8')
  }
  try {
    await fs.access(ARCHIVE_FILE)
  } catch (e) {
    await fs.writeFile(ARCHIVE_FILE, '[]', 'utf8')
  }
}

async function readEvents() {
  await ensureDataFile()
  const raw = await fs.readFile(DATA_FILE, 'utf8')
  return JSON.parse(raw || '[]')
}

async function writeEvents(events: any[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2), 'utf8')
}


export async function GET() {
  try {
    const events = await readEvents()
    return NextResponse.json(events)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read events' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const events = await readEvents()
    const newEvent = {
      ...body,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    }
    events.unshift(newEvent)
    await writeEvents(events)
    return NextResponse.json(newEvent, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const events = await readEvents()
    const idx = events.findIndex((e: any) => e.id === body.id)
    if (idx === -1) return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    events[idx] = { ...events[idx], ...body }
    await writeEvents(events)
    return NextResponse.json(events[idx])
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    const events = await readEvents()
    const idx = events.findIndex((e: any) => e.id === id)
    if (idx === -1) return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    const [archivedEvent] = events.splice(idx, 1)
    await writeEvents(events)
    // Move to archive
    const archiveRaw = await fs.readFile(ARCHIVE_FILE, 'utf8')
    const archive = JSON.parse(archiveRaw || '[]')
    archive.unshift({ ...archivedEvent, archivedAt: new Date().toISOString() })
    await fs.writeFile(ARCHIVE_FILE, JSON.stringify(archive, null, 2), 'utf8')
    return NextResponse.json({ ok: true, archived: archivedEvent })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to archive event' }, { status: 500 })
  }
}
