import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { WalletProvider } from '@/context/WalletContext'
import { Navigation } from '@/components/Navigation'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'SoraPay — Smart Digital Wallet for Japan',
  description: 'SoraPay is a modern digital wallet application. Send money, receive payments via QR code, track spending, and earn rewards — all in one beautiful app.',
  keywords: ['digital wallet', 'Japan payment', 'QR payment', 'fintech', 'cashless', 'money transfer'],
  openGraph: {
    title: 'SoraPay — Smart Digital Wallet',
    description: 'The modern cashless payment app for Japan and beyond.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+JP:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.variable}>
        <AuthProvider>
          <WalletProvider>
            <Navigation />
            {children}
          </WalletProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
