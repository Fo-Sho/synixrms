import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Real-Time, Dynamic Pricing for Modern Hospitality
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          Synix RMS helps hotels and event venues optimize revenue using
          intelligent pricing, real-time demand signals, and automated upsells.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/demo"
            className="rounded-md bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800"
          >
            Request a Demo
          </Link>

          <Link
            href="/pricing"
            className="rounded-md border border-slate-300 px-6 py-3 text-sm font-medium text-slate-900 hover:bg-slate-100"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
