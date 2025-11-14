import { type NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '../../../lib/prisma'

// GET - retrieve all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ success: true, data: users, count: users.length, timestamp: new Date().toISOString() })
  } catch (err) {
    console.error('GET /api/users error', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 })
  }
}

// POST - create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.name || !body.username || !body.email) {
      return NextResponse.json({ success: false, error: 'Missing required fields: name, username, email' }, { status: 400 })
    }

    // Hash password if provided
    let hashedPassword = undefined
    if (body.password) {
      hashedPassword = await bcrypt.hash(body.password, 10)
    }

    const created = await prisma.user.create({
      data: {
        name: body.name,
        username: body.username,
        email: body.email,
        password: hashedPassword,
        role: body.role ?? 'Staff',
        status: body.status ?? 'Active',
      },
    })

    // audit-trail
    await fetch(new URL('/api/audit-trail', request.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'CREATE',
        entity: 'User',
        entityId: created.id,
        details: `Created user: ${created.name} (${created.role})`,
        user: 'admin@eventmis.com',
        changes: created,
      }),
    }).catch(() => { })

    return NextResponse.json({ success: true, data: created, message: 'User created successfully' }, { status: 201 })
  } catch (err) {
    console.error('POST /api/users error', err)
    return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 })
  }
}

// PUT - update user
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body
    if (!id) return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 })

    const existing = await prisma.user.findUnique({ where: { id: String(id) } })
    if (!existing) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })

    // Hash password if provided
    let hashedPassword = existing.password
    if (body.password) {
      hashedPassword = await bcrypt.hash(body.password, 10)
    }

    const updated = await prisma.user.update({
      where: { id: String(id) },
      data: {
        name: body.name ?? existing.name,
        username: body.username ?? existing.username,
        email: body.email ?? existing.email,
        password: hashedPassword,
        role: body.role ?? existing.role,
        status: body.status ?? existing.status,
      },
    })

    await fetch(new URL('/api/audit-trail', request.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'UPDATE',
        entity: 'User',
        entityId: updated.id,
        details: `Updated user: ${updated.name}`,
        user: 'admin@eventmis.com',
        changes: { before: existing, after: updated },
      }),
    }).catch(() => { })

    return NextResponse.json({ success: true, data: updated, message: 'User updated successfully' })
  } catch (err) {
    console.error('PUT /api/users error', err)
    return NextResponse.json({ success: false, error: 'Failed to update user' }, { status: 500 })
  }
}

// DELETE - delete user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 })

    const existing = await prisma.user.findUnique({ where: { id: String(id) } })
    if (!existing) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })

    await prisma.user.delete({ where: { id: String(id) } })

    await fetch(new URL('/api/audit-trail', request.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'DELETE',
        entity: 'User',
        entityId: id,
        details: `Deleted user: ${existing.name}`,
        user: 'admin@eventmis.com',
        changes: existing,
      }),
    }).catch(() => { })

    return NextResponse.json({ success: true, message: 'User deleted successfully' })
  } catch (err) {
    console.error('DELETE /api/users error', err)
    return NextResponse.json({ success: false, error: 'Failed to delete user' }, { status: 500 })
  }
}
