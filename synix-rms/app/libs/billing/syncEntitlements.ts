import { prisma } from '@/libs/prisma';
import { PLAN_ENTITLEMENTS } from '@/config/stripePlans';

export async function syncEntitlementsForUser(
  userId: string,
  plan: string
) {
  const features = PLAN_ENTITLEMENTS[plan] ?? [];

  // 1. Remove existing subscription-based entitlements
  await prisma.entitlement.deleteMany({
    where: {
      userId,
      source: 'subscription',
    },
  });

  // 2. Add new ones
  if (features.length > 0) {
    await prisma.entitlement.createMany({
      data: features.map(feature => ({
        userId,
        feature,
        source: 'subscription',
      })),
    });
  }
}
