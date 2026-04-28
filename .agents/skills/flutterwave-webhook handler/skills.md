/**
 * Reference implementation of the Flutterwave webhook handler for SellSnap.
 *
 * Drop this at: app/api/payments/webhook/route.ts
 *
 * This file is a reference. Adapt field names to match the current Prisma
 * schema before committing. The logic and the order of checks must be
 * preserved exactly.
 *
 * The handler does five things, in order:
 *   1. Verify the webhook signature header.
 *   2. Parse the payload.
 *   3. Independently verify the transaction by calling Flutterwave.
 *   4. Confirm the verified data matches our stored order.
 *   5. Update the order and create a payment record, idempotently.
 */

import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';

const FLW_VERIFY_URL = (id: string) =>
  `https://api.flutterwave.com/v3/transactions/${id}/verify`;

type FlutterwaveWebhookPayload = {
  event: string;
  data: {
    id: number;
    tx_ref: string;
    status: string;
    amount: number;
    currency: string;
    customer?: { email?: string };
    meta?: Record<string, string>;
  };
};

type FlutterwaveVerifyResponse = {
  status: string;
  message: string;
  data: {
    id: number;
    tx_ref: string;
    status: string;
    amount: number;
    currency: string;
  };
};

export async function POST(req: NextRequest) {
  // 1. Signature verification. Reject anything that does not match.
  const signature = req.headers.get('verif-hash');
  if (!signature || signature !== process.env.FLW_WEBHOOK_HASH) {
    console.warn('flutterwave.webhook.bad_signature');
    return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 });
  }

  // 2. Parse. If the body is malformed, something is very wrong. Log and 400.
  let payload: FlutterwaveWebhookPayload;
  try {
    payload = (await req.json()) as FlutterwaveWebhookPayload;
  } catch (error) {
    console.error('flutterwave.webhook.parse_failed', { error });
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }

  const { data } = payload;
  if (!data?.id || !data.tx_ref) {
    console.warn('flutterwave.webhook.missing_fields', { payload });
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // 3. Independently verify with Flutterwave. We do not trust the webhook
  //    body even after signature verification, because a leaked secret hash
  //    would otherwise be a catastrophic single point of failure.
  let verified: FlutterwaveVerifyResponse;
  try {
    const res = await fetch(FLW_VERIFY_URL(String(data.id)), {
      headers: { Authorization: `Bearer ${process.env.FLW_SECRET_KEY}` },
    });
    verified = (await res.json()) as FlutterwaveVerifyResponse;
  } catch (error) {
    console.error('flutterwave.webhook.verify_failed', { error, id: data.id });
    // Return 500 so Flutterwave retries. This is a transient issue on our end.
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 });
  }

  if (verified.status !== 'success' || verified.data.status !== 'successful') {
    console.info('flutterwave.webhook.not_successful', {
      id: data.id,
      status: verified.data?.status,
    });
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // 4. Find our order and cross-check every field that matters.
  const order = await db.order.findUnique({
    where: { transactionReference: verified.data.tx_ref },
  });

  if (!order) {
    console.warn('flutterwave.webhook.order_not_found', {
      tx_ref: verified.data.tx_ref,
    });
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // Amounts: Flutterwave returns the major unit (naira) as Float.
  // Our DB stores amount as Float (Naira) per AGENTS.md schema.
  if (
    verified.data.amount !== order.amount ||
    verified.data.currency !== 'NGN'
  ) {
    console.warn('flutterwave.webhook.amount_or_currency_mismatch', {
      orderId: order.id,
      expected: { amount: order.amount, currency: 'NGN' },
      actual: { amount: verified.data.amount, currency: verified.data.currency },
    });
    // Respond 200 so Flutterwave stops retrying; this is a problem for a human.
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // 5. Persist. Idempotency comes from the unique constraint on
  //    Payment.gatewayReference. If a duplicate webhook lands, the insert
  //    throws P2002 and we respond 200 without reprocessing.
  try {
    await db.$transaction(async (tx) => {
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
        data: { status: 'PAID' },
      });
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      console.info('flutterwave.webhook.duplicate_ignored', {
        id: verified.data.id,
      });
      return NextResponse.json({ success: true }, { status: 200 });
    }
    console.error('flutterwave.webhook.persist_failed', { error });
    return NextResponse.json({ success: false, error: 'Persistence failed' }, { status: 500 });
  }

  // Notifications (email, dashboard push) should be queued as a background
  // job, not awaited here. A slow email provider must not slow down the
  // webhook response. Example:
  //
  //   await jobs.enqueue('notify.order-paid', { orderId: order.id });

  return NextResponse.json({ success: true }, { status: 200 });
}
