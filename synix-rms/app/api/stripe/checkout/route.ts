import { NextResponse } from 'next/server';
import { stripe } from '@/libs/stripe';
import { auth, currentUser } from '@clerk/nextjs/server';

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
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user details including email
    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      return NextResponse.json(
        { error: 'No email found for user' },
        { status: 400 }
      );
    }

    // 3️⃣ Create Stripe customer
    const customer = await stripe.customers.create({
      email,
      metadata: { clerkUserId: userId },
    });

    // 4️⃣ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customer.id,
      metadata: {
        clerkUserId: userId,
      },
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get('origin')}/dashboard/billing?success=true`,
      cancel_url: `${req.headers.get('origin')}/dashboard/billing?canceled=true`,
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