import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const txRef = searchParams.get('tx_ref');

  if (!txRef) {
    return NextResponse.json({ error: 'Missing tx_ref' }, { status: 400 });
  }

  const order = await db.order.findUnique({
    where: { transactionReference: txRef },
    select: { status: true },
  });

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({ status: order.status });
}
