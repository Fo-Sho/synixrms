import Link from 'next/link';

export default function CTA() {
  return (
    <section className="bg-slate-900 py-24">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          Ready to Maximize Your Revenue?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
          Join hospitality teams using Synix RMS to optimize pricing,
          increase conversions, and unlock new revenue streams.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/demo"
            className="rounded-md bg-white px-6 py-3 text-sm font-medium text-slate-900 hover:bg-slate-100"
          >
            Request a Demo
          </Link>

          <Link
            href="/pricing"
            className="rounded-md border border-white/20 px-6 py-3 text-sm font-medium text-white hover:bg-white/10"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}

