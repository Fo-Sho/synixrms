export type PlanName = 'starter' | 'pro' | 'enterprise';

export const PLAN_FEATURES: Record<PlanName, string[]> = {
  starter: [
    'basic_pricing',
    'analytics_basic',
  ],

  pro: [
    'basic_pricing',
    'analytics_basic',
    'realtime_pricing',
    'advanced_upsells',
  ],

  enterprise: [
    'basic_pricing',
    'analytics_basic',
    'realtime_pricing',
    'advanced_upsells',
    'custom_integrations',
    'sso',
  ],
};
