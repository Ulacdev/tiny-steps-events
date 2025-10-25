import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const EVENTS_FILE = path.join(DATA_DIR, 'events.json')
const ARCHIVE_FILE = path.join(DATA_DIR, 'archive.json')

const ensureFiles = async () => {
    try { await fs.access(DATA_DIR) } catch { await fs.mkdir(DATA_DIR, { recursive: true }) }
    try { await fs.access(EVENTS_FILE) } catch { await fs.writeFile(EVENTS_FILE, '[]', 'utf8') }
    try { await fs.access(ARCHIVE_FILE) } catch { await fs.writeFile(ARCHIVE_FILE, '[]', 'utf8') }
}

export async function POST(request: Request) {
    try {
        await ensureFiles()
        let body
        try {
            body = await request.json()
        } catch (e) {
            console.error('[restore] Invalid JSON:', e)
            return NextResponse.json({ error: 'Invalid JSON body', detail: String(e) }, { status: 400 })
        }
        const id = body?.id
        if (!id || typeof id !== 'string') {
            console.error('[restore] Missing or invalid id:', id)
            return NextResponse.json({ error: 'Missing or invalid id', detail: id }, { status: 400 })
        }

        // Read archive
        let archive
        try {
            const archiveRaw = await fs.readFile(ARCHIVE_FILE, 'utf8')
            archive = JSON.parse(archiveRaw || '[]')
        } catch (e) {
            console.error('[restore] Failed to read archive.json:', e)
            return NextResponse.json({ error: 'Failed to read archive file', detail: String(e) }, { status: 500 })
        }
        const idx = archive.findIndex((e: any) => e.id === id)
        if (idx === -1) {
            console.warn('[restore] Event not found in archive:', id)
            return NextResponse.json({ error: 'Event not found in archive', detail: id }, { status: 404 })
        }

        const [restoredEvent] = archive.splice(idx, 1)
        if (!restoredEvent) {
            console.error('[restore] Could not remove event from archive:', id)
            return NextResponse.json({ error: 'Failed to remove event from archive', detail: id }, { status: 500 })
        }
        const { archivedAt, ...eventData } = restoredEvent

        // Read events
        let events
        try {
            const eventsRaw = await fs.readFile(EVENTS_FILE, 'utf8')
            events = JSON.parse(eventsRaw || '[]')
        } catch (e) {
            console.error('[restore] Failed to read events.json:', e)
            return NextResponse.json({ error: 'Failed to read events file', detail: String(e) }, { status: 500 })
        }
        events.unshift(eventData)

        // Write files atomically
        try {
            await Promise.all([
                fs.writeFile(EVENTS_FILE, JSON.stringify(events, null, 2), 'utf8'),
                fs.writeFile(ARCHIVE_FILE, JSON.stringify(archive, null, 2), 'utf8'),
            ])
        } catch (e) {
            console.error('[restore] Failed to write data files:', e)
            return NextResponse.json({ error: 'Failed to write data files', detail: String(e) }, { status: 500 })
        }

        console.log('[restore] Restored event id=', eventData.id)
        return NextResponse.json({ ok: true, restored: eventData })
    } catch (err: any) {
        console.error('[restore] Unexpected error:', err?.stack || err?.message || err)
        return NextResponse.json({ error: 'Failed to restore event', detail: err?.message || String(err) }, { status: 500 })
    }
}