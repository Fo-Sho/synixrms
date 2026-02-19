export const PRICE_TO_PLAN: Record<string, 'starter' | 'pro' | 'enterprise'> = {
  // Starter
  price_1Sv1VKCVMysKg9P0ZOos2DCx: 'starter',
  price_starter_yearly: 'starter',

  // Pro
  price_1Sv23VCVMysKg9P0neTxuCjU: 'pro',
  price_pro_yearly: 'pro',

  // Enterprise
  price_1Sv29WCVMysKg9P04CnR6DNc: 'enterprise',
};

export const PLAN_ENTITLEMENTS: Record<string, string[]> = {
  FREE: [],
  PRO: ['export_reports'],
  TEAM: ['export_reports', 'multi_user'],
};