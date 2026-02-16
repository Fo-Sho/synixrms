import { Plan } from "@/libs/feature-gates";
import { PLAN_ORDER } from "@/libs/feature-gates";

export function canAccess(
  userPlan: Plan,
  requiredPlan: Plan
) {
  return (
    PLAN_ORDER.indexOf(userPlan) >=
    PLAN_ORDER.indexOf(requiredPlan)
  );
}
