import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getActiveSubscription } from '@/libs/subscriptions';
import crypto from 'crypto';

export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user subscription
    const subscription = await getActiveSubscription(userId);
    const planName = subscription?.planName || 'free';

    // Create SSO payload
    const ssoPayload = {
      clerkUserId: userId,
      planName: planName,
      subscriptionId: subscription?.stripeSubscriptionId,
      subscriptionStatus: subscription?.status || 'none',
      email: 'user@example.com', // You might want to get actual email
      timestamp: Date.now(),
      expiresAt: Date.now() + (15 * 60 * 1000) // 15 minutes
    };

    // Create signed token
    const payloadString = JSON.stringify(ssoPayload);
    const signature = crypto
      .createHmac('sha256', process.env.SSO_SHARED_SECRET!)
      .update(payloadString)
      .digest('hex');

    const token = Buffer.from(`${payloadString}.${signature}`).toString('base64');
    
    return NextResponse.json({ 
      token,
      hotelBackendUrl: process.env.HOTEL_BACKEND_URL 
    });
    
  } catch (error) {
    console.error('SSO token error:', error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
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