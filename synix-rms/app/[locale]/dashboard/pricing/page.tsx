import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const PRICING_TIERS = [
  {
    name: 'Starter',
    price: 169,
    yearlyPrice: 1908,
    description: 'Perfect for small hotels getting started',
    features: [
      'Dynamic pricing rules',
      'Basic analytics dashboard',
      'Email support',
      'Up to 50 rooms',
      'Standard integrations',
    ],
    isPopular: false,
  },
  {
    name: 'Pro',
    price: 199,
    yearlyPrice: 2028,
    description: 'Best for growing hotel groups',
    features: [
      'Real-time demand pricing',
      'Advanced upsells & cross-sells',
      'Comprehensive revenue dashboards',
      'Priority support',
      'Up to 500 rooms',
      'Advanced integrations',
      'Custom reporting',
    ],
    isPopular: true,
  },
  {
    name: 'Enterprise',
    price: null,
    yearlyPrice: null,
    description: 'For large chains & venues',
    features: [
      'Custom pricing logic',
      'Dedicated account manager',
      'SSO & SLA agreements',
      'Custom integrations',
      'Unlimited rooms',
      'White-label options',
      'Advanced security',
      'Custom training',
    ],
    isPopular: false,
  },
];

export default async function PricingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Pricing Plans</h1>
        <p className="mt-2 text-lg text-gray-600">
          Choose the perfect plan for your hotel revenue management needs
        </p>
      </div>

      {/* Pricing Toggle */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-lg">
          <div className="grid grid-cols-2 gap-1">
            <button className="px-4 py-2 text-sm font-medium bg-white text-gray-900 rounded-md shadow-sm">
              Monthly
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900">
              Yearly (Save 20%)
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PRICING_TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`relative bg-white rounded-xl shadow-sm border p-8 ${
              tier.isPopular
                ? 'border-blue-500 ring-1 ring-blue-500'
                : 'border-gray-200'
            }`}
          >
            {tier.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 text-sm font-medium rounded-full">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900">{tier.name}</h3>
              <p className="mt-2 text-sm text-gray-500">{tier.description}</p>
              
              <div className="mt-6">
                {tier.price ? (
                  <div>
                    <span className="text-4xl font-bold text-gray-900">
                      ${tier.price}
                    </span>
                    <span className="text-gray-500">/month</span>
                  </div>
                ) : (
                  <div className="text-2xl font-semibold text-gray-900">
                    Custom pricing
                  </div>
                )}
              </div>
            </div>

            <ul className="mt-8 space-y-3">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="ml-3 text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <button
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  tier.isPopular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {tier.price ? 'Get Started' : 'Contact Sales'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 rounded-xl p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Frequently Asked Questions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900">Can I change plans anytime?</h4>
            <p className="mt-1 text-sm text-gray-600">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Is there a free trial?</h4>
            <p className="mt-1 text-sm text-gray-600">
              Yes, we offer a 14-day free trial with access to all Pro features.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">What payment methods do you accept?</h4>
            <p className="mt-1 text-sm text-gray-600">
              We accept all major credit cards and can arrange ACH/wire transfers for Enterprise clients.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Do you offer discounts for annual plans?</h4>
            <p className="mt-1 text-sm text-gray-600">
              Yes, annual plans include a 20% discount compared to monthly pricing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}