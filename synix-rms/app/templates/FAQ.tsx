'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const faqs = [
  {
    q: 'What is Synix RMS?',
    a: 'Synix RMS is a real-time revenue management system that helps hotels and venues optimize pricing and upsells using live demand data.'
  },
  {
    q: 'Can Synix RMS integrate with my existing systems?',
    a: 'Yes. Synix RMS supports popular PMS platforms and offers custom integrations for enterprise customers.'
  },
  {
    q: 'Is there a free trial available?',
    a: 'We offer guided demos so you can see the platform in action before committing.'
  },
  {
    q: 'How long does onboarding take?',
    a: 'Most customers are fully onboarded within a few days depending on integrations.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-white py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-center text-3xl font-semibold text-slate-900">
          Frequently Asked Questions
        </h2>

        <div className="mt-12 divide-y divide-slate-200">
          {faqs.map((faq, index) => {
            const open = openIndex === index;

            return (
              <div key={faq.q} className="py-6">
                <button
                  onClick={() =>
                    setOpenIndex(open ? null : index)
                  }
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="text-lg font-medium text-slate-900">
                    {faq.q}
                  </span>
                  <ChevronDownIcon
                    className={`h-5 w-5 text-slate-500 transition-transform ${
                      open ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {open && (
                  <p className="mt-4 text-slate-600">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
