import * as React from 'react';
import { Text } from '@react-email/components';
import { Layout } from '../../Layout';

interface PasswordResetSuccessProps {
  name: string;
}

export function PasswordResetSuccess({ name }: PasswordResetSuccessProps) {
  return (
    <Layout previewText="Your password was successfully reset">
      <Text style={heading}>Password reset successful</Text>
      <Text style={paragraph}>
        Hi {name},
      </Text>
      <Text style={paragraph}>
        Your SellSnap password has been successfully updated.
      </Text>
      <Text style={paragraph}>
        If you did not make this change, please contact support immediately to secure your account.
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
