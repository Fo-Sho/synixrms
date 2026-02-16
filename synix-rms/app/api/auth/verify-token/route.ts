import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }

    // Verify the JWT token
    const payload = verify(token, process.env.SSO_JWT_SECRET!) as any;
    
    return NextResponse.json({
      valid: true,
      userId: payload.userId,
      subscriptionStatus: payload.subscriptionStatus,
      plan: payload.plan,
      exp: payload.exp
    });

  } catch (error) {
    console.error('Token verification failed:', error);
    return NextResponse.json(
      { valid: false, error: 'Invalid token' }, 
      { status: 401 }
    );
  }
}