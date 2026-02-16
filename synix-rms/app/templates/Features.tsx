import {
  ChartBarIcon,
  BoltIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Dynamic Upsell Optimization',
    description:
      'Automatically adjust offers based on guest behavior and demand.',
    icon: ArrowTrendingUpIcon
  },
  {
    name: 'Real-Time Pricing Engine',
    description:
      'Prices update instantly using live market and occupancy data.',
    icon: BoltIcon
  },
  {
    name: 'Revenue Analytics',
    description:
      'Clear dashboards to track performance and conversion rates.',
    icon: ChartBarIcon
  }
];

export default function Features() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-slate-900">
            Built to Maximize Revenue
          </h2>
          <p className="mt-4 text-slate-600">
            Everything you need to price smarter and sell better.
          </p>
        </div>

        <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.name} className="text-center">
              <feature.icon
                className="mx-auto h-5 w-5 text-slate-900"
                aria-hidden
              />
              <h3 className="mt-6 text-lg font-medium text-slate-900">
                {feature.name}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
