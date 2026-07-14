import * as React from 'react';
import { Text, Link } from '@react-email/components';
import { Layout } from '../../Layout';
import { EmailButton } from '../../EmailButton';

interface ForgotPasswordProps {
  name: string;
  resetUrl: string;
}

export function ForgotPassword({ name, resetUrl }: ForgotPasswordProps) {
  return (
    <Layout previewText="Reset your SellSnap password">
      <Text style={heading}>Reset your password</Text>
      <Text style={paragraph}>
        Hi {name},
      </Text>
      <Text style={paragraph}>
        We received a request to reset the password for your SellSnap account. Click the button below to choose a new password. This link will expire in 1 hour.
      </Text>
      <EmailButton href={resetUrl}>
        Reset Password
      </EmailButton>
      <Text style={paragraph}>
        Or copy and paste this URL into your browser: <br />
        <Link href={resetUrl} style={link}>{resetUrl}</Link>
      </Text>
      <Text style={paragraph}>
        If you didn&apos;t request a password reset, you can safely ignore this email. Your password will not change.
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

const link = {
  color: '#1A7F3C',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
};
