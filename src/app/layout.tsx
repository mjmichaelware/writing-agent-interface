import type { Metadata } from 'next';
import { Frank_Ruhl_Libre } from 'next/font/google';
import './globals.css';

const hebrewFont = Frank_Ruhl_Libre({
  subsets: ['hebrew'],
  weight: ['400', '700'],
  variable: '--font-hebrew',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={hebrewFont.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
