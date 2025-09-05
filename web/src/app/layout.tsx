import { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'

// Force dynamic rendering for this layout and all child pages
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#EC4899',
  colorScheme: 'light',
}

export const metadata: Metadata = {
  title: 'LocallyTrip.com - Authentic Local Experiences',
  description: 'Discover authentic local experiences with verified hosts across Southeast Asia. Book photography tours, cultural experiences, and personalized trip planning with LocallyTrip.com.',
  keywords: 'travel, local experiences, photography tours, cultural experiences, Southeast Asia, local hosts',
  authors: [{ name: 'LocallyTrip.com' }],
  creator: 'LocallyTrip.com',
  publisher: 'LocallyTrip.com',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon-16x16.svg', sizes: '16x16', type: 'image/svg+xml' },
      { url: '/favicon-32x32.svg', sizes: '32x32', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' }
    ],
    other: [
      { url: '/android-chrome-192x192.svg', sizes: '192x192', type: 'image/svg+xml', rel: 'icon' }
    ]
  },
  manifest: '/manifest.json',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.svg" sizes="16x16" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32x32.svg" sizes="32x32" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#EC4899" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LocallyTrip" />
        <meta name="application-name" content="LocallyTrip" />
        <meta name="msapplication-TileColor" content="#8B5CF6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
