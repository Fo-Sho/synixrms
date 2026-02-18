import { prisma } from '@/libs/prisma';
import { PLAN_FEATURES } from '@/config/plans';

export async function hasFeature(
  userId: string,
  feature: string
): Promise<boolean> {
  // Get user's subscription
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: 'active'
    }
  });

  if (!subscription) return false;

  // Fix: Use 'planName' instead of 'plan'
  const allowedFeatures =
    PLAN_FEATURES[subscription.planName as keyof typeof PLAN_FEATURES] ?? [];

  return allowedFeatures.includes(feature);
}