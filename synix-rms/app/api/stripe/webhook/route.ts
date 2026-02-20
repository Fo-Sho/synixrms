import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/libs/prisma";
import { getPlanFromPriceId } from "@/libs/plans";
import { stripe } from "@/libs/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log('Webhook event received:', event.type);

    switch (event.type) {
case "checkout.session.completed": {
  const session = event.data.object as Stripe.Checkout.Session;
  console.log('Processing checkout session:', session.id);
  
  // Get the subscription details
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  );
  
  const clerkUserId = session.metadata?.clerkUserId;
  const customerEmail = session.customer_email || session.customer_details?.email || 'placeholder@example.com';
  
  if (!clerkUserId) {
    console.error('No Clerk user ID in session metadata');
    break;
  }

  console.log('Creating user with email:', customerEmail);

  // Create or find user
  const user = await prisma.user.upsert({
    where: { clerkUserId },
    update: { 
      email: customerEmail
    },
    create: {
      clerkUserId,
      email: customerEmail
    }
  });

  // Simple fix: Use default date (30 days from now)
  const defaultEndDate = new Date();
  defaultEndDate.setDate(defaultEndDate.getDate() + 30);

  // Fix: Use upsert instead of create to handle existing subscriptions
  // With this:
await prisma.subscription.upsert({
  where: { userId: user.id },
  update: {
    stripeCustomerId: subscription.customer as string,
    stripeSubscriptionId: subscription.id,
    stripePriceId: subscription.items.data[0].price.id,
    planName: getPlanFromPriceId(subscription.items.data[0].price.id),
    status: subscription.status,
    currentPeriodEnd: defaultEndDate
  },
  create: {
    userId: user.id,
    stripeCustomerId: subscription.customer as string,
    stripeSubscriptionId: subscription.id,
    stripePriceId: subscription.items.data[0].price.id,
    planName: getPlanFromPriceId(subscription.items.data[0].price.id),
    status: subscription.status,
    currentPeriodEnd: defaultEndDate
  }
});

  console.log('Subscription upserted successfully for user:', clerkUserId);
  break;
}

// Notify hotel backend of subscription change
try {
  await fetch(`${process.env.HOTEL_BACKEND_URL}/api/sync-user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ clerkUserId })
  });
} catch (error) {
  console.error('Failed to sync with hotel backend:', error);
}


      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        // Handle successful subscription renewals
        console.log('Payment succeeded for subscription:', invoice.subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        // Handle subscription cancellation
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { status: 'canceled' }
        });
        break;
      }
    }

    return new NextResponse("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new NextResponse("Webhook error", { 
      status: 500 
    });
  }
}