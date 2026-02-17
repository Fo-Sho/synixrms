import { NextResponse } from 'next/server';
import { requireEntitlement, ForbiddenError, UnauthorizedError } from '@/libs/billing/requireEntitlement';

export async function POST() {
  try {
    await requireEntitlement('export_reports');

    // 🔒 Protected logic
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (err instanceof ForbiddenError) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    throw err;
  }
}
