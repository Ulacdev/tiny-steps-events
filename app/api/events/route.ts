import { type NextRequest, NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'

// GET - retrieve all events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const approvedOnly = searchParams.get('approved') === 'true'
    const statusFilter = searchParams.get('status')

    let whereClause: any = {}
    if (approvedOnly) {
      whereClause.eventStatus = 'Approved'
    } else if (statusFilter) {
      whereClause.eventStatus = statusFilter
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    })
    // Parse gallery JSON strings back to arrays
    const processedEvents = events.map((event: any) => ({
      ...event,
      gallery: event.gallery ? JSON.parse(event.gallery) : []
    }))
    return NextResponse.json({ success: true, data: processedEvents, count: processedEvents.length, timestamp: new Date().toISOString() })
  } catch (err) {
    console.error('GET /api/events error', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch events' }, { status: 500 })
  }
}

// POST - create new event booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.clientName || !body.eventTitle || !body.eventDate || !body.venue) {
      return NextResponse.json({ success: false, error: 'Missing required fields: clientName, eventTitle, eventDate, venue' }, { status: 400 })
    }

    const created = await prisma.event.create({
      data: {
        clientName: body.clientName,
        contactNumber: body.contactNumber ?? null,
        email: body.email ?? null,
        eventTitle: body.eventTitle,
        eventTheme: body.eventTheme ?? 'Twinkle Star',
        packageType: body.packageType ?? 'Basic',
        eventDate: body.eventDate ? new Date(body.eventDate) : new Date(),
        eventTime: body.eventTime ?? null,
        venue: body.venue,
        numberOfGuests: typeof body.numberOfGuests === 'number' ? body.numberOfGuests : parseInt(body.numberOfGuests) || 50,
        paymentStatus: body.paymentStatus ?? 'Pending',
        totalAmount: typeof body.totalAmount === 'number' ? body.totalAmount : parseFloat(body.totalAmount) || 15000,
        remarks: body.remarks ?? null,
        eventStatus: body.eventStatus ?? 'Pending',
        gallery: Array.isArray(body.gallery) ? JSON.stringify(body.gallery) : '[]',
      },
    })

    // audit-trail
    await fetch(new URL('/api/audit-trail', request.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'CREATE',
        entity: 'Event',
        entityId: created.id,
        details: `Created booking: ${created.eventTitle} for ${created.clientName}`,
        user: 'admin@eventmis.com',
        changes: created,
      }),
    }).catch(() => { })

    return NextResponse.json({ success: true, data: { ...created, gallery: created.gallery ? JSON.parse(created.gallery) : [] }, message: 'Event booking created successfully' }, { status: 201 })
  } catch (err) {
    console.error('POST /api/events error', err)
    return NextResponse.json({ success: false, error: 'Failed to create event booking' }, { status: 500 })
  }
}

// PUT - update event booking
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body
    if (!id) return NextResponse.json({ success: false, error: 'Event ID is required' }, { status: 400 })

    const existing = await prisma.event.findUnique({ where: { id: String(id) } })
    if (!existing) return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 })

    const updated = await prisma.event.update({
      where: { id: String(id) },
      data: {
        clientName: body.clientName ?? existing.clientName,
        contactNumber: body.contactNumber ?? existing.contactNumber,
        email: body.email ?? existing.email,
        eventTitle: body.eventTitle ?? existing.eventTitle,
        eventTheme: body.eventTheme ?? existing.eventTheme,
        packageType: body.packageType ?? existing.packageType,
        eventDate: body.eventDate ? new Date(body.eventDate) : existing.eventDate,
        eventTime: body.eventTime ?? existing.eventTime,
        venue: body.venue ?? existing.venue,
        numberOfGuests: typeof body.numberOfGuests === 'number' ? body.numberOfGuests : existing.numberOfGuests,
        paymentStatus: body.paymentStatus ?? existing.paymentStatus,
        totalAmount: typeof body.totalAmount === 'number' ? body.totalAmount : existing.totalAmount,
        remarks: body.remarks ?? existing.remarks,
        eventStatus: body.eventStatus ?? existing.eventStatus,
        gallery: body.gallery !== undefined ? (Array.isArray(body.gallery) ? JSON.stringify(body.gallery) : body.gallery) : existing.gallery,
      },
    })

    await fetch(new URL('/api/audit-trail', request.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'UPDATE',
        entity: 'Event',
        entityId: updated.id,
        details: `Updated booking: ${updated.eventTitle} for ${updated.clientName}`,
        user: 'admin@eventmis.com',
        changes: { before: existing, after: updated },
      }),
    }).catch(() => { })

    return NextResponse.json({ success: true, data: { ...updated, gallery: updated.gallery ? JSON.parse(updated.gallery) : [] }, message: 'Event booking updated successfully' })
  } catch (err) {
    console.error('PUT /api/events error', err)
    return NextResponse.json({ success: false, error: 'Failed to update event booking' }, { status: 500 })
  }
}

// DELETE - archive event
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ success: false, error: 'Event ID is required' }, { status: 400 })

    const existing = await prisma.event.findUnique({ where: { id: String(id) } })
    if (!existing) return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 })

    // create archived record
    const archived = await prisma.archivedEvent.create({
      data: {
        clientName: existing.clientName,
        contactNumber: existing.contactNumber ?? null,
        email: existing.email ?? null,
        eventTitle: existing.eventTitle,
        eventTheme: existing.eventTheme,
        packageType: existing.packageType,
        eventDate: existing.eventDate,
        eventTime: existing.eventTime ?? null,
        venue: existing.venue,
        numberOfGuests: existing.numberOfGuests,
        paymentStatus: existing.paymentStatus,
        totalAmount: existing.totalAmount,
        remarks: existing.remarks ?? null,
        eventStatus: existing.eventStatus,
        gallery: existing.gallery,
        createdAt: existing.createdAt,
        updatedAt: existing.updatedAt,
        archivedAt: new Date(),
      },
    })

    // delete original
    await prisma.event.delete({ where: { id: String(id) } })

    await fetch(new URL('/api/audit-trail', request.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'ARCHIVE',
        entity: 'Event',
        entityId: id,
        details: `Archived booking: ${existing.eventTitle} for ${existing.clientName}`,
        user: 'admin@eventmis.com',
        changes: existing,
      }),
    }).catch(() => { })

    return NextResponse.json({ success: true, data: archived, message: 'Event archived successfully' })
  } catch (err) {
    console.error('DELETE /api/events error', err)
    return NextResponse.json({ success: false, error: 'Failed to archive event' }, { status: 500 })
  }
}
