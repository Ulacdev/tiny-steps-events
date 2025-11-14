import { type NextRequest, NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'

// GET - retrieve all settings
export async function GET() {
  try {
    let settings = await prisma.appSettings.findFirst()
    if (!settings) {
      // Create default settings
      settings = await prisma.appSettings.create({
        data: {}
      })
    }
    return NextResponse.json({ success: true, data: settings, timestamp: new Date().toISOString() })
  } catch (err) {
    console.error('GET /api/settings error', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// POST - update settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    let existingSettings = await prisma.appSettings.findFirst()
    const changes = { before: existingSettings || {}, after: body }

    if (existingSettings) {
      await prisma.appSettings.update({
        where: { id: existingSettings.id },
        data: body
      })
    } else {
      existingSettings = await prisma.appSettings.create({
        data: body
      })
    }

    // audit-trail
    await fetch(new URL('/api/audit-trail', request.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'UPDATE',
        entity: 'AppSettings',
        entityId: existingSettings.id,
        details: `Updated system settings`,
        user: 'admin@eventmis.com',
        changes,
      }),
    }).catch(() => { })

    return NextResponse.json({ success: true, message: 'Settings updated successfully' })
  } catch (err) {
    console.error('POST /api/settings error', err)
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 })
  }
}