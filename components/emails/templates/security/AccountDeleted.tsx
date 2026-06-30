import * as React from 'react';
import { Text } from '@react-email/components';
import { Layout } from '../../Layout';

interface AccountDeletedProps {
  name: string;
}

export function AccountDeleted({ name }: AccountDeletedProps) {
  return (
    <Layout previewText="Your SellSnap account has been deleted">
      <Text style={heading}>Account deleted</Text>
      <Text style={paragraph}>
        Hi {name},
      </Text>
      <Text style={paragraph}>
        Your SellSnap account and all associated data have been permanently deleted as requested.
      </Text>
      <Text style={paragraph}>
        We're sorry to see you go! If you ever want to sell with SellSnap again, you can always create a new account.
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
