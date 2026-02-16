import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/libs/prisma";
import { getPlanFromPriceId } from "@/libs/plans";
import { stripe } from "@/libs/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const clerkUserId = session.metadata?.clerkUserId;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (!clerkUserId || !subscriptionId) {
          console.error("Missing clerkUserId or subscriptionId", { clerkUserId, subscriptionId });
          throw new Error("Missing clerkUserId or subscriptionId");
        }

        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId,
          { expand: ["items.data.price"] }
        );

        const priceId = subscription.items.data[0].price.id;
        const plan = getPlanFromPriceId(priceId);

        // First, find or create the User record
        const user = await prisma.user.upsert({
          where: { clerkUserId },
          update: {},
          create: {
            clerkUserId,
            email: session.customer_details?.email || 'unknown@email.com',
          },
        });

        // Then create/update the subscription
        await prisma.subscription.upsert({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          update: {
            stripeCustomerId: customerId,
            priceId: priceId,
            plan,
            status: subscription.status,
            currentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          },
          create: {
            userId: user.id,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscription.id,
            priceId: priceId,
            plan,
            status: subscription.status,
            currentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          },
        });

        console.log(`Subscription created/updated for user ${clerkUserId}, plan: ${plan}`);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        const priceId = subscription.items.data[0].price.id;
        const plan = getPlanFromPriceId(priceId);

        await prisma.subscription.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            priceId: priceId, // Fixed: changed from stripePriceId
            plan,
            status: subscription.status,
            currentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          },
        });

        console.log(`Subscription updated: ${subscription.id}, plan: ${plan}, status: ${subscription.status}`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.subscription.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            status: "canceled",
          },
        });

        console.log(`Subscription canceled: ${subscription.id}`);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        
        if (invoice.subscription && invoice.billing_reason === "subscription_cycle") {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          );

          await prisma.subscription.update({
            where: {
              stripeSubscriptionId: subscription.id,
            },
            data: {
              currentPeriodEnd: new Date(
                subscription.current_period_end * 1000
              ),
            },
          });

          console.log(`Subscription renewed: ${subscription.id}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}