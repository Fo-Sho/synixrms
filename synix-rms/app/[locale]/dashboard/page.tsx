import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getActiveSubscription } from '@/libs/subscriptions';
import { SSOButton } from '@/components/SSOButton';

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const user = await currentUser();
  const subscription = await getActiveSubscription(userId);

  console.log('Dashboard - Clerk userId:', userId);
  console.log('Dashboard - subscription found:', subscription);

  // Determine user's plan and access level
  const isSubscribed = Boolean(subscription);
  const planName = subscription?.planName || 'Free';
  
  // ... rest of component
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Welcome, {user?.firstName}!
        </h1>
        <div className="text-sm">
          <span className="text-gray-500">Current Plan: </span>
          <span className="font-semibold text-blue-600">{planName}</span>
        </div>
      </div>

      {/* Subscription Status */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Hotel Management System Access
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {isSubscribed 
                ? `Your ${planName} subscription gives you full access to the hotel management platform`
                : 'Subscribe to access the full hotel management system'
              }
            </p>
          </div>
          <div className="flex gap-3">
            {/* Always show test button for now */}
            <SSOButton className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              {isSubscribed ? 'Launch Hotel System' : 'Test SSO (No Subscription)'}
            </SSOButton>
            
            {!isSubscribed && (
              <Link
                href="/en/dashboard/billing"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Subscribe Now
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Rest of your existing dashboard content... */}
      {/* (Keep all your existing subscription details, free tier limitations, etc.) */}
    </div>
  );
}

function getPlanFromPriceId(priceId: string): string {
  const priceToPlans: Record<string, string> = {
    'price_1Sv1VKCVMysKg9P0ZOos2DCx': 'Starter',
    'price_starter_yearly': 'Starter',
    'price_1Sv23VCVMysKg9P0neTxuCjU': 'Pro',
    'price_pro_yearly': 'Pro',
  };
  
  return priceToPlans[priceId] || 'Free';
}