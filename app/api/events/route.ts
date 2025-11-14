import { type NextRequest, NextResponse } from 'next/server'

// Temporary mock responses for build - remove database dependency
export async function GET(request: NextRequest) {
  try {
    // Return mock data for dashboard
    const mockEvents = [
      {
        id: '1',
        clientName: 'Sample Client',
        eventTitle: 'Baby Shower Celebration',
        eventStatus: 'Approved',
        eventDate: new Date().toISOString(),
        eventTime: '2:00 PM',
        venue: 'Sample Venue',
        eventTheme: 'Twinkle Star',
        numberOfGuests: 50,
        totalAmount: 15000,
        gallery: ['/placeholder.jpg']
      }
    ]
    return NextResponse.json({
      success: true,
      data: mockEvents,
      count: mockEvents.length,
      timestamp: new Date().toISOString()
    })
  } catch (err) {
    console.error('GET /api/events error', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ success: true, message: 'Mock response - database disabled for build' })
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({ success: true, message: 'Mock response - database disabled for build' })
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({ success: true, message: 'Mock response - database disabled for build' })
}
