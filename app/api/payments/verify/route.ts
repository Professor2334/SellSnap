import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyTransaction } from '@/lib/flutterwave';
import { sendSellerPaymentReceived } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { tx_ref, transaction_id } = await req.json();

    if (!tx_ref || !transaction_id) {
      return NextResponse.json({ success: false, error: 'Missing params' }, { status: 400 });
    }

    const result = await verifyTransaction(String(transaction_id));

    if (result.status !== 'success' || result.data.status !== 'successful') {
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

    if (!existingPayment) {
      await db.$transaction(async (tx) => {
        await tx.payment.create({
          data: {
            orderId: order.id,
            gatewayReference: String(result.data.id),
            status: 'paid',
            paidAt: new Date(),
          },
        });
        await tx.order.update({
          where: { id: order.id },
          data: { status: 'PAID' as any },
        });
      });
    }

    sendSellerPaymentReceived(
      order.product.user.email,
      order.product.user.name,
      order.product.name,
      order.amount,
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/orders`,
      order.buyerEmail
    );

    return NextResponse.json({ success: true, status: 'PAID' });
  } catch (error) {
    console.error('payment.verify.failed', { error });
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 });
  }
}
