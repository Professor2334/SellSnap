import * as React from 'react';
import { Section, Text, Img } from '@react-email/components';

export function Header() {
  return (
    <Section style={header}>
      <Text style={logo}>SellSnap</Text>
    </Section>
  );
}

const header = {
  padding: '24px 40px',
  borderBottom: '1px solid #E5E7EB',
  backgroundColor: '#FFFFFF',
};

const logo = {
  margin: 0,
  fontSize: '24px',
  fontWeight: 700,
  color: '#1A7F3C', // --color-brand
  letterSpacing: '-0.5px',
};
