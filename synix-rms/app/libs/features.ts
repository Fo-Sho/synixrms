import { prisma } from '@/libs/prisma';
import { PLAN_FEATURES } from '@/config/plans';

export async function hasFeature(
  userId: string,
  feature: string
): Promise<boolean> {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: { in: ['active', 'trialing'] },
    },
  });

  if (!subscription) return false;

  const allowedFeatures =
    PLAN_FEATURES[subscription.plan as keyof typeof PLAN_FEATURES] ?? [];

  return allowedFeatures.includes(feature);
}
