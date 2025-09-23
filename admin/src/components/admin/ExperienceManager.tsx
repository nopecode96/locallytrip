import React, { useState } from 'react';
import ContentSection from './ContentSection';
import { Button } from '../ui/Button';

const ExperienceManager = () => {
  const [experiences, setExperiences] = useState([]);
  const [newExperience, setNewExperience] = useState('');

  const handleAddExperience = () => {
    if (newExperience) {
      setExperiences([...experiences, newExperience]);
      setNewExperience('');
    }
  };

  const handleRemoveExperience = (experienceToRemove) => {
    setExperiences(experiences.filter(exp => exp !== experienceToRemove));
  };

  return (
    <div className="experience-manager">
      <h2>Manage Featured Experiences</h2>
      <div className="add-experience">
        <input
          type="text"
          value={newExperience}
          onChange={(e) => setNewExperience(e.target.value)}
          placeholder="Add new experience"
        />
        <Button onClick={handleAddExperience}>Add Experience</Button>
      </div>
      <div className="experience-list">
        {experiences.map((experience, index) => (
          <ContentSection
            key={index}
            title={experience}
            onRemove={() => handleRemoveExperience(experience)}
          />
        ))}
      </div>
    </div>
  );
};

export default ExperienceManager;