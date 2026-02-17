import { NextResponse } from 'next/server';
import { stripe } from '@/libs/stripe';
import { getAuth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    // 1️⃣ Parse request body
    const { priceId } = await req.json();
    if (!priceId) {
      return NextResponse.json(
        { error: 'Missing priceId' },
        { status: 400 }
      );
    }

    // 2️⃣ Get current user from Clerk
    const auth = getAuth(req);
    if (!auth.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const email = auth.user?.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      return NextResponse.json(
        { error: 'No email found for user' },
        { status: 400 }
      );
    }

    // 3️⃣ Check if user already has a Stripe customer ID stored in metadata
    //    (Optional: if you store ClerkUserId -> Stripe Customer mapping in your DB)
    //    For simplicity, we create a new customer each time
    const customer = await stripe.customers.create({
      email,
      metadata: { clerkUserId: auth.userId },
    });

    // 4️⃣ Create Stripe Checkout Session
    // In checkout route, update the session creation:
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  payment_method_types: ['card'],
  customer: customer.id,
  metadata: {
    clerkUserId: auth.userId, // Make sure this matches what webhook expects
  },
  line_items: [
    {
      price: priceId,
      quantity: 1,
    },
  ],
  // ... rest of your session config
});
    return NextResponse.json({ url: session.url });
    } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}