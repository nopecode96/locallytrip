import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'password123') {
      onLogin(password);
      localStorage.setItem('admin_auth', 'true');
      window.location.href = '/homepage-content';
    } else {
      setError('Invalid password. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-2xl mb-4 text-center font-bold">Admin Login</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter admin password"
        />
      </div>
      <button 
        type="submit" 
        className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-md transition-colors"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;