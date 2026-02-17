import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/libs/prisma';

export class ForbiddenError extends Error {}
export class UnauthorizedError extends Error {}

export async function requireEntitlement(feature: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new UnauthorizedError('Not authenticated');
  }

  // Fix: Use 'subscription' instead of 'userSubscription'
  const userSubscription = await prisma.subscription.findFirst({
    where: {
      userId: userId,
      status: 'active'
    }
  });

  if (!userSubscription) {
    throw new ForbiddenError(`Feature '${feature}' requires an active subscription`);
  }

  return { userId, subscription: userSubscription };
}
