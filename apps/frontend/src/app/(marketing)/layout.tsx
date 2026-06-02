export const dynamic = 'force-dynamic';
import '../global.scss';
import './marketing.scss';
import { ReactNode } from 'react';
import PubNavClient from './_lib/nav-client';
import { PubFooter } from './_lib/shell';

export const metadata = {
  title: 'Publio — Sosyal medyanı tek yerden, sıfır gürültüyle',
  description:
    'Publio; 28+ kanala AI destekli planlama, üretim ve analiz sağlayan, modern içerik orkestrasyon platformu.',
};

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f5f1e8" />
      </head>
      <body className="publio-marketing">
        <PubNavClient />
        <main>{children}</main>
        <PubFooter />
      </body>
    </html>
  );
}
