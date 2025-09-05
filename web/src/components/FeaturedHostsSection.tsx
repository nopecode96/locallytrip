import FeaturedHostCard from '@/components/FeaturedHostCard';

import { getBackendUrl } from '@/utils/backend';

interface FeaturedHost {
  id: string;
  hostId: string;
  name: string;
  title: string;
  description: string;
  badge: string;
  profilePicture: string;
  location: string;
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  joinedDate: string;
  displayOrder: number;
}

async function getFeaturedHosts(): Promise<FeaturedHost[]> {
  try {
    const backendUrl = getBackendUrl();
    const response = await fetch(`${backendUrl}/featured-hosts?limit=4`, {
      cache: 'no-store', // Always fetch fresh data
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    
    if (data.success && Array.isArray(data.data)) {
      return data.data.map((host: any) => ({
        id: host.id,
        hostId: host.hostId,
        name: host.name,
        title: host.title,
        description: host.description,
        badge: host.badge,
        profilePicture: host.profilePicture,
        location: host.location || 'Southeast Asia',
        rating: host.rating || 4,
        totalReviews: host.totalReviews || 0,
        isVerified: host.isVerified || true,
        joinedDate: host.joinedDate,
        displayOrder: host.displayOrder
      }));
    }
    
    return [];
  } catch (error) {
    return [];
  }
}

export default async function FeaturedHostsSection() {
  const hosts = await getFeaturedHosts();
  
  return (
    <section id="expert-hosts" className="py-12 md:py-14 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white border-t">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">
            Meet Our Expert Hosts ✨
          </h2>
          <p className="text-white/90 text-base md:text-lg mb-6 md:mb-8 px-4">
            Connect with passionate locals who love sharing their culture and expertise 🌍
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {hosts.length > 0 ? (
            hosts.map((host: FeaturedHost) => (
              <FeaturedHostCard key={host.id} host={host} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-white/90">No featured hosts available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
