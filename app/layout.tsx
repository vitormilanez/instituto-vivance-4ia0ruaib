import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://lume-saude-prototipo.vitormilanez.chatgpt.site'),
  title: 'Instituto Vivance — Cuidado contínuo',
  description: 'Protótipo de acompanhamento longitudinal assistido por IA para emagrecimento e envelhecimento saudável.',
  openGraph: {
    title: 'Instituto Vivance',
    description: 'Cuidado contínuo, decisões mais claras.',
    type: 'website',
    locale: 'pt_BR',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Instituto Vivance — Cuidado contínuo, decisões mais claras.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instituto Vivance',
    description: 'Cuidado contínuo, decisões mais claras.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
