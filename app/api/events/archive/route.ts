import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'

export async function GET() {
    try {
        const items = await prisma.archivedEvent.findMany({ orderBy: { archivedAt: 'desc' } })
        return NextResponse.json({ success: true, data: items, count: items.length })
    } catch (err) {
        console.error('GET /api/events/archive error', err)
        return NextResponse.json({ success: false, error: 'Failed to read archive' }, { status: 500 })
    }
}