const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function main() {
    const root = path.resolve(__dirname, '..')
    const eventsPath = path.join(root, 'data', 'events.json')
    const archivePath = path.join(root, 'data', 'archive.json')
    const adminPath = path.join(root, 'data', 'admin.json')

    if (fs.existsSync(eventsPath)) {
        const raw = fs.readFileSync(eventsPath, 'utf-8')
        let items = [] as any[]
        try {
            items = JSON.parse(raw)
        } catch (err) {
            console.error('Failed to parse events.json:', err)
        }

        for (const e of items) {
            try {
                await db.event.create({
                    data: {
                        clientName: e.clientName ?? e.name ?? 'Unknown Client',
                        contactNumber: e.contactNumber ?? null,
                        email: e.email ?? null,
                        eventTitle: e.eventTitle ?? e.name ?? 'Untitled Event',
                        eventTheme: e.eventTheme ?? 'Twinkle Star',
                        packageType: e.packageType ?? 'Basic',
                        eventDate: e.eventDate ? new Date(e.eventDate) : e.date ? new Date(e.date) : new Date(),
                        eventTime: e.eventTime ?? e.time ?? null,
                        venue: e.venue ?? e.location ?? null,
                        numberOfGuests: typeof e.numberOfGuests === 'number' ? e.numberOfGuests : typeof e.attendees === 'number' ? e.attendees : parseInt(e.attendees) || 50,
                        paymentStatus: e.paymentStatus ?? 'Pending',
                        totalAmount: typeof e.totalAmount === 'number' ? e.totalAmount : 15000,
                        remarks: e.remarks ?? null,
                        eventStatus: e.eventStatus ?? e.status ?? 'Pending',
                        createdAt: e.createdAt ? new Date(e.createdAt) : undefined,
                        updatedAt: e.updatedAt ? new Date(e.updatedAt) : undefined,
                    },
                })
            } catch (err) {
                console.error('Failed to upsert event', e, err)
            }
        }
    }

    if (fs.existsSync(archivePath)) {
        const raw = fs.readFileSync(archivePath, 'utf-8')
        let items = [] as any[]
        try {
            items = JSON.parse(raw)
        } catch (err) {
            console.error('Failed to parse archive.json:', err)
        }

        for (const e of items) {
            try {
                await db.archivedEvent.upsert({
                    where: { id: String(e.id) },
                    update: {
                        clientName: e.clientName ?? e.name ?? 'Unknown Client',
                        contactNumber: e.contactNumber ?? null,
                        email: e.email ?? null,
                        eventTitle: e.eventTitle ?? e.name ?? 'Untitled Event',
                        eventTheme: e.eventTheme ?? 'Twinkle Star',
                        packageType: e.packageType ?? 'Basic',
                        eventDate: e.eventDate ? new Date(e.eventDate) : e.date ? new Date(e.date) : null,
                        eventTime: e.eventTime ?? e.time ?? null,
                        venue: e.venue ?? e.location ?? null,
                        numberOfGuests: typeof e.numberOfGuests === 'number' ? e.numberOfGuests : typeof e.attendees === 'number' ? e.attendees : parseInt(e.attendees) || 50,
                        paymentStatus: e.paymentStatus ?? 'Pending',
                        totalAmount: typeof e.totalAmount === 'number' ? e.totalAmount : 15000,
                        remarks: e.remarks ?? null,
                        eventStatus: e.eventStatus ?? e.status ?? 'Completed',
                        archivedAt: e.archivedAt ? new Date(e.archivedAt) : new Date(),
                    },
                    create: {
                        id: e.id ? String(e.id) : undefined,
                        clientName: e.clientName ?? e.name ?? 'Unknown Client',
                        contactNumber: e.contactNumber ?? null,
                        email: e.email ?? null,
                        eventTitle: e.eventTitle ?? e.name ?? 'Untitled Event',
                        eventTheme: e.eventTheme ?? 'Twinkle Star',
                        packageType: e.packageType ?? 'Basic',
                        eventDate: e.eventDate ? new Date(e.eventDate) : e.date ? new Date(e.date) : new Date(),
                        eventTime: e.eventTime ?? e.time ?? null,
                        venue: e.venue ?? e.location ?? null,
                        numberOfGuests: typeof e.numberOfGuests === 'number' ? e.numberOfGuests : typeof e.attendees === 'number' ? e.attendees : parseInt(e.attendees) || 50,
                        paymentStatus: e.paymentStatus ?? 'Pending',
                        totalAmount: typeof e.totalAmount === 'number' ? e.totalAmount : 15000,
                        remarks: e.remarks ?? null,
                        eventStatus: e.eventStatus ?? e.status ?? 'Completed',
                        createdAt: e.createdAt ? new Date(e.createdAt) : new Date(),
                        updatedAt: e.updatedAt ? new Date(e.updatedAt) : new Date(),
                        archivedAt: e.archivedAt ? new Date(e.archivedAt) : new Date(),
                    },
                })
            } catch (err) {
                console.error('Failed to upsert archived event', e, err)
            }
        }
    }


    // Create admin user
    const adminCount = await db.user.count()
    if (adminCount === 0) {
        console.log('Creating admin user...')

        const hashedPassword = await bcrypt.hash('admin123', 10)

        await db.user.create({
            data: {
                name: 'System Administrator',
                username: 'admin',
                email: 'admin@eventmis.com',
                password: hashedPassword,
                role: 'Admin',
                status: 'Active',
            },
        })

        console.log('Admin user created with email: admin@eventmis.com and password: admin123')
    }

    console.log('Seeding complete')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })
