import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Atan Motoring Supply – Singapore',
  description: 'Expert motorbike repair, servicing, and sales in Kampong Ubi, Singapore.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
