export type Plan = "free" | "pro" | "team";

export const PLAN_ORDER: Plan[] = ["free", "pro", "team"];

export function hasRequiredPlan(
  userPlan: Plan,
  requiredPlan: Plan
) {
  return (
    PLAN_ORDER.indexOf(userPlan) >=
    PLAN_ORDER.indexOf(requiredPlan)
  );
}

/**
 * Route → minimum required plan
 */
export const FEATURE_GATES: Record<string, Plan> = {
  "/dashboard/analytics": "pro",
  "/dashboard/exports": "pro",
  "/dashboard/team": "team",
};
