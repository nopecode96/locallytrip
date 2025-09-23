import React, { useState } from 'react';
import ContentSection from './ContentSection';

const HostManager = () => {
  const [hosts, setHosts] = useState([]);
  const [newHost, setNewHost] = useState('');

  const addHost = () => {
    if (newHost) {
      setHosts([...hosts, newHost]);
      setNewHost('');
    }
  };

  const removeHost = (hostToRemove) => {
    setHosts(hosts.filter(host => host !== hostToRemove));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Meet Our Expert Hosts</h2>
      <div className="mb-4">
        <input
          type="text"
          value={newHost}
          onChange={(e) => setNewHost(e.target.value)}
          placeholder="Add new host"
          className="border p-2 mr-2"
        />
        <button onClick={addHost} className="bg-blue-500 text-white p-2">
          Add Host
        </button>
      </div>
      <div>
        {hosts.map((host, index) => (
          <ContentSection key={index} title={host} onRemove={() => removeHost(host)} />
        ))}
      </div>
    </div>
  );
};

export default HostManager;