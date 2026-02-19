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

export const metadata: Metadata = {
  title: 'Interview Prep | Company LeetCode Problems',
  description: 'Explore company-wise LeetCode problems to prepare for coding interviews. Filter by difficulty and time period.',
  generator: 'v0.app',
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
      </body>
    </html>
  )
}
