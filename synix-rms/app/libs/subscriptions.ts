import { prisma } from '@/libs/prisma';
import type { Plan } from '@/libs/feature-gates';

import { PLAN_FEATURES } from './plans';

/**
 * Simple boolean check (used for route protection)
 */
export async function hasActiveSubscription(userId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: {
        in: ['active', 'trialing'],
      },
    },
    orderBy: {
      currentPeriodEnd: 'desc',
    },
  });

  return Boolean(subscription);
}

/**
 * Full subscription object (used for feature gating, plan checks, billing UI)
 */
export async function getActiveSubscription(userId: string) {
  return prisma.subscription.findFirst({
    where: {
      userId,
      status: {
        in: ['active', 'trialing'],
      },
    },
    orderBy: {
      currentPeriodEnd: 'desc',
    },
  });
}

export async function getUserPlan(userId: string): Promise<Plan> {
  const subscription = await getActiveSubscription(userId);
  
  if (!subscription) {
    return 'free';
  }

  // Map Stripe price IDs to plan types that match your feature gates
switch (subscription.stripePriceId) {
    case 'price_1Sv1VKCVMysKg9P0ZOos2DCx':
    case 'price_starter_yearly':
      return 'pro';
    case 'price_1Sv23VCVMysKg9P0neTxuCjU':
    case 'price_pro_yearly':
      return 'pro';
    case 'price_1Sv29WCVMysKg9P04CnR6DNc':
    case 'price_enterprise_yearly':
    case 'price_team_monthly':
    case 'price_team_yearly':
      return 'team';
    default:
      return 'free';
  }
}

export async function hasFeature(userId: string, feature: string) {
  const subscription = await getActiveSubscription(userId);
  if (!subscription) return false;

  const planName = subscription.stripePriceId === 'price_1Sv1VKCVMysKg9P0ZOos2DCx' ? 'Starter' :
                   subscription.stripePriceId === 'price_1Sv23VCVMysKg9P0neTxuCjU' ? 'Pro' :
                   subscription.stripePriceId === 'price_1Sv29WCVMysKg9P04CnR6DNc' ? 'Enterprise' :
                   'Starter';

  const features = PLAN_FEATURES[planName];
  return features?.includes(feature) || false;
}