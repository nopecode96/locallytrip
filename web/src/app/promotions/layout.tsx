import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exclusive Promotions - LocallyTrip.com',
  description: 'Unlock local adventures with exclusive promotions. Save on photography sessions, guided tours, and custom trip planning with trusted local hosts.',
  keywords: 'travel promotions, local deals, photography discount, tour guide offers, trip planning promo, LocallyTrip deals',
};

export default function PromotionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
