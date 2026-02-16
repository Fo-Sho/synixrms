import '@/styles/global.css';

import type { Metadata } from 'next';
import { getMessages } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';

import Providers from './providers';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { AllLocales } from '@/utils/AppConfig';

export const metadata: Metadata = {
  title: {
    default: 'Synix RMS – Revenue Management for Hospitality',
    template: '%s | Synix RMS',
  },
  description:
    'Synix RMS is a real-time revenue management system helping hotels and venues optimize pricing and maximize revenue.',
  openGraph: {
    title: 'Synix RMS',
    description:
      'Optimize pricing and revenue with real-time demand intelligence.',
    url: 'https://synix.io',
    siteName: 'Synix RMS',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Synix RMS',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
};

// Generate static params for all locales
export function generateStaticParams() {
  return AllLocales.map((locale) => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const { locale } = params;

  // Set locale for next-intl
  setRequestLocale(locale);

  // Load messages server-side
  const messages = await getMessages();

  // ✅ Make sure <html> and <body> are directly returned
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased" suppressHydrationWarning>
        {/* Providers wraps everything inside body */}
        <Providers locale={locale} messages={messages}>
          {props.children}
          <DemoBadge />
        </Providers>
      </body>
    </html>
  );
}