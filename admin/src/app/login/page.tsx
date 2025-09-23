'use client';

import { useState } from 'react';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const { login } = useAuth();
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (password: string) => {
    try {
      await login(password);
      router.push('/homepage-content');
    } catch (error) {
      setError('Invalid password. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          LocallyTrip Admin
        </h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
};

export default LoginPage;