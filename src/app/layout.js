'use client';
import './globals.css';
import { Providers } from './providers';
import LayoutShell from '@/components/LayoutShell';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Vedhika Thread Affairs | Premium Handloom Sarees</title>
        <meta name="description" content="Experience the timeless grace of handwoven Kanjeevarams, exquisite Banarasis and luxury silks. Vedhika Thread Affairs — Vijayawada's finest saree boutique." />
        <meta name="keywords" content="sarees, silk sarees, bridal sarees, kanjeevaram, banarasi, designer sarees, vedhika thread affairs, vijayawada sarees" />
        <meta property="og:title" content="Vedhika Thread Affairs | Premium Handloom Sarees" />
        <meta property="og:description" content="Discover India's finest handwoven sarees. Free shipping above ₹5,000." />
        <meta name="theme-color" content="#fcfbf9" />
      </head>
      <body>
        <Providers>
          <LayoutShell>
            {children}
          </LayoutShell>
        </Providers>
      </body>
    </html>
  );
}
