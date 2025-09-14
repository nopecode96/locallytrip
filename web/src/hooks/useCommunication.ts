import { useState, useEffect, useCallback } from 'react';
import { 
  CommunicationApp, 
  UserCommunicationContact, 
  FormattedUserContact,
  CreateContactRequest 
} from '@/types/communication';
import { CommunicationService } from '@/services/communicationService';

/**
 * Hook for managing communication apps
 */
export const useCommunicationApps = () => {
  const [apps, setApps] = useState<CommunicationApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await CommunicationService.getCommunicationApps();
        setApps(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch communication apps');
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  return { apps, loading, error, refetch: () => setLoading(true) };
};

/**
 * Hook for managing user communication contacts
 */
export const useUserContacts = (userId: number | null, includePrivate: boolean = false) => {
  const [contacts, setContacts] = useState<UserCommunicationContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await CommunicationService.getUserContacts(userId, includePrivate);
      setContacts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [userId, includePrivate]);

  return { 
    contacts, 
    loading, 
    error, 
    refetch: fetchContacts 
  };
};

/**
 * Hook for managing formatted user communication contacts
 */
export const useFormattedUserContacts = (
  userId: number | null, 
  includePrivate: boolean = false
) => {
  const [contacts, setContacts] = useState<FormattedUserContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await CommunicationService.getFormattedUserContacts(userId, includePrivate);
      setContacts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  }, [userId, includePrivate]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return { contacts, loading, error, refetch: fetchContacts };
};

/**
 * Hook for getting host communication contacts after successful booking
 */
export const useHostContactsForBooking = (bookingId: string | null) => {
  const [data, setData] = useState<{
    hostName: string;
    hostId: string;
    bookingId: string;
    contacts: FormattedUserContact[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHostContacts = useCallback(async () => {
    if (!bookingId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await CommunicationService.getHostContactsForBooking(bookingId);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch host contacts');
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchHostContacts();
  }, [fetchHostContacts]);

  return { 
    hostData: data, 
    loading, 
    error, 
    refetch: fetchHostContacts 
  };
};

/**
 * Hook for managing communication contact operations
 */
export const useCommunicationContacts = (userId: number | null) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addContact = async (contactData: CreateContactRequest, authToken?: string) => {
    if (!userId) throw new Error('User ID is required');

    try {
      setLoading(true);
      setError(null);
      const result = await CommunicationService.addOrUpdateContact(userId, contactData, authToken);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add contact';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateContact = async (contactData: CreateContactRequest, authToken?: string) => {
    if (!userId) throw new Error('User ID is required');

    try {
      setLoading(true);
      setError(null);
      const result = await CommunicationService.addOrUpdateContact(userId, contactData, authToken);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update contact';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (contactId: number, authToken?: string) => {
    if (!userId) throw new Error('User ID is required');

    try {
      setLoading(true);
      setError(null);
      await CommunicationService.deleteContact(userId, contactId, authToken);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete contact';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addContact,
    updateContact,
    deleteContact,
    loading,
    error,
    clearError: () => setError(null)
  };
};

/**
 * Hook for getting popular communication apps
 */
export const usePopularCommunicationApps = () => {
  const [apps, setApps] = useState<CommunicationApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularApps = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await CommunicationService.getPopularApps();
        setApps(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch popular apps');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularApps();
  }, []);

  return { apps, loading, error };
};
