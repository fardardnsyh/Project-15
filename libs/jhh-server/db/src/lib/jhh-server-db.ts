import { PrismaClient } from '@prisma/client';

export function JhhServerDb(): PrismaClient {
  const prisma = new PrismaClient();

  return prisma;
}
