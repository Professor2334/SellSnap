import * as React from 'react';
import { Section, Text, Link } from '@react-email/components';

export function Footer() {
  return (
    <Section style={footer}>
      <Text style={footerText}>
        SellSnap enables creators to sell instantly via WhatsApp.
      </Text>
      <Text style={footerLinks}>
        <Link href="https://sellsnap.com" style={link}>sellsnap.com</Link> •{' '}
        <Link href="https://twitter.com/sellsnap" style={link}>Twitter</Link> •{' '}
        <Link href="mailto:support@sellsnap.com" style={link}>Support</Link>
      </Text>
      <Text style={footerCopyright}>
        © {new Date().getFullYear()} SellSnap. All rights reserved.
      </Text>
    </Section>
  );
}

const footer = {
  padding: '32px 40px',
  backgroundColor: '#F9FAFB', // Slight contrast for footer
  borderTop: '1px solid #E5E7EB',
  textAlign: 'center' as const,
};

const footerText = {
  margin: '0 0 12px',
  fontSize: '14px',
  color: '#5A6270', // --color-ink-muted
  lineHeight: '20px',
};

const footerLinks = {
  margin: '0 0 16px',
  fontSize: '14px',
  color: '#9AA1AD', // --color-ink-subtle
};

const link = {
  color: '#5A6270',
  textDecoration: 'underline',
};

const footerCopyright = {
  margin: 0,
  fontSize: '12px',
  color: '#9AA1AD',
};
