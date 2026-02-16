import { stripe } from './stripe';
import { createClerkClient } from '@clerk/nextjs/server';

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

export async function getOrCreateStripeCustomer({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) {
  try {
    const user = await clerkClient.users.getUser(userId);

    const existingCustomerId =
      user.publicMetadata?.stripeCustomerId as string | undefined;

    // ✅ Already linked
    if (existingCustomerId) {
      return existingCustomerId;
    }

    // 🔥 Create new Stripe customer
    const customer = await stripe.customers.create({
      email,
      metadata: {
        userId,
      },
    });

    // 🔥 Link to Clerk user
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        stripeCustomerId: customer.id,
      },
    });

    return customer.id;
  } catch (error) {
    console.error('Error in getOrCreateStripeCustomer:', error);
    throw error;
  }
}