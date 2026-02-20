import { FeatureGate } from '@/components/FeatureGate';

export default function AnalyticsPage() {
  return (
    <FeatureGate requiredPlan="pro">
      <div>
        <h1>Analytics Dashboard</h1>
        {/* Your analytics content */}
      </div>
    </FeatureGate>
  );
}