import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getUserPlan } from '@/libs/subscriptions';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ plan: 'free' }, { status: 401 });
    }

    const plan = await getUserPlan(userId);
    
    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Error getting user plan:', error);
    return NextResponse.json({ plan: 'free' }, { status: 500 });
  }
}