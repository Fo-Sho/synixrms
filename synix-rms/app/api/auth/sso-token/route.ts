import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { getActiveSubscription } from '@/libs/subscriptions';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user subscription info
    const subscription = await getActiveSubscription(userId);
    
    // Create JWT payload with user info and subscription status
    const payload = {
      userId,
      subscriptionStatus: subscription?.status || 'free',
      plan: subscription?.stripePriceId ? getPlanFromPriceId(subscription.stripePriceId) : 'free',
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiry
      iat: Math.floor(Date.now() / 1000),
    };

    // Sign the token with your secret
    const token = sign(payload, process.env.SSO_JWT_SECRET!);

    return NextResponse.json({ 
      token,
      redirectUrl: process.env.PYTHON_APP_URL || 'http://localhost:8000'
    });

  } catch (error) {
    console.error('SSO token generation failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

function getPlanFromPriceId(priceId: string): string {
  const priceToPlans: Record<string, string> = {
    price_starter_monthly: 'starter',
    price_starter_yearly: 'starter',
    price_pro_monthly: 'pro',
    price_pro_yearly: 'pro',
  };
  
  return priceToPlans[priceId] || 'free';
}