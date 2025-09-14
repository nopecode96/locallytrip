import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/authAPI';

interface NotificationPreferences {
  booking_confirmations: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  payment_updates: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  messages: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  reviews: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  favorites: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  promotions: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  newsletter: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

interface GlobalSettings {
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  marketingConsent: boolean;
  marketingConsentDate: string | null;
}

interface NotificationSettingsData {
  preferences: NotificationPreferences;
  globalSettings: GlobalSettings;
  metadata: {
    id: number;
    uuid: string;
    userId: number;
    updatedAt: string;
  };
}

interface UseNotificationSettingsReturn {
  settings: NotificationSettingsData | null;
  loading: boolean;
  error: string | null;
  updateSettings: (preferences: Partial<NotificationPreferences>, globalSettings?: Partial<GlobalSettings>) => Promise<boolean>;
  resetSettings: () => Promise<boolean>;
  refetch: () => Promise<void>;
}

export const useNotificationSettings = (): UseNotificationSettingsReturn => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSettingsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const token = authAPI.getToken();
      const response = await fetch('/api/notifications/settings', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch notification settings');
      }

      if (data.success) {
        setSettings(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch notification settings');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching notification settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (
    preferences: Partial<NotificationPreferences>, 
    globalSettings?: Partial<GlobalSettings>
  ): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const token = authAPI.getToken();
      const response = await fetch('/api/notifications/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences,
          globalSettings,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update notification settings');
      }

      if (data.success) {
        setSettings(data.data);
        return true;
      } else {
        throw new Error(data.message || 'Failed to update notification settings');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error updating notification settings:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = async (): Promise<boolean> => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const token = authAPI.getToken();
      const response = await fetch('/api/notifications/settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reset',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset notification settings');
      }

      if (data.success) {
        // Refetch settings after reset
        await fetchSettings();
        return true;
      } else {
        throw new Error(data.message || 'Failed to reset notification settings');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error resetting notification settings:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchSettings();
  };

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  return {
    settings,
    loading,
    error,
    updateSettings,
    resetSettings,
    refetch,
  };
};
