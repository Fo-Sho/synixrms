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

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // Your webhook logic here
        break;
      }
    }

    return new NextResponse("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new NextResponse("Webhook signature verification failed", { 
      status: 400 
    });
  }
}