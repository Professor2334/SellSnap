import * as React from 'react';
import { Text } from '@react-email/components';
import { Layout } from '../../Layout';
import { EmailButton } from '../../EmailButton';

interface EmailVerificationProps {
  name: string;
  verifyUrl: string;
}

export function EmailVerification({ name, verifyUrl }: EmailVerificationProps) {
  return (
    <Layout previewText="Verify your SellSnap email address">
      <Text style={heading}>Verify your email address</Text>
      <Text style={paragraph}>
        Hi {name},
      </Text>
      <Text style={paragraph}>
        Please verify your email address so we know it's really you. This helps us keep your account secure.
      </Text>
      <EmailButton href={verifyUrl}>
        Verify Email Address
      </EmailButton>
      <Text style={paragraph}>
        If you didn't create an account with SellSnap, you can safely ignore this email.
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
