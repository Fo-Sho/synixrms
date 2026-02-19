// app/libs/plans.ts
export const PLAN_FEATURES = {
  Starter: ['dynamic_pricing', 'basic_analytics', 'email_support'],
  Pro: ['dynamic_pricing', 'basic_analytics', 'email_support', 'realtime_pricing', 'advanced_upsells', 'revenue_dashboards'],
  Enterprise: ['dynamic_pricing', 'basic_analytics', 'email_support', 'realtime_pricing', 'advanced_upsells', 'revenue_dashboards', 'custom_pricing', 'dedicated_manager', 'SSO'],
};


// Update the getPlanFromPriceId function:
export function getPlanFromPriceId(priceId: string): string {
  const planMap: Record<string, string> = {
    'price_1Sv1VKCVMysKg9P0ZOos2DCx': 'Starter',
    'price_starter_yearly': 'Starter',
    'price_1Sv23VCVMysKg9P0neTxuCjU': 'Pro',
    'price_pro_yearly': 'Pro',
    'price_1Sv29WCVMysKg9P04CnR6DNc': 'Enterprise',
  };
  
  return planMap[priceId] || 'Unknown';
}

export function getPriceIdFromPlan(plan: string, interval: 'monthly' | 'yearly'): string {
  const priceMap: Record<string, Record<string, string>> = {
    'Starter': {
      monthly: 'price_1Sv1VKCVMysKg9P0ZOos2DCx',
      yearly: 'price_starter_yearly',
    },
    'Pro': {
      monthly: 'price_1Sv23VCVMysKg9P0neTxuCjU',
      yearly: 'price_pro_yearly',
    },
    'Enterprise': {
      monthly: 'price_1Sv29WCVMysKg9P04CnR6DNc',
      yearly: 'price_enterprise_yearly',
    },
  };

    return priceMap[plan]?.[interval] || '';
}

// Helper function to check if a plan has a specific feature
export function planHasFeature(plan: string, feature: string): boolean {
  return PLAN_FEATURES[plan as keyof typeof PLAN_FEATURES]?.includes(feature) || false;
}

// Get all features for a plan
export function getPlanFeatures(plan: string): string[] {
  return PLAN_FEATURES[plan as keyof typeof PLAN_FEATURES] || [];
}