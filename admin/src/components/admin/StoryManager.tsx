import React, { useState } from 'react';
import ContentSection from './ContentSection';

const StoryManager = () => {
  const [stories, setStories] = useState([]);
  const [newStory, setNewStory] = useState({ title: '', content: '' });

  const handleAddStory = () => {
    if (newStory.title && newStory.content) {
      setStories([...stories, newStory]);
      setNewStory({ title: '', content: '' });
    }
  };

  const handleDeleteStory = (index) => {
    const updatedStories = stories.filter((_, i) => i !== index);
    setStories(updatedStories);
  };

  return (
    <div className="story-manager">
      <h2>Manage Featured Travel Stories</h2>
      <div className="add-story">
        <input
          type="text"
          placeholder="Story Title"
          value={newStory.title}
          onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
        />
        <textarea
          placeholder="Story Content"
          value={newStory.content}
          onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
        />
        <button onClick={handleAddStory}>Add Story</button>
      </div>
      <div className="story-list">
        {stories.map((story, index) => (
          <ContentSection key={index} title={story.title} content={story.content}>
            <button onClick={() => handleDeleteStory(index)}>Delete</button>
          </ContentSection>
        ))}
      </div>
    </div>
  );
};

export default StoryManager;