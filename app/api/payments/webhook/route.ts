import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import { env } from '@/lib/env';
import { verifyTransaction } from '@/lib/flutterwave';

export async function POST(req: NextRequest) {
  // 1. Signature verification
  const signature = req.headers.get('verif-hash');
  if (!signature || signature !== env.FLW_WEBHOOK_HASH) {
    console.warn('flutterwave.webhook.bad_signature');
    return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 });
  }

  // 2. Parse payload
  let payload: any;
  try {
    payload = await req.json();
  } catch (error) {
    console.error('flutterwave.webhook.parse_failed', { error });
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }

  const { data } = payload;
  if (!data?.id || !data.tx_ref) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // 3. Independently verify with Flutterwave
  let verified: any;
  try {
    verified = await verifyTransaction(String(data.id));
  } catch (error) {
    console.error('flutterwave.webhook.verify_failed', { error, id: data.id });
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 });
  }

  if (verified.status !== 'success' || verified.data.status !== 'successful') {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // 4. Find order and cross-check
  const order = await db.order.findUnique({
    where: { transactionReference: verified.data.tx_ref },
  });

  if (!order) {
    console.warn('flutterwave.webhook.order_not_found', { tx_ref: verified.data.tx_ref });
    return NextResponse.json({ success: true }, { status: 200 });
  }

  if (verified.data.amount !== order.amount || verified.data.currency !== 'NGN') {
    console.warn('flutterwave.webhook.mismatch', { orderId: order.id });
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // 5. Persist idempotently
  try {
    await db.$transaction(async (tx) => {
      // Check if payment already exists
      const existingPayment = await tx.payment.findUnique({
        where: { orderId: order.id },
      });

      if (existingPayment) return;

      await tx.payment.create({
        data: {
          orderId: order.id,
          gatewayReference: String(verified.data.id),
          status: 'paid',
          paidAt: new Date(),
        },
      });

       await tx.order.update({
         where: { id: order.id },
         data: { status: 'PAID' as any },
       });
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ success: true }, { status: 200 });
    }
    console.error('flutterwave.webhook.persist_failed', { error });
    return NextResponse.json({ success: false, error: 'Persistence failed' }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
