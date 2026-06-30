import * as React from 'react';
import { Text, Hr } from '@react-email/components';
import { Layout } from '../../Layout';

interface WithdrawalSuccessProps {
  name: string;
  amount: number;
  bankName: string;
  accountNumber: string;
}

export function WithdrawalSuccess({
  name,
  amount,
  bankName,
  accountNumber,
}: WithdrawalSuccessProps) {
  const maskedAccount = accountNumber.length > 4 
    ? `••••${accountNumber.slice(-4)}` 
    : accountNumber;

  return (
    <Layout previewText={`Your withdrawal of ₦${amount.toLocaleString()} was successful`}>
      <Text style={heading}>Withdrawal Successful 💸</Text>
      <Text style={paragraph}>
        Hi {name},
      </Text>
      <Text style={paragraph}>
        Great news! Your withdrawal of <strong>₦{amount.toLocaleString()}</strong> has successfully arrived in your bank account.
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
          <span style={detailsLabel}>Status</span>
          <span style={statusSuccess}>Completed</span>
        </div>
      </div>

      <Text style={paragraph}>
        It may take a few minutes for your bank app to reflect the updated balance. Keep selling!
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

const statusSuccess = {
  ...detailsValue,
  color: '#15803D', // --color-success
};

const divider = {
  borderColor: '#E5E7EB',
  margin: '12px 0',
};
