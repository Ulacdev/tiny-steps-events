import { PrismaClient } from '@prisma/client'

declare global {
    // allow global prisma to be cached across module reloads in development
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined
}

const prisma = (global as any).prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') (global as any).prisma = prisma

export default prisma
