import * as React from 'react';
import { Text, Hr } from '@react-email/components';
import { Layout } from '../../Layout';

interface CustomerPaymentReceiptProps {
  productName: string;
  amount: number;
  sellerBusinessName: string;
  transactionReference: string;
}

export function CustomerPaymentReceipt({
  productName,
  amount,
  sellerBusinessName,
  transactionReference,
}: CustomerPaymentReceiptProps) {
  return (
    <Layout previewText={`Receipt for your purchase of ${productName}`}>
      <Text style={heading}>Payment Receipt</Text>
      <Text style={paragraph}>
        Thank you for your purchase from <strong>{sellerBusinessName}</strong>! Your payment was successful.
      </Text>

      <div style={receiptBox}>
        <div style={receiptRow}>
          <span style={receiptLabel}>Product</span>
          <span style={receiptValue}>{productName}</span>
        </div>
        <Hr style={divider} />
        <div style={receiptRow}>
          <span style={receiptLabel}>Amount Paid</span>
          <span style={receiptValue}>₦{amount.toLocaleString()}</span>
        </div>
        <Hr style={divider} />
        <div style={receiptRow}>
          <span style={receiptLabel}>Seller</span>
          <span style={receiptValue}>{sellerBusinessName}</span>
        </div>
        <Hr style={divider} />
        <div style={receiptRow}>
          <span style={receiptLabel}>Transaction Ref</span>
          <span style={receiptValue}>{transactionReference}</span>
        </div>
      </div>

      <Text style={paragraph}>
        If you have any issues with your purchase, please contact the seller directly.
      </Text>
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
  wordBreak: 'break-all' as const,
};

const divider = {
  borderColor: '#E5E7EB',
  margin: '12px 0',
};
