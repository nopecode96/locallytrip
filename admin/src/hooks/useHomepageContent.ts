import { useState, useEffect } from 'react';

const useHomepageContent = () => {
  const [featuredExperiences, setFeaturedExperiences] = useState([]);
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [expertHosts, setExpertHosts] = useState([]);
  const [travelStories, setTravelStories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    // Mock data for testing purposes
    setFeaturedExperiences([
      { id: 1, title: 'Experience 1', description: 'Description for experience 1' },
      { id: 2, title: 'Experience 2', description: 'Description for experience 2' },
    ]);

    setFavoriteCities([
      { id: 1, name: 'City 1' },
      { id: 2, name: 'City 2' },
    ]);

    setExpertHosts([
      { id: 1, name: 'Host 1', bio: 'Expert in local experiences' },
      { id: 2, name: 'Host 2', bio: 'Travel enthusiast and guide' },
    ]);

    setTravelStories([
      { id: 1, title: 'Story 1', content: 'Content for story 1' },
      { id: 2, title: 'Story 2', content: 'Content for story 2' },
    ]);

    setTestimonials([
      { id: 1, author: 'Traveler 1', feedback: 'Amazing experience!' },
      { id: 2, author: 'Traveler 2', feedback: 'Loved every moment!' },
    ]);
  }, []);

  return {
    featuredExperiences,
    favoriteCities,
    expertHosts,
    travelStories,
    testimonials,
  };
};

export default useHomepageContent;