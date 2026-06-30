import * as React from 'react';
import { Text, Hr } from '@react-email/components';
import { Layout } from '../../Layout';
import { EmailButton } from '../../EmailButton';

interface SellerPaymentReceivedProps {
  sellerName: string;
  productName: string;
  amount: number;
  buyerEmail?: string | null;
  dashboardUrl: string;
}

export function SellerPaymentReceived({
  sellerName,
  productName,
  amount,
  buyerEmail,
  dashboardUrl,
}: SellerPaymentReceivedProps) {
  return (
    <Layout previewText={`You made a sale! ₦${amount.toLocaleString()} for ${productName}`}>
      <Text style={heading}>You made a sale! 🎉</Text>
      <Text style={paragraph}>
        Hi {sellerName},
      </Text>
      <Text style={paragraph}>
        Great news! You just received a payment for <strong>{productName}</strong>.
      </Text>

      <div style={receiptBox}>
        <div style={receiptRow}>
          <span style={receiptLabel}>Product</span>
          <span style={receiptValue}>{productName}</span>
        </div>
        <Hr style={divider} />
        <div style={receiptRow}>
          <span style={receiptLabel}>Amount</span>
          <span style={receiptValue}>₦{amount.toLocaleString()}</span>
        </div>
        {buyerEmail && (
          <>
            <Hr style={divider} />
            <div style={receiptRow}>
              <span style={receiptLabel}>Buyer Email</span>
              <span style={receiptValue}>{buyerEmail}</span>
            </div>
          </>
        )}
      </div>

      <EmailButton href={dashboardUrl}>
        View in Dashboard
      </EmailButton>
    </Layout>
  );
}

const heading = {
  fontSize: '24px',
  fontWeight: 700,
  margin: '0 0 20px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 16px',
};

const receiptBox = {
  backgroundColor: '#F9FAFB',
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
  padding: '16px 24px',
  margin: '24px 0',
};

const receiptRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
};

const receiptLabel = {
  fontSize: '14px',
  color: '#5A6270',
  display: 'inline-block',
  width: '40%',
};

const receiptValue = {
  fontSize: '14px',
  fontWeight: 600,
  color: '#0F1115',
  display: 'inline-block',
  width: '55%',
  textAlign: 'right' as const,
};

const divider = {
  borderColor: '#E5E7EB',
  margin: '12px 0',
};
