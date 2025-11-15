import { type NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    const where = status ? { eventStatus: status } : {}

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.event.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: events,
      count: total,
      page,
      totalPages: Math.ceil(total / limit),
      timestamp: new Date().toISOString()
    })
  } catch (err) {
    console.error('GET /api/events error', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch events' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const event = await prisma.event.create({
      data: {
        clientName: body.clientName,
        contactNumber: body.contactNumber,
        email: body.email,
        eventTitle: body.eventTitle,
        eventTheme: body.eventTheme,
        packageType: body.packageType,
        eventDate: new Date(body.eventDate),
        eventTime: body.eventTime,
        venue: body.venue,
        numberOfGuests: body.numberOfGuests || 50,
        paymentStatus: body.paymentStatus || 'Pending',
        totalAmount: body.totalAmount || 15000,
        remarks: body.remarks,
        eventStatus: body.eventStatus || 'Pending',
        gallery: body.gallery || '[]'
      }
    })

    return NextResponse.json({
      success: true,
      data: event,
      message: 'Event created successfully'
    })
  } catch (err) {
    console.error('POST /api/events error', err)
    return NextResponse.json({ success: false, error: 'Failed to create event' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Event ID is required' }, { status: 400 })
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...updateData,
        eventDate: updateData.eventDate ? new Date(updateData.eventDate) : undefined,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: event,
      message: 'Event updated successfully'
    })
  } catch (err) {
    console.error('PUT /api/events error', err)
    return NextResponse.json({ success: false, error: 'Failed to update event' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Event ID is required' }, { status: 400 })
    }

    await prisma.event.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully'
    })
  } catch (err) {
    console.error('DELETE /api/events error', err)
    return NextResponse.json({ success: false, error: 'Failed to delete event' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
