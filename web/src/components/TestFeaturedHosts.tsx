'use client';

import React from 'react';
import { useFeaturedHosts } from '@/hooks/useFeaturedHosts';

const TestFeaturedHosts: React.FC = () => {
  const { hosts, loading, error } = useFeaturedHosts(4);
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Test Featured Hosts Hook</h1>
      <div>
        <p><strong>Loading:</strong> {loading.toString()}</p>
        <p><strong>Error:</strong> {error || 'None'}</p>
        <p><strong>Hosts Count:</strong> {hosts.length}</p>
      </div>
      
      {loading && (
        <div>
          <h2>Loading...</h2>
        </div>
      )}
      
      {error && (
        <div style={{ color: 'red' }}>
          <h2>Error!</h2>
          <p>{error}</p>
        </div>
      )}
      
      {!loading && !error && hosts.length > 0 && (
        <div>
          <h2>Featured Hosts:</h2>
          {hosts.map((host) => (
            <div key={host.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <h3>{host.name}</h3>
              <p>{host.title}</p>
              <p>{host.description}</p>
            </div>
          ))}
        </div>
      )}
      
      {!loading && !error && hosts.length === 0 && (
        <div>
          <h2>No hosts found</h2>
        </div>
      )}
    </div>
  );
};

export default TestFeaturedHosts;
