import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyTransaction, verifyTransactionByRef } from '@/lib/flutterwave';
import { sendSellerPaymentReceived } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log('[DEBUG - /api/payments/verify] Received payload:', payload);

    const { tx_ref, transaction_id } = payload;

    if (!tx_ref) {
      console.log('[DEBUG - /api/payments/verify] Missing tx_ref in payload');
      return NextResponse.json({ success: false, error: 'Missing tx_ref' }, { status: 400 });
    }

    let result;
    if (transaction_id) {
      console.log(`[DEBUG - /api/payments/verify] Verifying by transaction_id: ${transaction_id}`);
      result = await verifyTransaction(String(transaction_id));
    } else {
      console.log(`[DEBUG - /api/payments/verify] Missing transaction_id. Verifying by tx_ref: ${tx_ref}`);
      result = await verifyTransactionByRef(String(tx_ref));
    }

    console.log('[DEBUG - /api/payments/verify] Flutterwave verification response:', result);

    if (result.status !== 'success') {
      console.log(`[DEBUG - /api/payments/verify] Flutterwave API error.`);
      return NextResponse.json({ success: false, error: 'API Error' });
    }

    if (result.data.status === 'pending') {
      console.log(`[DEBUG - /api/payments/verify] Transaction is still pending.`);
      return NextResponse.json({ success: true, status: 'PENDING' });
    }

    if (result.data.status === 'failed') {
      console.log(`[DEBUG - /api/payments/verify] Transaction failed.`);
      return NextResponse.json({ success: true, status: 'FAILED' });
    }

    if (result.data.status !== 'successful') {
      console.log(`[DEBUG - /api/payments/verify] Verification not successful. Status: ${result.data?.status}`);
      return NextResponse.json({ success: false, error: 'Transaction not successful' });
    }

    const paidAmount = result.data.amount;
    const currency = result.data.currency;

    const order = await db.order.findUnique({
      where: { transactionReference: tx_ref },
      include: {
        product: {
          include: { user: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' });
    }

    if (paidAmount < order.amount || currency !== 'NGN') {
      return NextResponse.json({ success: false, error: 'Amount or currency mismatch' });
    }

    if (order.status === 'PAID') {
      return NextResponse.json({ success: true, status: 'PAID' });
    }

    const existingPayment = await db.payment.findUnique({
      where: { orderId: order.id },
    });

    let paymentCreated = false;

    if (!existingPayment) {
      try {
        await db.$transaction([
          db.payment.create({
            data: {
              orderId: order.id,
              gatewayReference: String(result.data.id),
              status: 'paid',
              paidAt: new Date(),
            },
          }),
          db.order.update({
            where: { id: order.id },
            data: { status: 'PAID' as any },
          }),
        ]);
        paymentCreated = true;
      } catch (e: any) {
        if (e.code === 'P2002') {
          console.log('[DEBUG - /api/payments/verify] Payment already created by webhook race condition. Skipping email.');
        } else {
          throw e;
        }
      }
    }

    if (paymentCreated) {
      sendSellerPaymentReceived(
        order.product.user.email,
        order.product.user.name,
        order.product.name,
        order.amount,
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/orders`,
        order.buyerEmail
      );
    }

    return NextResponse.json({ success: true, status: 'PAID' });
  } catch (error) {
    console.error('payment.verify.failed', { error });
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 });
  }
}
