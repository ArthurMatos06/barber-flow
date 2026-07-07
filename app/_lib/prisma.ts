import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

declare global {
  var cachedPrisma: PrismaClient | undefined
}

const prisma =
  global.cachedPrisma ??
  new PrismaClient({
    adapter,
  })

if (process.env.NODE_ENV !== "production") {
  global.cachedPrisma = prisma
}

export const db = prisma
