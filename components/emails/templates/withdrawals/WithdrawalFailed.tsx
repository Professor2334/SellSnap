import * as React from 'react';
import { Text, Hr } from '@react-email/components';
import { Layout } from '../../Layout';

interface WithdrawalFailedProps {
  name: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  reason: string;
}

export function WithdrawalFailed({
  name,
  amount,
  bankName,
  accountNumber,
  reason,
}: WithdrawalFailedProps) {
  const maskedAccount = accountNumber.length > 4 
    ? `••••${accountNumber.slice(-4)}` 
    : accountNumber;

  return (
    <Layout previewText={`Your withdrawal of ₦${amount.toLocaleString()} failed`}>
      <Text style={heading}>Withdrawal Failed</Text>
      <Text style={paragraph}>
        Hi {name},
      </Text>
      <Text style={paragraph}>
        Unfortunately, your withdrawal of <strong>₦{amount.toLocaleString()}</strong> could not be processed.
      </Text>
      
      <div style={errorBox}>
        <Text style={errorText}>
          <strong>Reason:</strong> {reason}
        </Text>
      </div>

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
      </div>

      <Text style={paragraph}>
        Your funds have been returned to your SellSnap balance. Please check your bank details and try again, or contact support if the issue persists.
      </Text>
    </Layout>
  );
}

const heading = {
  fontSize: '24px',
  fontWeight: 700,
  margin: '0 0 20px',
  color: '#B91C1C', // --color-danger
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 16px',
};

const errorBox = {
  backgroundColor: '#FEF2F2',
  border: '1px solid #FCA5A5',
  borderRadius: '8px',
  padding: '16px',
  margin: '16px 0',
};

const errorText = {
  margin: 0,
  color: '#991B1B',
  fontSize: '14px',
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
