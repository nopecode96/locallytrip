import React, { useState } from 'react';

const TestimonialManager = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState('');

  const handleAddTestimonial = () => {
    if (newTestimonial) {
      setTestimonials([...testimonials, newTestimonial]);
      setNewTestimonial('');
    }
  };

  const handleDeleteTestimonial = (index) => {
    const updatedTestimonials = testimonials.filter((_, i) => i !== index);
    setTestimonials(updatedTestimonials);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Testimonials</h2>
      <div className="mb-4">
        <input
          type="text"
          value={newTestimonial}
          onChange={(e) => setNewTestimonial(e.target.value)}
          placeholder="Add a new testimonial"
          className="border p-2 w-full"
        />
        <button
          onClick={handleAddTestimonial}
          className="bg-blue-500 text-white p-2 mt-2"
        >
          Add Testimonial
        </button>
      </div>
      <ul>
        {testimonials.map((testimonial, index) => (
          <li key={index} className="flex justify-between items-center mb-2">
            <span>{testimonial}</span>
            <button
              onClick={() => handleDeleteTestimonial(index)}
              className="bg-red-500 text-white p-1"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestimonialManager;