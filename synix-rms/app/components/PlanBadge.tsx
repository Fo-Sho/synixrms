export function PlanBadge({ plan }: { plan: string }) {
  return (
    <span className="rounded-full bg-muted px-3 py-1 text-sm">
      {plan.toUpperCase()} PLAN
    </span>
  );
}
