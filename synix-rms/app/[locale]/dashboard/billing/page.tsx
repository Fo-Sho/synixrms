'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

type Plan = {
  name: string;
  description: string;
  monthlyPriceId?: string;
  yearlyPriceId?: string;
  monthly?: number;
  yearly?: number;
  features: string[];
  popular?: boolean;
};

type Subscription = {
  status: string;
  plan: string;
  currentPeriodEnd: number;
};

const PLANS: Plan[] = [
  {
    name: 'Starter',
    description: 'For small hotels getting started',
    monthly: 169,
    yearly: 1908,
    monthlyPriceId: 'price_starter_monthly',
    yearlyPriceId: 'price_starter_yearly',
    features: ['Dynamic pricing rules', 'Basic analytics', 'Email support'],
  },
  {
    name: 'Pro',
    description: 'For growing hotel groups',
    monthly: 199,
    yearly: 2028,
    popular: true,
    monthlyPriceId: 'price_pro_monthly',
    yearlyPriceId: 'price_pro_yearly',
    features: [
      'Real-time demand pricing',
      'Advanced upsells',
      'Revenue dashboards',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    description: 'For large chains & venues',
    features: [
      'Custom pricing logic',
      'Dedicated account manager',
      'SSO & SLA',
      'Custom integrations',
    ],
  },
];

export default function BillingPage() {
  const { user } = useUser();
  const [yearly, setYearly] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  // Derived state
  const hasSubscription = subscription && (subscription.status === 'active' || subscription.status === 'trialing');

 // Temporarily comment out subscription loading
  // useEffect(() => {
  //   async function loadSubscription() {
  //     try {
  //       const res = await fetch('/api/stripe/subscription');
  //       const data = await res.json();
  //       
  //       if (data?.status === 'active' || data?.status === 'trialing') {
  //         setSubscription(data);
  //         setCurrentPlan(data.plan);
  //       } else {
  //         setSubscription(null);
  //         setCurrentPlan(null);
  //       }
  //     } catch (error) {
  //       console.error('Failed to load subscription:', error);
  //       setSubscription(null);
  //       setCurrentPlan(null);
  //     }
  //   }
  //   loadSubscription();
  // }, []);

  async function handleCheckout(priceId?: string) {
    if (!priceId) return;

    setLoading(priceId);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setLoading(null);
    }
  }

  return (
    <section className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-slate-900">Billing</h1>
          <p className="mt-2 text-slate-600">
            Manage your subscription and billing details
          </p>
        </div>

        {/* Manage subscription button */}
        {hasSubscription && (
          <div className="mt-6">
            <form action="/api/stripe/portal" method="POST">
              <button
                type="submit"
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100"
              >
                Manage subscription
              </button>
            </form>
          </div>
        )}

        {/* Toggle */}
        <div className="mt-8 flex items-center gap-3">
          <span className={!yearly ? 'font-medium text-slate-900' : 'text-slate-500'}>
            Monthly
          </span>
          <button
            onClick={() => setYearly(!yearly)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              yearly ? 'bg-slate-900' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                yearly ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={yearly ? 'font-medium text-slate-900' : 'text-slate-500'}>
            Yearly <span className="text-green-600">(Save 20%)</span>
          </span>
        </div>

        {/* Plans */}
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {PLANS.map((plan) => {
            const price = yearly ? plan.yearly : plan.monthly;
            const priceId = yearly ? plan.yearlyPriceId : plan.monthlyPriceId;
            const isCurrent = currentPlan === plan.name;

            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl border bg-white p-8 ${
                  isCurrent || plan.popular
                    ? 'border-slate-900 shadow-lg'
                    : 'border-slate-200'
                }`}
              >
                {plan.popular && !isCurrent && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                    Most Popular
                  </span>
                )}

                {isCurrent && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white">
                    Current Plan
                  </span>
                )}

                <h3 className="text-lg font-semibold text-slate-900">
                  {plan.name}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {plan.description}
                </p>

                <div className="mt-6">
                  {price ? (
                    <p className="text-4xl font-bold text-slate-900">
                      ${price}
                      <span className="text-base font-medium text-slate-600">
                        /mo
                      </span>
                    </p>
                  ) : (
                    <p className="text-2xl font-semibold text-slate-900">
                      Custom pricing
                    </p>
                  )}
                </div>

                <ul className="mt-6 space-y-2 text-sm text-slate-600">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-slate-900" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Trial status */}
                {subscription?.status === "trialing" && isCurrent && (
                  <div className="mt-4 rounded border border-blue-500 bg-blue-50 p-4">
                    <p className="font-medium text-blue-700">
                      You&apos;re on a {plan.name} trial 🎉
                    </p>
                    <p className="text-sm text-blue-600">
                      Trial ends on{" "}
                      {new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <button
                  disabled={isCurrent || !priceId || loading === priceId}
                  onClick={() => handleCheckout(priceId)}
                  className={`mt-8 w-full rounded-md px-4 py-2 text-sm font-medium transition ${
                    isCurrent
                      ? 'cursor-default bg-green-600 text-white'
                      : plan.popular
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'border border-slate-300 text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {loading === priceId
                    ? 'Loading...'
                    : isCurrent
                    ? 'Current Plan'
                    : plan.name === 'Enterprise'
                    ? 'Contact Sales'
                    : 'Upgrade'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}