'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Key, Eye, EyeOff, Shield, Check, X } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useToast } from '../../../../contexts/ToastContext';

interface PasswordStrength {
  score: number;
  feedback: string[];
  color: string;
}

export default function HostPasswordSettingsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return null;
  }

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One uppercase letter');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One lowercase letter');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('One number');
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One special character');
    }

    let color = 'from-red-500 to-red-600';
    if (score >= 3) color = 'from-yellow-500 to-orange-500';
    if (score >= 4) color = 'from-green-500 to-green-600';

    return { score, feedback, color };
  };

  const passwordStrength = calculatePasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return false;
    }

    if (passwordStrength.score < 3) {
      showToast('Password is too weak. Please follow the requirements.', 'error');
      return false;
    }

    setIsLoading(true);
    
    try {
      // Get token from localStorage - AuthGuard already ensures user is authenticated
      const token = localStorage.getItem('auth_token');
      if (!token) {
        showToast('Session expired. Please refresh the page.', 'error');
        setIsLoading(false);
        return false;
      }

      const response = await fetch('/api/auth/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast('Password updated successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(data.message || 'Failed to update password', 'error');
      }
    } catch (error) {
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
    
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
              <Key className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Change Password</h1>
          </div>
          <p className="text-gray-600">
            Keep your host account secure with a strong password
          </p>
        </div>

        {/* Security Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Password Security Tips</h3>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• Use a unique password that you don't use elsewhere</li>
                <li>• Make it at least 8 characters long</li>
                <li>• Include uppercase, lowercase, numbers, and symbols</li>
                <li>• Avoid personal information like names or dates</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current Password */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Password Strength</span>
                      <span className={`font-medium ${
                        passwordStrength.score >= 4 ? 'text-green-600' :
                        passwordStrength.score >= 3 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {passwordStrength.score >= 4 ? 'Strong' :
                         passwordStrength.score >= 3 ? 'Good' : 'Weak'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      ></div>
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <div className="text-sm text-gray-600">
                        <span>Missing: {passwordStrength.feedback.join(', ')}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      confirmPassword && newPassword !== confirmPassword 
                        ? 'border-red-300 bg-red-50' 
                        : confirmPassword && newPassword === confirmPassword 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300'
                    }`}
                    placeholder="Confirm your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <X className="w-4 h-4" />
                    <span>Passwords do not match</span>
                  </p>
                )}
                {confirmPassword && newPassword === confirmPassword && (
                  <p className="mt-2 text-sm text-green-600 flex items-center space-x-1">
                    <Check className="w-4 h-4" />
                    <span>Passwords match</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading || newPassword !== confirmPassword || passwordStrength.score < 3}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Updating Password...</span>
                    </div>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Additional Security Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Security</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Enable
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h4 className="font-medium text-gray-900">Login Notifications</h4>
                <p className="text-sm text-gray-600">Get notified when someone logs into your account</p>
              </div>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">
                Enabled
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
