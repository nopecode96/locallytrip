import React from 'react';
import ExperienceManager from '../components/admin/ExperienceManager';
import CityManager from '../components/admin/CityManager';
import HostManager from '../components/admin/HostManager';
import StoryManager from '../components/admin/StoryManager';
import TestimonialManager from '../components/admin/TestimonialManager';

const AdminPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Featured Content</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold">Featured Experiences</h2>
        <ExperienceManager />
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold">Favorite Cities</h2>
        <CityManager />
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold">Meet Our Expert Hosts</h2>
        <HostManager />
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold">Travel Stories Featured</h2>
        <StoryManager />
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold">What Travelers Say</h2>
        <TestimonialManager />
      </section>
    </div>
  );
};

export default AdminPage;