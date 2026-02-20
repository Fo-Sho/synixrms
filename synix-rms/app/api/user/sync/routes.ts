import { NextResponse } from 'next/server';
import { getActiveSubscription } from '@/libs/subscriptions';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    // Verify request is from hotel backend
    const authHeader = req.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.SSO_SHARED_SECRET}`;
    
    if (authHeader !== expectedAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { clerkUserId } = await req.json();
    
    // Get current subscription status
    const subscription = await getActiveSubscription(clerkUserId);
    
    return NextResponse.json({
      clerkUserId,
      planName: subscription?.planName || 'free',
      subscriptionStatus: subscription?.status || 'none',
      subscriptionId: subscription?.stripeSubscriptionId,
      isActive: Boolean(subscription && subscription.status === 'active')
    });
    
  } catch (error) {
    console.error('User sync error:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}