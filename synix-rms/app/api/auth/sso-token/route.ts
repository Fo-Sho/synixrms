import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getActiveSubscription } from '@/libs/subscriptions';
import crypto from 'crypto';

export async function POST() {
  try {
    const { userId, sessionId } = auth();

    if (!userId || !sessionId) {
      return NextResponse.json(
        { error: 'Session expired. Please re-authenticate.' },
        { status: 401 }
      );
    }

    // Fetch user
    const user = await clerkClient.users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress;

    // Subscription
    const subscription = await getActiveSubscription(userId);

    const ssoPayload = {
      clerkUserId: userId,
      email,
      planName: subscription?.planName ?? 'free',
      subscriptionId: subscription?.stripeSubscriptionId ?? null,
      subscriptionStatus: subscription?.status ?? 'none',
      timestamp: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000
    };

    const payloadString = JSON.stringify(ssoPayload);
    const signature = crypto
      .createHmac('sha256', process.env.SSO_SHARED_SECRET!)
      .update(payloadString)
      .digest('hex');

    const token = Buffer
      .from(`${payloadString}.${signature}`)
      .toString('base64');

    return NextResponse.json({
      token,
      hotelBackendUrl: process.env.HOTEL_BACKEND_URL
    });

  } catch (err) {
    console.error('SSO token error:', err);
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    );
  }
}
function getPlanFromPriceId(priceId: string): string {
  const priceToPlans: Record<string, string> = {
    'price_1Sv1VKCVMysKg9P0ZOos2DCx': 'starter',
    'price_starter_yearly': 'starter',
    'price_1Sv23VCVMysKg9P0neTxuCjU': 'pro',
    'price_pro_yearly': 'pro',
  };
  
  return priceToPlans[priceId] || 'free';
}