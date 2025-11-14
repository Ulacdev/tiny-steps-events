import { type NextRequest, NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'

// GET - Retrieve all audit logs
export async function GET() {
  try {
    const logs = await prisma.auditTrail.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ success: true, data: logs, count: logs.length })
  } catch (err) {
    console.error('GET /api/audit-trail error', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch audit logs' }, { status: 500 })
  }
}

// POST - Create new audit log entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, entity, entityId, details, user, changes } = body

    if (!action || !entity || !user) {
      return NextResponse.json({ success: false, error: 'Missing required fields: action, entity, user' }, { status: 400 })
    }

    const created = await prisma.auditTrail.create({
      data: {
        action,
        entity,
        entityId: entityId ? String(entityId) : null,
        details: details ?? `${action} ${entity}`,
        user,
        changes: changes ?? undefined,
      },
    })

    return NextResponse.json({ success: true, data: created, message: 'Audit log created successfully' }, { status: 201 })
  } catch (err) {
    console.error('POST /api/audit-trail error', err)
    return NextResponse.json({ success: false, error: 'Failed to create audit log' }, { status: 500 })
  }
}
