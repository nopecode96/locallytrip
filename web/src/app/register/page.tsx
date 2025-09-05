'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authAPI, type RegisterData } from '../../services/authAPI';
import { newsletterAPI } from '../../services/newsletterAPI';
import { useHostCategories } from '../../hooks/useHostCategories';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import Toast from '../../components/Toast';

const RegisterPage = () => {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const { categories: hostCategories, loading: categoriesLoading } = useHostCategories();
  const { toast, showSuccess, showError, hideToast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'traveller' as 'traveller' | 'host',
    hostCategories: [] as number[], // Array of category IDs
    acceptTerms: false,
    newsletter: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [apiError, setApiError] = useState<string>('');

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      // Redirect based on user role
      if (user.role === 'host') {
        router.push('/host/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [loading, isAuthenticated, user, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render register form if user is authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleHostCategoryChange = (categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      hostCategories: prev.hostCategories.includes(categoryId)
        ? prev.hostCategories.filter(c => c !== categoryId)
        : [...prev.hostCategories, categoryId]
    }));

    // Clear category error when user selects at least one
    if (errors.hostCategories) {
      setErrors(prev => ({
        ...prev,
        hostCategories: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    if (formData.userType === 'host' && formData.hostCategories.length === 0) {
      newErrors.hostCategories = 'Please select at least one expertise area as a Host';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      const registerData: RegisterData = {
        email: formData.email.trim(),
        password: formData.password,
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        userType: formData.userType,
        ...(formData.userType === 'host' && formData.hostCategories.length > 0 && {
          hostCategories: formData.hostCategories
        })
      };


      const response = await authAPI.register(registerData);

      if (response.success && response.data) {
        // Store token and user data
        authAPI.setToken(response.data.token);
        authAPI.setUser(response.data.user);

        // Subscribe to newsletter if requested
        if (formData.newsletter) {
          try {
            await newsletterAPI.subscribe({
              email: formData.email.trim(),
              name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
              source: 'register',
            });
            // Newsletter subscription success is handled silently since user is already verified
          } catch (newsletterError) {
            console.warn('Newsletter subscription failed during registration:', newsletterError);
            // Don't block the registration flow for newsletter issues
          }
        }

        // Show success message with personalized content
        const userTypeText = formData.userType === 'host' ? 'Host' : 'Traveller';
        const newsletterNote = formData.newsletter ? ' You\'re also subscribed to our newsletter for travel tips and updates!' : '';
        const welcomeMessage = formData.userType === 'host' 
          ? `Welcome to LocallyTrip as a Host! We've sent a verification email to ${formData.email}. Once verified, you can start creating experiences and earning income!${newsletterNote}`
          : `Welcome to LocallyTrip! We've sent a verification email to ${formData.email}. Once verified, you can start exploring amazing local experiences!${newsletterNote}`;
        
        showSuccess(welcomeMessage);

        // Redirect to verification page with context
        if (formData.userType === 'host') {
          router.push(`/verify-email?type=host&email=${encodeURIComponent(formData.email)}`);
        } else {
          router.push(`/verify-email?type=traveller&email=${encodeURIComponent(formData.email)}`);
        }
      } else {
        // Handle validation errors from backend
        if (response.details && Array.isArray(response.details)) {
          const backendErrors: {[key: string]: string} = {};
          response.details.forEach((detail: any) => {
            if (detail.path) {
              backendErrors[detail.path] = detail.msg || detail.message;
            }
          });
          setErrors(backendErrors);
        }
        
        setApiError(response.error || response.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setApiError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };  const handleGoogleRegister = () => {
    // Implement Google OAuth
  };

  const handleInstagramRegister = () => {
    // Implement Instagram OAuth
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
          <p className="text-gray-600 mt-2">
            {formData.userType === 'host' 
              ? 'Offer your expertise as Tour Guide, Photographer, or Trip Planner' 
              : formData.userType === 'traveller' 
              ? 'Discover amazing local experiences' 
              : 'Join our community of travelers and hosts'
            }
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-pink-100">
          <h1 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {formData.userType === 'host' ? 'Create Host Account 🌟' : formData.userType === 'traveller' ? 'Create Traveller Account ✈️' : 'Create Account'}
          </h1>

          {/* Social Register Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleGoogleRegister}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-2xl py-3 px-4 font-semibold text-gray-700 hover:border-gray-300 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>

            <button
              onClick={handleInstagramRegister}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl py-3 px-4 font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Sign up with Instagram
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or create account with email</span>
            </div>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* API Error Display */}
            {apiError && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{apiError}</p>
                  </div>
                </div>
              </div>
            )}
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I want to join as <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`relative flex flex-col items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition-all ${
                  formData.userType === 'traveller' 
                    ? 'border-purple-500 bg-purple-50 text-purple-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}>
                  <input
                    type="radio"
                    name="userType"
                    value="traveller"
                    checked={formData.userType === 'traveller'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-3xl mb-2">✈️</div>
                    <div className="text-lg font-semibold mb-1">Traveller</div>
                    <div className="text-xs text-gray-600">Discover amazing local experiences</div>
                  </div>
                </label>
                <label className={`relative flex flex-col items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition-all ${
                  formData.userType === 'host' 
                    ? 'border-purple-500 bg-purple-50 text-purple-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}>
                  <input
                    type="radio"
                    name="userType"
                    value="host"
                    checked={formData.userType === 'host'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-3xl mb-2">�</div>
                    <div className="text-lg font-semibold mb-1">Host</div>
                    <div className="text-xs text-gray-600">Share your expertise & earn income</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none transition-colors ${
                    errors.firstName ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                  }`}
                  placeholder="First name"
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none transition-colors ${
                    errors.lastName ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                  }`}
                  placeholder="Last name"
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Host Categories - Only show for hosts */}
            {formData.userType === 'host' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What type of Host are you? <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-600 mb-4">Select your expertise as a Host (you can choose multiple specializations)</p>
                
                {categoriesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <span className="ml-2 text-gray-600">Loading categories...</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {hostCategories.map((category) => (
                      <label 
                        key={category.id}
                        className={`flex items-start p-4 border-2 rounded-2xl cursor-pointer transition-all hover:shadow-md ${
                          formData.hostCategories.includes(category.id) 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.hostCategories.includes(category.id)}
                          onChange={() => handleHostCategoryChange(category.id)}
                          className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5 mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{category.icon || '🌟'}</span>
                            <span className="font-semibold text-gray-900">{category.name}</span>
                          </div>
                          {category.description && (
                            <p className="text-sm text-gray-600">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                    
                    {hostCategories.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>No host categories available at the moment.</p>
                        <p className="text-sm">Please try again later.</p>
                      </div>
                    )}
                  </div>
                )}
                {errors.hostCategories && <p className="text-red-500 text-xs mt-2">{errors.hostCategories}</p>}
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none transition-colors pr-12 ${
                    errors.password ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                  }`}
                  placeholder="Create password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none transition-colors pr-12 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-200 focus:border-purple-500'
                  }`}
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Terms and Newsletter */}
            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-1"
                />
                <label className="ml-2 text-sm text-gray-600">
                  I agree to the{' '}
                  <Link href="/terms-conditions" className="text-purple-600 hover:text-pink-600">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy-policy" className="text-purple-600 hover:text-pink-600">Privacy Policy</Link>
                </label>
              </div>
              {errors.acceptTerms && <p className="text-red-500 text-xs">{errors.acceptTerms}</p>}

              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-1"
                />
                <label className="ml-2 text-sm text-gray-600">
                  Send me travel tips, exclusive offers, and LocallyTrip updates
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {formData.userType === 'host' ? 'Creating host account...' : 'Creating account...'}
                </div>
              ) : (
                formData.userType === 'host' ? 'Create Host Account 🌟' : 'Create Traveller Account ✈️'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-purple-600 hover:text-pink-600 font-semibold transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Protected by reCAPTCHA and subject to the{' '}
            <Link href="/terms-conditions" className="text-purple-600 hover:text-pink-600">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy-policy" className="text-purple-600 hover:text-pink-600">Privacy Policy</Link>
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
        duration={6000}
      />
    </div>
  );
};

export default RegisterPage;
