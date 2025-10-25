import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'admin.json')

async function ensureDataFile() {
    try {
        await fs.access(DATA_DIR)
    } catch (e) {
        await fs.mkdir(DATA_DIR, { recursive: true })
    }

    try {
        await fs.access(DATA_FILE)
    } catch (e) {
        const initial = { name: 'Admin User', email: 'admin@example.com', password: '', image: '' }
        await fs.writeFile(DATA_FILE, JSON.stringify(initial, null, 2), 'utf8')
    }
}

export async function GET() {
    try {
        await ensureDataFile()
        const raw = await fs.readFile(DATA_FILE, 'utf8')
        const json = JSON.parse(raw || '{}')
        return NextResponse.json(json)
    } catch (err) {
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, password, image } = body || {}

        if (typeof name !== 'string' || typeof email !== 'string') {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
        }

        await ensureDataFile()
        const payload = {
            name,
            email,
            password: typeof password === 'string' ? password : '',
            image: typeof image === 'string' ? image : ''
        }
        await fs.writeFile(DATA_FILE, JSON.stringify(payload, null, 2), 'utf8')

        return NextResponse.json({ ok: true, data: payload }, { status: 201 })
    } catch (err) {
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 })
    }
}
