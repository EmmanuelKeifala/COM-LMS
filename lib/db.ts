import {PrismaClient} from '@prisma/client/edge';
import {withAccelerate} from '@prisma/extension-accelerate';

declare global {
  var prisma: PrismaClient | undefined;
}

export const db: any =
  globalThis.prisma ||
  new PrismaClient({
    datasources: {db: {url: process.env.DATABASE_URL}},
  }).$extends(withAccelerate());

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
