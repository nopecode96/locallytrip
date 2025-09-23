export interface FeaturedExperience {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

export interface FavoriteCity {
  id: string;
  name: string;
  imageUrl: string;
}

export interface ExpertHost {
  id: string;
  name: string;
  bio: string;
  imageUrl: string;
}

export interface TravelStory {
  id: string;
  title: string;
  content: string;
  author: string;
  imageUrl: string;
}

export interface Testimonial {
  id: string;
  travelerName: string;
  feedback: string;
  rating: number;
}

export interface HomepageContent {
  featuredExperiences: FeaturedExperience[];
  favoriteCities: FavoriteCity[];
  expertHosts: ExpertHost[];
  travelStories: TravelStory[];
  testimonials: Testimonial[];
}