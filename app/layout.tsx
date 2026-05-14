import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/components/auth-provider'
import { CompletionProvider } from '@/hooks/use-completion'
import { GridBackground } from '@/components/grid-background'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hopefuel.vercel.app'

export const metadata: Metadata = {
  title: {
    default: 'LeetPrep — Ace Your Coding Interviews',
    template: '%s | LeetPrep',
  },
  description: 'Practice company-wise LeetCode interview questions sorted by frequency. Includes Blind 75, Blind 150, and Blind 300 curated lists with progress tracking, difficulty filters, and Google Sign-In sync.',
  keywords: ['LeetCode', 'interview prep', 'coding interviews', 'Blind 75', 'Blind 150', 'company-wise questions', 'FAANG prep', 'DSA practice'],
  authors: [{ name: 'LeetPrep' }],
  creator: 'LeetPrep',
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: 'LeetPrep — Ace Your Coding Interviews',
    description: 'Practice company-wise LeetCode interview questions sorted by frequency. Blind 75/150/300 curated lists with progress tracking.',
    url: baseUrl,
    siteName: 'LeetPrep',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LeetPrep - Coding Interview Preparation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LeetPrep — Ace Your Coding Interviews',
    description: 'Practice company-wise LeetCode interview questions sorted by frequency. Blind 75/150/300 curated lists with progress tracking.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'LeetPrep',
    url: baseUrl,
    description: 'Practice company-wise LeetCode interview questions sorted by frequency. Includes Blind 75, Blind 150, and Blind 300 curated lists.',
    applicationCategory: 'Educational Application',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  }

  return (
    <html lang="en">
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <CompletionProvider>
            <GridBackground />
            <div className="relative z-10">
              {children}
            </div>
          </CompletionProvider>
        </AuthProvider>
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  )
}
