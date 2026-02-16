export const PRICE_TO_PLAN: Record<string, 'starter' | 'pro' | 'enterprise'> = {
  // Starter
  price_starter_monthly: 'starter',
  price_starter_yearly: 'starter',

  // Pro
  price_pro_monthly: 'pro',
  price_pro_yearly: 'pro',

  // Enterprise (if applicable)
  price_enterprise: 'enterprise',
};

export const PLAN_ENTITLEMENTS: Record<string, string[]> = {
  FREE: [],
  PRO: ['export_reports'],
  TEAM: ['export_reports', 'multi_user'],
};
