import * as React from 'react';
import { Text } from '@react-email/components';
import { Layout } from '../../Layout';
import { EmailButton } from '../../EmailButton';

interface WelcomeEmailProps {
  name: string;
  dashboardUrl: string;
}

export function WelcomeEmail({ name, dashboardUrl }: WelcomeEmailProps) {
  return (
    <Layout previewText="Welcome to SellSnap!">
      <Text style={heading}>Welcome to SellSnap, {name}!</Text>
      <Text style={paragraph}>
        We are thrilled to have you on board. SellSnap is the fastest way to turn your products into shareable payment links that work perfectly on WhatsApp, Instagram, and anywhere else you sell.
      </Text>
      <Text style={paragraph}>
        To get started, simply add your first product and share your link with your customers. They can pay instantly via Flutterwave, and you get notified right away.
      </Text>
      <EmailButton href={dashboardUrl}>
        Go to Dashboard
      </EmailButton>
      <Text style={paragraph}>
        If you have any questions, reply to this email and our support team will be happy to help.
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
