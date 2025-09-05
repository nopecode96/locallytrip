'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsEmailSent(true);
    }, 2000);
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                LocallyTrip.com ✈️
              </div>
            </Link>
          </div>

          {/* Success Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-green-100 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Check Your Email
            </h1>
            
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            
            <p className="text-sm text-gray-500 mb-6">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsEmailSent(false);
                  setEmail('');
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Try Different Email
              </button>
              
              <Link
                href="/login"
                className="block w-full text-purple-600 hover:text-pink-600 py-3 text-center font-medium transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              LocallyTrip.com ✈️
            </div>
          </Link>
          <p className="text-gray-600 mt-2">Reset your password</p>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-pink-100">
          <h1 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Forgot Password?
          </h1>
          
          <p className="text-gray-600 text-center mb-6">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none transition-colors ${
                  error ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                }`}
                placeholder="Enter your email address"
                disabled={isLoading}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="text-center mt-6">
            <Link href="/login" className="text-purple-600 hover:text-pink-600 font-medium transition-colors">
              ← Back to Sign In
            </Link>
          </div>
        </div>

        {/* Alternative Options */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Remember your password?{' '}
            <Link href="/login" className="text-purple-600 hover:text-pink-600 font-semibold">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
