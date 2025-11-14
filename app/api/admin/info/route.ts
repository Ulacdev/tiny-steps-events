import { NextRequest, NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const email = searchParams.get('email')

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: { name: true, email: true }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json(user)
    } catch (err) {
        console.error('GET /api/admin/info error', err)
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { name, email, password, image } = body || {}

        if (typeof name !== 'string' || typeof email !== 'string') {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: { name: true, email: true, password: true, image: true }
        })

        if (!existingUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const updateData: any = {
            name
        }

        if (typeof password === 'string' && password.length > 0) {
            updateData.password = await bcrypt.hash(password, 10)
        }

        const updatedUser = await prisma.user.update({
            where: { email },
            data: updateData,
            select: { name: true, email: true }
        })

        // audit-trail
        await fetch(new URL('/api/audit-trail', request.url), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'UPDATE',
                entity: 'AdminProfile',
                entityId: `user-${email}`,
                details: `Updated admin profile: ${name}`,
                user: email,
                changes: { before: existingUser, after: updatedUser },
            }),
        }).catch(() => { })

        return NextResponse.json({ ok: true, data: updatedUser }, { status: 201 })
    } catch (err) {
        console.error('POST /api/admin/info error', err)
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 })
    }
}
