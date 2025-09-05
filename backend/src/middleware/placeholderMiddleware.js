const express = require('express');
const path = require('path');
const fs = require('fs');

// Middleware untuk handle placeholder images
const placeholderMiddleware = (req, res, next) => {
  // Only handle image requests
  if (!req.path.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
    return next();
  }

  // Build full file path
  const fullPath = path.join(__dirname, '../public', req.path);

  // Check if file exists
  if (fs.existsSync(fullPath)) {
    return next(); // File exists, continue normally
  }

  

  // Determine placeholder type based on path
  let placeholderType = 'default';
  
  if (req.path.includes('/experiences/')) {
    placeholderType = 'experience';
  } else if (req.path.includes('/users/') || req.path.includes('/hosts/')) {
    placeholderType = 'profile';
  } else if (req.path.includes('/cities/')) {
    placeholderType = 'city';
  }

  // Generate placeholder based on type
  const generatePlaceholder = (type, width = 800, height = 600) => {
    const colors = {
      experience: { bg: '#6366f1', text: '#ffffff' },
      profile: { bg: '#9333ea', text: '#ffffff' },
      city: { bg: '#059669', text: '#ffffff' },
      default: { bg: '#6b7280', text: '#ffffff' }
    };

    const color = colors[type] || colors.default;
    const text = type === 'profile' ? 'Profile' : 
                 type === 'experience' ? 'Experience' :
                 type === 'city' ? 'City' : 'Image';

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${color.bg}"/>
        <circle cx="${width/2}" cy="${height/2 - 40}" r="60" fill="${color.text}" opacity="0.3"/>
        <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" 
              font-family="system-ui, -apple-system, sans-serif" font-size="32" 
              font-weight="700" fill="${color.text}">
          ${text}
        </text>
        <text x="50%" y="68%" dominant-baseline="middle" text-anchor="middle" 
              font-family="system-ui, -apple-system, sans-serif" font-size="18" 
              fill="${color.text}" opacity="0.9">
          Image not found
        </text>
      </svg>`;

    return svg;
  };

  // Set SVG content type
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'no-cache');
  
  // Send placeholder SVG
  res.send(generatePlaceholder(placeholderType));
};

module.exports = placeholderMiddleware;
