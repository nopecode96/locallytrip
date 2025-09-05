import { Metadata } from 'next'
import './globals.css'
import { AdminProvider } from '../contexts/AdminContext'

// Force dynamic rendering for this layout and all child pages
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'LocallyTrip.com Admin Dashboard',
  description: 'Admin dashboard for managing LocallyTrip.com platform - users, trips, bookings, and analytics.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AdminProvider>
          {children}
        </AdminProvider>
      </body>
    </html>
  )
}
