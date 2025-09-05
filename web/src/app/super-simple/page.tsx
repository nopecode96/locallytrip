'use client';

import { useEffect, useState } from 'react';

export default function SuperSimpleTest() {
  const [result, setResult] = useState('loading...');

  useEffect(() => {
    fetch('/api/featured-testimonials')
      .then(res => res.json())
      .then(data => {
        setResult(`SUCCESS: Found ${data.data?.length || 0} testimonials`);
      })
      .catch(err => {
        setResult(`ERROR: ${err.message}`);
      });
  }, []);

  return (
    <div className="p-8 text-2xl">
      <h1>Super Simple Testimonials Test</h1>
      <p className="mt-4 p-4 bg-gray-200 rounded">
        {result}
      </p>
    </div>
  );
}
