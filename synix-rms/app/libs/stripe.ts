import Stripe from 'stripe';

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!,
  {
    apiVersion: '2026-01-28.clover', // Keep your newer version
    typescript: true, // Optional: better TypeScript support
  }
);
