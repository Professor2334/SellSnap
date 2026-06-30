import * as React from 'react';
import { Text } from '@react-email/components';
import { Layout } from '../../Layout';

interface EmailChangedProps {
  name: string;
  newEmail: string;
}

export function EmailChanged({ name, newEmail }: EmailChangedProps) {
  return (
    <Layout previewText="Your SellSnap email was updated">
      <Text style={heading}>Email address updated</Text>
      <Text style={paragraph}>
        Hi {name},
      </Text>
      <Text style={paragraph}>
        The email address associated with your SellSnap account has been changed to <strong>{newEmail}</strong>.
      </Text>
      <Text style={paragraph}>
        If you did not request this change, please contact our support team immediately to recover your account.
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
