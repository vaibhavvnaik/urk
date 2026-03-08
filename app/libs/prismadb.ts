import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

// Support both env names used in this monorepo.
if (!process.env.DATABASE_URL && process.env.MONGODB_URI) {
  process.env.DATABASE_URL = process.env.MONGODB_URI;
}

const client = globalThis.prisma || new PrismaClient()
if (process.env.NODE_ENV !== "production") globalThis.prisma = client

export default client
