import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST() {
  try {
    // Simple auth check instead of requireEntitlement
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Your export logic here
    return NextResponse.json({ message: "Export successful", userId });
    
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}