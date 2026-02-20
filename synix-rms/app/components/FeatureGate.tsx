'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface FeatureGateProps {
  requiredPlan: 'starter' | 'pro' | 'enterprise';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureGate({ requiredPlan, children, fallback }: FeatureGateProps) {
  const { user } = useUser();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAccess() {
      if (!user) return;

      try {
        const response = await fetch('/api/user/plan');
        const { plan } = await response.json();
        
        const planHierarchy = { free: 0, starter: 1, pro: 2, enterprise: 3 };
        const userLevel = planHierarchy[plan] || 0;
        const requiredLevel = planHierarchy[requiredPlan] || 1;
        
        const hasRequiredAccess = userLevel >= requiredLevel;
        setHasAccess(hasRequiredAccess);

        if (!hasRequiredAccess) {
          router.push(`/en/dashboard/billing?upgrade=${requiredPlan}`);
        }
      } catch (error) {
        console.error('Error checking plan:', error);
        setHasAccess(false);
      }
    }

    checkAccess();
  }, [user, requiredPlan, router]);

  if (hasAccess === null) {
    return <div>Loading...</div>;
  }

  if (!hasAccess) {
    return fallback || <div>Upgrading...</div>;
  }

  return <>{children}</>;
}