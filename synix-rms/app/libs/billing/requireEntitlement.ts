import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/libs/prisma';

export class ForbiddenError extends Error {}
export class UnauthorizedError extends Error {}

export async function requireEntitlement(feature: string) {
  // FIX: Await the auth() function
  const { userId } = await auth();

  if (!userId) {
    throw new UnauthorizedError('Not authenticated');
  }

  // Check if user has the required feature/entitlement
  // Add your entitlement checking logic here
  const userSubscription = await prisma.userSubscription.findFirst({
    where: {
      userId: userId,
      status: 'active'
    }
  });

  if (!userSubscription) {
    throw new ForbiddenError(`Feature '${feature}' requires an active subscription`);
  }

  // Additional feature-specific checks can go here
  return { userId, subscription: userSubscription };
}
