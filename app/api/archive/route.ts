import { type NextRequest, NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'

// GET - Retrieve all archived events
export async function GET() {
  try {
    const items = await prisma.archivedEvent.findMany({ orderBy: { archivedAt: 'desc' } })
    return NextResponse.json({ success: true, data: items, count: items.length })
  } catch (err) {
    console.error('GET /api/archive error', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch archived events' }, { status: 500 })
  }
}

// POST - Archive an event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, user } = body
    if (!event || !event.id) return NextResponse.json({ success: false, error: 'Event data is required' }, { status: 400 })

    const archived = await prisma.archivedEvent.create({
      data: {
        clientName: event.clientName,
        contactNumber: event.contactNumber ?? null,
        email: event.email ?? null,
        eventTitle: event.eventTitle,
        eventTheme: event.eventTheme,
        packageType: event.packageType,
        eventDate: event.eventDate ? new Date(event.eventDate) : new Date(),
        eventTime: event.eventTime ?? null,
        venue: event.venue,
        numberOfGuests: typeof event.numberOfGuests === 'number' ? event.numberOfGuests : parseInt(event.numberOfGuests) || 50,
        paymentStatus: event.paymentStatus,
        totalAmount: typeof event.totalAmount === 'number' ? event.totalAmount : parseFloat(event.totalAmount) || 15000,
        remarks: event.remarks ?? null,
        eventStatus: event.eventStatus,
        createdAt: event.createdAt ? new Date(event.createdAt) : new Date(),
        updatedAt: event.updatedAt ? new Date(event.updatedAt) : new Date(),
        archivedAt: new Date(),
      },
    })

    // optionally remove original event if present
    try {
      await prisma.event.delete({ where: { id: String(event.id) } })
    } catch (e) {
      // ignore if not found
    }

    return NextResponse.json({ success: true, data: archived, message: 'Event archived successfully' }, { status: 201 })
  } catch (err) {
    console.error('POST /api/archive error', err)
    return NextResponse.json({ success: false, error: 'Failed to archive event' }, { status: 500 })
  }
}

// DELETE - Remove archived event (used to remove after restore)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ success: false, error: 'Event ID is required' }, { status: 400 })

    const deleted = await prisma.archivedEvent.delete({ where: { id: String(id) } })
    return NextResponse.json({ success: true, data: deleted, message: 'Archived event removed' })
  } catch (err) {
    console.error('DELETE /api/archive error', err)
    return NextResponse.json({ success: false, error: 'Failed to remove archived event' }, { status: 500 })
  }
}
