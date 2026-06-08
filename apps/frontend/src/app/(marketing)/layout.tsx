export const dynamic = 'force-dynamic';
import '../global.scss';
import './marketing.scss';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import PubNavClient from './_lib/nav-client';
import { PubFooter } from './_lib/shell';

const SITE_URL = process.env.FRONTEND_URL || 'https://publio.app';
const TITLE = 'Publio — Sosyal medyanı tek yerden, sıfır gürültüyle yönet';
const DESCRIPTION =
  'Publio; 28+ sosyal kanala AI destekli içerik üretimi, akıllı planlama, otomasyon ve analiz sunan modern sosyal medya orkestrasyon platformu. İçeriği AI üretsin, sen sadece yayınla.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s · Publio',
  },
  description: DESCRIPTION,
  applicationName: 'Publio',
  keywords: [
    'sosyal medya yönetimi',
    'içerik planlama',
    'sosyal medya planlama aracı',
    'AI içerik üretimi',
    'Instagram planlama',
    'sosyal medya takvimi',
    'gönderi zamanlama',
    'sosyal medya otomasyonu',
    'Publio',
  ],
  authors: [{ name: 'Publio' }],
  creator: 'Publio',
  publisher: 'Publio',
  alternates: { canonical: '/welcome' },
  category: 'technology',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: ['/favicon.svg'],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: '/welcome',
    siteName: 'Publio',
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: '/favicon.png',
        width: 512,
        height: 512,
        alt: 'Publio',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/favicon.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon-32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0e0d0b" />
      </head>
      <body className="publio-marketing">
        <PubNavClient />
        <main>{children}</main>
        <PubFooter />
      </body>
    </html>
  );
}
