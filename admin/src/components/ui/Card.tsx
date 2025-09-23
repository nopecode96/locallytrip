import React from 'react';

const Card = ({ title, content, imageUrl }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {imageUrl && <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />}
      <div className="p-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-2 text-gray-600">{content}</p>
      </div>
    </div>
  );
};

export default Card;