import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createPaymentLink } from '@/lib/flutterwave';
import { randomBytes } from 'crypto';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Rate limit checkout attempts by IP to prevent card testing
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const rl = await rateLimit(`checkout_${ip}`, 10, 60000); // 10 checkouts per minute per IP
    if (!rl.success) {
      return NextResponse.redirect(new URL(`/p/${slug}?error=rate_limit`, req.url));
    }

    const product = await db.product.findUnique({
      where: { uniqueSlug: slug },
      include: { user: true },
    });

    if (!product) {
      return NextResponse.redirect(new URL(`/p/${slug}?error=product_not_found`, req.url));
    }

    const tx_ref = `sellsnap_order_${randomBytes(6).toString('hex')}`;

    // Create a pending order
    const order = await db.order.create({
      data: {
        productId: product.id,
        amount: product.price,
        transactionReference: tx_ref,
        status: 'PENDING',
      },
    });

    const paymentLink = await createPaymentLink({
      tx_ref,
      amount: product.price,
      currency: 'NGN',
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/p/${slug}/success`,
      customer: {
        email: 'customer@sellsnap.app', // Placeholder, we can collect this later if needed
        name: 'SellSnap Customer',
      },
      customizations: {
        title: product.user.businessName || product.user.name,
        description: product.name,
      },
    });

    return NextResponse.redirect(paymentLink);
  } catch (error) {
    console.error('payment.init.failed', { error });
    // Safe fallback URL - attempt to extract slug if available
    let fallbackUrl = '/';
    try {
      const { searchParams } = new URL(req.url);
      const slug = searchParams.get('slug');
      if (slug) fallbackUrl = `/p/${slug}?error=payment_init_failed`;
    } catch (e) {
      // Ignore
    }
    return NextResponse.redirect(new URL(fallbackUrl, req.url));
  }
}
