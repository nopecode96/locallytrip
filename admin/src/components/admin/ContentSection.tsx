import React from 'react';
import ExperienceManager from './ExperienceManager';
import CityManager from './CityManager';
import HostManager from './HostManager';
import StoryManager from './StoryManager';
import TestimonialManager from './TestimonialManager';

const ContentSection: React.FC = () => {
  return (
    <div className="content-section">
      <h2>Featured Experiences</h2>
      <ExperienceManager />

      <h2>Favorite Cities</h2>
      <CityManager />

      <h2>Meet Our Expert Hosts</h2>
      <HostManager />

      <h2>Travel Stories Featured</h2>
      <StoryManager />

      <h2>What Travelers Say</h2>
      <TestimonialManager />
    </div>
  );
};

export default ContentSection;