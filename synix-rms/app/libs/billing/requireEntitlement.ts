import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/libs/prisma';

export class ForbiddenError extends Error {}
export class UnauthorizedError extends Error {}

export async function requireEntitlement(feature: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new UnauthorizedError('Not authenticated');
  }

  // For now, just check authentication - you can add subscription logic later
  console.log(`User ${userId} accessing feature: ${feature}`);
  
  return { userId };
}