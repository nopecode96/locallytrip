import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive Booking Flow Mockups - LocallyTrip.com',
  description: 'Explore interactive booking flows for different service categories: tour guides, photographers, trip planners, and combo services.',
  keywords: 'booking flow, user experience, tour booking, photography booking, trip planning, service booking',
};

export default function BookingFlowsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
