import { type NextRequest, NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'

// GET - retrieve all financial records
export async function GET() {
  try {
    const records = await prisma.financialRecord.findMany({ orderBy: { date: 'desc' } })
    return NextResponse.json({ success: true, data: records, count: records.length, timestamp: new Date().toISOString() })
  } catch (err) {
    console.error('GET /api/financial error', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch financial records' }, { status: 500 })
  }
}

// POST - create new financial record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.eventName || !body.amount || !body.category) {
      return NextResponse.json({ success: false, error: 'Missing required fields: eventName, amount, category' }, { status: 400 })
    }

    const created = await prisma.financialRecord.create({
      data: {
        type: body.type ?? 'Expense',
        eventName: body.eventName,
        amount: parseFloat(body.amount),
        category: body.category,
        status: body.status ?? 'Pending',
        date: body.date ? new Date(body.date) : new Date(),
        description: body.description ?? null,
      },
    })

    // audit-trail
    await fetch(new URL('/api/audit-trail', request.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'CREATE',
        entity: 'FinancialRecord',
        entityId: created.id,
        details: `Created financial record: ${created.eventName}`,
        user: 'admin@eventmis.com',
        changes: created,
      }),
    }).catch(() => { })

    return NextResponse.json({ success: true, data: created, message: 'Financial record created successfully' }, { status: 201 })
  } catch (err) {
    console.error('POST /api/financial error', err)
    return NextResponse.json({ success: false, error: 'Failed to create financial record' }, { status: 500 })
  }
}

// PUT - update financial record
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body
    if (!id) return NextResponse.json({ success: false, error: 'Record ID is required' }, { status: 400 })

    const existing = await prisma.financialRecord.findUnique({ where: { id: String(id) } })
    if (!existing) return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 })

    const updated = await prisma.financialRecord.update({
      where: { id: String(id) },
      data: {
        type: body.type ?? existing.type,
        eventName: body.eventName ?? existing.eventName,
        amount: body.amount ? parseFloat(body.amount) : existing.amount,
        category: body.category ?? existing.category,
        status: body.status ?? existing.status,
        date: body.date ? new Date(body.date) : existing.date,
        description: body.description ?? existing.description,
      },
    })

    await fetch(new URL('/api/audit-trail', request.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'UPDATE',
        entity: 'FinancialRecord',
        entityId: updated.id,
        details: `Updated financial record: ${updated.eventName}`,
        user: 'admin@eventmis.com',
        changes: { before: existing, after: updated },
      }),
    }).catch(() => { })

    return NextResponse.json({ success: true, data: updated, message: 'Financial record updated successfully' })
  } catch (err) {
    console.error('PUT /api/financial error', err)
    return NextResponse.json({ success: false, error: 'Failed to update financial record' }, { status: 500 })
  }
}

// DELETE - delete financial record
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ success: false, error: 'Record ID is required' }, { status: 400 })

    const existing = await prisma.financialRecord.findUnique({ where: { id: String(id) } })
    if (!existing) return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 })

    await prisma.financialRecord.delete({ where: { id: String(id) } })

    await fetch(new URL('/api/audit-trail', request.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'DELETE',
        entity: 'FinancialRecord',
        entityId: id,
        details: `Deleted financial record: ${existing.eventName}`,
        user: 'admin@eventmis.com',
        changes: existing,
      }),
    }).catch(() => { })

    return NextResponse.json({ success: true, message: 'Financial record deleted successfully' })
  } catch (err) {
    console.error('DELETE /api/financial error', err)
    return NextResponse.json({ success: false, error: 'Failed to delete financial record' }, { status: 500 })
  }
}
