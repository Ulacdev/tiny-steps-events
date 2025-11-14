import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'

export async function POST(request: Request) {
    try {
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

        const archived = await prisma.archivedEvent.findUnique({ where: { id: String(id) } })
        if (!archived) {
            console.warn('[restore] Event not found in archive:', id)
            return NextResponse.json({ error: 'Event not found in archive', detail: id }, { status: 404 })
        }

        // Create event from archived record
        const restored = await prisma.event.create({
            data: {
                name: archived.name,
                date: archived.date ?? null,
                time: archived.time ?? null,
                location: archived.location ?? null,
                attendees: archived.attendees ?? 0,
                status: archived.status ?? null,
                type: archived.type ?? null,
                createdAt: archived.createdAt,
                updatedAt: archived.updatedAt,
            },
        })

        // Remove archived record
        await prisma.archivedEvent.delete({ where: { id: String(id) } })

        // audit-trail
        try {
            await fetch(new URL('/api/audit-trail', request.url), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'RESTORE',
                    entity: 'Event',
                    entityId: restored.id,
                    details: `Restored event: ${restored.name}`,
                    user: 'admin@eventmis.com',
                    changes: { fromArchivedId: id, restored },
                }),
            }).catch(() => { })
        } catch (e) {
            // swallow audit errors
        }

        return NextResponse.json({ ok: true, restored })
    } catch (err: any) {
        console.error('[restore] Unexpected error:', err?.stack || err?.message || err)
        return NextResponse.json({ error: 'Failed to restore event', detail: err?.message || String(err) }, { status: 500 })
    }
}