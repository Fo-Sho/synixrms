import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/libs/prisma';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ plan: null }, { status: 401 });
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) {
    return NextResponse.json({ plan: null });
  }

  return NextResponse.json({
    plan: subscription.planName, // "Starter" | "Pro"
    status: subscription.status,
    currentPeriodEnd: subscription.currentPeriodEnd,
  });
}