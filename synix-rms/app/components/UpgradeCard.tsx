type Props = {
  feature: string;
  requiredPlan: "Pro" | "Team";
};

export default function UpgradeCard({
  feature,
  requiredPlan,
}: Props) {
  return (
    <div className="rounded-lg border p-6">
      <h2 className="text-lg font-semibold">
        {feature} is a {requiredPlan} feature
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Upgrade to {requiredPlan} to unlock this feature.
      </p>
      <a
        href={`/billing?upgrade=${requiredPlan.toLowerCase()}`}
        className="mt-4 inline-block rounded bg-black px-4 py-2 text-white"
      >
        Upgrade to {requiredPlan}
      </a>
    </div>
  );
}
