import * as React from 'react';
import { Text, Hr } from '@react-email/components';
import { Layout } from '../../Layout';

interface NewLoginAlertProps {
  name: string;
  deviceInfo: string;
  location: string;
  time: string;
}

export function NewLoginAlert({ name, deviceInfo, location, time }: NewLoginAlertProps) {
  return (
    <Layout previewText="New login to your SellSnap account">
      <Text style={heading}>New login detected</Text>
      <Text style={paragraph}>
        Hi {name},
      </Text>
      <Text style={paragraph}>
        We noticed a new login to your SellSnap account from a new device or location.
      </Text>
      
      <Hr style={divider} />
      
      <Text style={details}>
        <strong>Device:</strong> {deviceInfo}<br />
        <strong>Location:</strong> {location}<br />
        <strong>Time:</strong> {time}
      </Text>

      <Hr style={divider} />

      <Text style={paragraph}>
        If this was you, you can safely ignore this email.
      </Text>
      <Text style={paragraph}>
        If you don&apos;t recognize this activity, please log in and change your password immediately to secure your account.
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

const details = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#5A6270',
  backgroundColor: '#F9FAFB',
  padding: '16px',
  borderRadius: '8px',
  margin: '16px 0',
};

const divider = {
  borderColor: '#E5E7EB',
  margin: '24px 0',
};
