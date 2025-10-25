import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const ARCHIVE_FILE = path.join(DATA_DIR, 'archive.json')

async function ensureArchiveFile() {
    try {
        await fs.access(DATA_DIR)
    } catch (e) {
        await fs.mkdir(DATA_DIR, { recursive: true })
    }
    try {
        await fs.access(ARCHIVE_FILE)
    } catch (e) {
        await fs.writeFile(ARCHIVE_FILE, '[]', 'utf8')
    }
}

export async function GET() {
    try {
        await ensureArchiveFile()
        const raw = await fs.readFile(ARCHIVE_FILE, 'utf8')
        const events = JSON.parse(raw || '[]')
        return NextResponse.json(events)
    } catch (err) {
        return NextResponse.json({ error: 'Failed to read archive' }, { status: 500 })
    }
}