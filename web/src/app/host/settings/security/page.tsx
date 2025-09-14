'use client';

import { useState } from 'react';
import { Shield, Smartphone, Computer, AlertTriangle } from 'lucide-react';

export default function SecuritySettingsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const activeSessions = [
    {
      id: 1,
      device: 'MacBook Pro',
      location: 'Jakarta, Indonesia',
      lastActive: '2 minutes ago',
      current: true,
      browser: 'Chrome'
    },
    {
      id: 2,
      device: 'iPhone 15',
      location: 'Jakarta, Indonesia',
      lastActive: '1 hour ago',
      current: false,
      browser: 'Safari'
    }
  ];

  const handleToggleTwoFactor = async () => {
    setLoading(true);
    try {
      // TODO: Implement 2FA toggle
      console.log('Toggling 2FA:', !twoFactorEnabled);
      setTimeout(() => {
        setTwoFactorEnabled(!twoFactorEnabled);
        setMessage(`Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'} successfully`);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setMessage('Failed to update two-factor authentication');
      setLoading(false);
    }
  };

  const handleEndSession = async (sessionId: number) => {
    try {
      // TODO: Implement session termination
      console.log('Ending session:', sessionId);
      setMessage('Session terminated successfully');
    } catch (error) {
      setMessage('Failed to terminate session');
    }
  };

  const handleEndAllSessions = async () => {
    try {
      // TODO: Implement all sessions termination
      console.log('Ending all sessions');
      setMessage('All sessions terminated successfully');
    } catch (error) {
      setMessage('Failed to terminate sessions');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <span>Host Settings</span>
            <span>/</span>
            <span className="text-purple-600">Security & Login</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Security & Login</h1>
          <p className="text-gray-600 mt-2">
            Manage your account security settings and active sessions
          </p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('success') 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-8">
          {/* Two-Factor Authentication */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Two-Factor Authentication</h2>
                  <p className="text-gray-600 mt-1">Add an extra layer of security to your account</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {twoFactorEnabled ? 'Two-factor authentication is enabled' : 'Enable two-factor authentication'}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {twoFactorEnabled 
                      ? 'Your account is protected with two-factor authentication' 
                      : 'Protect your account with an additional security layer'
                    }
                  </p>
                  {twoFactorEnabled && (
                    <div className="mt-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <Shield className="w-4 h-4 mr-1" />
                        Protected
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleToggleTwoFactor}
                  disabled={loading}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    twoFactorEnabled
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {loading ? 'Processing...' : (twoFactorEnabled ? 'Disable' : 'Enable')}
                </button>
              </div>

              {!twoFactorEnabled && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-yellow-800">
                        Enhance your account security
                      </h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Two-factor authentication significantly reduces the risk of unauthorized access to your account.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Login Notifications */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Smartphone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Login Notifications</h2>
                  <p className="text-gray-600 mt-1">Get notified about account activity</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Email notifications for new logins</h3>
                  <p className="text-gray-600 mt-1">Get an email when someone logs into your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Suspicious login alerts</h3>
                  <p className="text-gray-600 mt-1">Get alerted about unusual login attempts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={loginAlerts}
                    onChange={(e) => setLoginAlerts(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Computer className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Active Sessions</h2>
                    <p className="text-gray-600 mt-1">Monitor and manage your logged-in devices</p>
                  </div>
                </div>
                <button
                  onClick={handleEndAllSessions}
                  className="text-red-600 hover:text-red-700 font-medium text-sm"
                >
                  End all sessions
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {activeSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {session.device.includes('MacBook') ? (
                          <Computer className="w-6 h-6 text-gray-600" />
                        ) : (
                          <Smartphone className="w-6 h-6 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{session.device}</h3>
                          {session.current && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Current session
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{session.browser} • {session.location}</p>
                        <p className="text-sm text-gray-500">Last active: {session.lastActive}</p>
                      </div>
                    </div>
                    {!session.current && (
                      <button
                        onClick={() => handleEndSession(session.id)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        End session
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security Tips */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Security Tips</h2>
              <p className="text-gray-600 mt-1">Keep your account secure with these recommendations</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Use a strong, unique password</h4>
                    <p className="text-gray-600 text-sm">Your password should be at least 8 characters long and include numbers, symbols, and both upper and lowercase letters.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Enable two-factor authentication</h4>
                    <p className="text-gray-600 text-sm">Add an extra layer of security to prevent unauthorized access even if your password is compromised.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Keep your account information up to date</h4>
                    <p className="text-gray-600 text-sm">Make sure your email and phone number are current so we can reach you about important account activity.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Log out of public computers</h4>
                    <p className="text-gray-600 text-sm">Always log out completely when using shared or public computers to protect your account.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
