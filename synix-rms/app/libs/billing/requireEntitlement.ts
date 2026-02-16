import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/libs/prisma';

export class ForbiddenError extends Error {}
export class UnauthorizedError extends Error {}

export async function requireEntitlement(feature: string) {
  const { userId } = auth();

  if (!userId) {
    throw new UnauthorizedError('Not authenticated');
  }

  const entitlement = await prisma.entitlement.findFirst({
    where: {
      userId,
      feature,
      active: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
  });

  if (!entitlement) {
    throw new ForbiddenError(`Missing entitlement: ${feature}`);
  }
}
