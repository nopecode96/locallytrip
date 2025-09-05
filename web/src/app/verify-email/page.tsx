'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authAPI } from '../../services/authAPI';
import { useToast } from '../../hooks/useToast';
import Toast from '../../components/Toast';

const VerifyEmailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          if (data.data?.user?.role === 'host') {
            router.push('/host/dashboard?welcome=true');
          } else {
            router.push('/dashboard?welcome=true');
          }
        }, 3000);
      } else {
        setError(data.error || 'Email verification failed');
      }
    } catch (err) {
      setError('An error occurred during email verification');
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsResending(true);
    setError('');

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setError(''); // Clear any previous errors
        showSuccess('Verification email sent! Please check your inbox.');
      } else {
        setError(data.error || 'Failed to send verification email');
      }
    } catch (err) {
      setError('An error occurred while sending verification email');
    } finally {
      setIsResending(false);
    }
  };

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

        {/* Verification Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-pink-100">
          {isLoading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Verifying Email...</h1>
              <p className="text-gray-600">Please wait while we verify your email address.</p>
            </div>
          )}

          {isSuccess && !isLoading && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-green-600 mb-2">Email Verified Successfully! 🎉</h1>
              <p className="text-gray-600 mb-4">
                Welcome to LocallyTrip! Your account has been verified and you're ready to start your journey.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to your dashboard in 3 seconds...
              </p>
            </div>
          )}

          {error && !isLoading && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h1>
              <p className="text-gray-600 mb-6">{error}</p>

              {/* Resend Email Section */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Need a new verification email?</h3>
                <div className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={resendVerificationEmail}
                    disabled={isResending}
                    className="w-full bg-purple-600 text-white py-3 px-6 rounded-2xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isResending ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending...
                      </span>
                    ) : (
                      'Resend Verification Email'
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <Link 
                  href="/login"
                  className="block w-full bg-gray-600 text-white py-3 px-6 rounded-2xl font-semibold text-center hover:bg-gray-700 transition-colors"
                >
                  Back to Login
                </Link>
                <Link 
                  href="/register"
                  className="block w-full border-2 border-purple-600 text-purple-600 py-3 px-6 rounded-2xl font-semibold text-center hover:bg-purple-50 transition-colors"
                >
                  Create New Account
                </Link>
              </div>
            </div>
          )}

          {!token && !isLoading && (
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-yellow-600 mb-2">No Verification Token</h1>
              <p className="text-gray-600 mb-6">
                No verification token was provided. Please check your email for the verification link.
              </p>

              <div className="space-y-3">
                <Link 
                  href="/login"
                  className="block w-full bg-purple-600 text-white py-3 px-6 rounded-2xl font-semibold text-center hover:bg-purple-700 transition-colors"
                >
                  Go to Login
                </Link>
                <Link 
                  href="/register"
                  className="block w-full border-2 border-purple-600 text-purple-600 py-3 px-6 rounded-2xl font-semibold text-center hover:bg-purple-50 transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Need help? Contact us at{' '}
            <a href="mailto:support@locallytrip.com" className="text-purple-600 hover:underline">
              support@locallytrip.com
            </a>
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        autoClose={true}
        duration={4000}
      />
    </div>
  );
};

export default VerifyEmailPage;
