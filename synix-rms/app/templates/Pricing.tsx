'use client';

import { useState } from 'react';

const plans = [
  {
    name: 'Starter',
    description: 'For small hotels getting started',
    monthly: 169,
    yearly: 1908, // yearly billed once
    priceIdMonthly: 'price_1Sv1VKCVMysKg9P0ZOos2DCx',
    priceIdYearly: 'price_1Sv1g3CVMysKg9P0hN5wy4kj',
    features: [
      'Dynamic pricing rules',
      'Basic analytics',
      'Email support',
    ],
  },
  {
    name: 'Pro',
    description: 'For growing hotel groups',
    monthly: 199,
    yearly: 2028, // yearly billed once
    priceIdMonthly: 'price_1Sv23VCVMysKg9P0neTxuCjU',
    priceIdYearly: 'price_1Sv26XCVMysKg9P0Jmz2GNs9',
    popular: true,
    features: [
      'Real-time demand pricing',
      'Advanced upsells',
      'Revenue dashboards',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    description: 'For large chains & events',
    features: [
      'Custom pricing logic',
      'Dedicated account manager',
      'SLA & SSO',
      'Custom integrations',
    ],
  },
];

async function redirectToCheckout(priceId: string) {
  const res = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId }),
  });

  const data = await res.json();

  if (data.url) {
    window.location.href = data.url;
  }
}

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-slate-600">
            Choose a plan that fits your business size and growth stage.
          </p>

          {/* Toggle */}
          <div className="mt-8 flex items-center justify-center gap-3">
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
              Yearly <span className="text-sm text-green-600">(Save 20%)</span>
            </span>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => {
            const price = yearly ? plan.yearly : plan.monthly;

            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 ${
                  plan.popular
                    ? 'border-slate-900 bg-white shadow-lg'
                    : 'border-slate-200 bg-white'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                    Most Popular
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
                        {yearly ? '/yr' : '/mo'}
                      </span>
                    </p>
                  ) : (
                    <p className="text-2xl font-semibold text-slate-900">
                      Custom pricing
                    </p>
                  )}
                </div>

                <ul className="mt-8 space-y-3 text-sm text-slate-600">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-slate-900" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {plan.name === 'Enterprise' ? (
                  <button className="mt-8 w-full rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100">
                    Contact Sales
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const priceId = yearly ? plan.priceIdYearly : plan.priceIdMonthly;
                      if (priceId) {
                        redirectToCheckout(priceId);
                      }
                    }}
                    className={`mt-8 w-full rounded-md px-4 py-2 text-sm font-medium ${
                      plan.popular
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'border border-slate-300 text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Get Started
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
