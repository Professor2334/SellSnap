import { env } from '@/lib/env';

export async function createPaymentLink(payload: {
  tx_ref: string;
  amount: number;
  currency: string;
  redirect_url: string;
  customer: {
    email: string;
    name: string;
  };
  customizations: {
    title: string;
    description: string;
  };
}) {
  const response = await fetch('https://api.flutterwave.com/v3/payments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.FLW_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (data.status !== 'success') {
    throw new Error(data.message || 'Flutterwave payment initialization failed');
  }

  return data.data.link;
}

export async function verifyTransaction(transactionId: string) {
  const response = await fetch(
    `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
    {
      headers: {
        Authorization: `Bearer ${env.FLW_SECRET_KEY}`,
      },
    }
  );

  const data = await response.json();
  return data;
}
