import { type NextRequest, NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'

// GET - retrieve all messages
export async function GET() {
  try {
    const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ success: true, data: messages, count: messages.length, timestamp: new Date().toISOString() })
  } catch (err) {
    console.error('GET /api/messages error', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch messages' }, { status: 500 })
  }
}

// POST - create new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.recipient || !body.subject || !body.body) {
      return NextResponse.json({ success: false, error: 'Missing required fields: recipient, subject, body' }, { status: 400 })
    }

    const created = await prisma.message.create({
      data: {
        recipient: body.recipient,
        subject: body.subject,
        body: body.body,
        type: body.type ?? 'Inbox',
        read: body.read ?? false,
      },
    })

    // audit-trail
    await fetch(new URL('/api/audit-trail', request.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'CREATE',
        entity: 'Message',
        entityId: created.id,
        details: `Sent message: ${created.subject}`,
        user: 'admin@eventmis.com',
        changes: created,
      }),
    }).catch(() => { })

    return NextResponse.json({ success: true, data: created, message: 'Message sent successfully' }, { status: 201 })
  } catch (err) {
    console.error('POST /api/messages error', err)
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 })
  }
}

// PUT - update message (edit message content)
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ success: false, error: 'Message ID is required' }, { status: 400 })

    const body = await request.json()
    const { recipient, subject, body: messageBody, read } = body

    const existing = await prisma.message.findUnique({ where: { id: String(id) } })
    if (!existing) return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 })

    const updated = await prisma.message.update({
      where: { id: String(id) },
      data: {
        recipient: recipient ?? existing.recipient,
        subject: subject ?? existing.subject,
        body: messageBody ?? existing.body,
        read: read ?? existing.read
      }
    })

    // audit-trail
    await fetch(new URL('/api/audit-trail', request.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'UPDATE',
        entity: 'Message',
        entityId: updated.id,
        details: `Updated message: ${updated.subject}`,
        user: 'admin@eventmis.com',
        changes: { old: existing, new: updated },
      }),
    }).catch(() => { })

    return NextResponse.json({ success: true, data: updated, message: 'Message updated successfully' })
  } catch (err) {
    console.error('PUT /api/messages error', err)
    return NextResponse.json({ success: false, error: 'Failed to update message' }, { status: 500 })
  }
}

// DELETE - delete message
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ success: false, error: 'Message ID is required' }, { status: 400 })

    const existing = await prisma.message.findUnique({ where: { id: String(id) } })
    if (!existing) return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 })

    await prisma.message.delete({ where: { id: String(id) } })

    await fetch(new URL('/api/audit-trail', request.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'DELETE',
        entity: 'Message',
        entityId: id,
        details: `Deleted message: ${existing.subject}`,
        user: 'admin@eventmis.com',
        changes: existing,
      }),
    }).catch(() => { })

    return NextResponse.json({ success: true, message: 'Message deleted successfully' })
  } catch (err) {
    console.error('DELETE /api/messages error', err)
    return NextResponse.json({ success: false, error: 'Failed to delete message' }, { status: 500 })
  }
}