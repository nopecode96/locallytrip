import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Local Experiences - LocallyTrip.com',
  description: 'Discover authentic local experiences and activities with verified hosts.',
  keywords: 'local experiences, tour guide, photographer, trip planner, local host, travel services, authentic experiences',
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
