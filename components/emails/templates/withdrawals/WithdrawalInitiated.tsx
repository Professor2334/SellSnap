import * as React from 'react';
import { Text, Hr } from '@react-email/components';
import { Layout } from '../../Layout';

interface WithdrawalInitiatedProps {
  name: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  expectedDate: string;
}

export function WithdrawalInitiated({
  name,
  amount,
  bankName,
  accountNumber,
  expectedDate,
}: WithdrawalInitiatedProps) {
  // Mask account number to show only last 4 digits
  const maskedAccount = accountNumber.length > 4 
    ? `••••${accountNumber.slice(-4)}` 
    : accountNumber;

  return (
    <Layout previewText={`Your withdrawal of ₦${amount.toLocaleString()} has been initiated`}>
      <Text style={heading}>Withdrawal Initiated</Text>
      <Text style={paragraph}>
        Hi {name},
      </Text>
      <Text style={paragraph}>
        We've started processing your withdrawal for <strong>₦{amount.toLocaleString()}</strong>.
      </Text>

      <div style={detailsBox}>
        <div style={detailsRow}>
          <span style={detailsLabel}>Amount</span>
          <span style={detailsValue}>₦{amount.toLocaleString()}</span>
        </div>
        <Hr style={divider} />
        <div style={detailsRow}>
          <span style={detailsLabel}>Bank</span>
          <span style={detailsValue}>{bankName}</span>
        </div>
        <Hr style={divider} />
        <div style={detailsRow}>
          <span style={detailsLabel}>Account</span>
          <span style={detailsValue}>{maskedAccount}</span>
        </div>
        <Hr style={divider} />
        <div style={detailsRow}>
          <span style={detailsLabel}>Expected By</span>
          <span style={detailsValue}>{expectedDate}</span>
        </div>
      </div>

      <Text style={paragraph}>
        We will notify you once the funds have successfully arrived in your bank account.
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

const detailsBox = {
  backgroundColor: '#F9FAFB',
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
  padding: '16px 24px',
  margin: '24px 0',
};

const detailsRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
};

const detailsLabel = {
  fontSize: '14px',
  color: '#5A6270',
  display: 'inline-block',
  width: '40%',
};

const detailsValue = {
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
