'use client';

import { useState, useEffect } from 'react';
import AuthGuard from '@/components/AuthGuard';
import AdminNavbar from '@/components/AdminNavbar';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import SimpleImage from '@/components/SimpleImage';
import { useToast } from '@/contexts/ToastContext';

interface Host {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
  bio?: string;
  verified?: boolean;
  location?: string;
}

interface FeaturedHost {
  id: number;
  hostId: number;
  name: string;
  title: string;
  description: string;
  badge: string;
  profilePicture?: string;
  isActive: boolean;
  displayOrder: number;
  isVerified?: boolean;
  location?: string;
}

interface FeaturedHostFormData {
  hostId: number | null;
  title: string;
  description: string;
  badge: string;
  displayOrder: number;
  isActive: boolean;
}

const initialFormData: FeaturedHostFormData = {
  hostId: null,
  title: '',
  description: '',
  badge: 'Expert Host',
  displayOrder: 0,
  isActive: true,
};

// Available badge options for quick selection
const badgeOptions = [
  { value: 'Expert Host', label: 'Expert Host' },
  { value: 'Top Rated', label: 'Top Rated' },
  { value: 'Local Guide', label: 'Local Guide' },
  { value: 'Cultural Expert', label: 'Cultural Expert' },
  { value: 'Adventure Specialist', label: 'Adventure Specialist' },
  { value: 'Photography Expert', label: 'Photography Expert' },
  { value: 'Food Specialist', label: 'Food Specialist' },
  { value: 'Heritage Guide', label: 'Heritage Guide' },
];

export default function FeaturedHostsPage() {
  // State management
  const [featuredHosts, setFeaturedHosts] = useState<FeaturedHost[]>([]);
  const [availableHosts, setAvailableHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHost, setEditingHost] = useState<FeaturedHost | null>(null);
  const [formData, setFormData] = useState<FeaturedHostFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingHost, setDeletingHost] = useState<{ id: number; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toggle status state
  const [togglingStatusId, setTogglingStatusId] = useState<number | null>(null);

  // Autocomplete state
  const [hostSearchQuery, setHostSearchQuery] = useState('');
  const [showHostDropdown, setShowHostDropdown] = useState(false);
  const [selectedHostForDisplay, setSelectedHostForDisplay] = useState<Host | null>(null);

  // Toast notification
  const { showToast } = useToast();

  // API base URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Fetch featured hosts from database
  const fetchFeaturedHosts = async () => {
    try {
      const response = await fetch(`${API_URL}/featured-hosts`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch featured hosts');
      }
      
      const result = await response.json();
      
      // Handle both formats: wrapped response or direct data
      if (result.success) {
        setFeaturedHosts(result.data || []);
      } else if (Array.isArray(result.data)) {
        setFeaturedHosts(result.data);
      } else if (Array.isArray(result)) {
        setFeaturedHosts(result);
      } else {
        setFeaturedHosts([]);
      }
    } catch (error) {
      console.error('Error fetching featured hosts:', error);
      setError('Failed to load featured hosts');
    }
  };

  // Fetch hosts from database (for autocomplete)
  const fetchHosts = async (search = '') => {
    try {
      const queryParams = search ? `?search=${encodeURIComponent(search)}` : '';
      const response = await fetch(`${API_URL}/hosts${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch hosts');
      }
      
      const result = await response.json();
      
      // Handle both formats: direct data array or wrapped response
      if (result.success) {
        setAvailableHosts(result.data || []);
      } else if (Array.isArray(result.data)) {
        setAvailableHosts(result.data);
      } else if (Array.isArray(result)) {
        setAvailableHosts(result);
      } else {
        setAvailableHosts([]);
      }
    } catch (error) {
      console.error('Error fetching hosts:', error);
      setAvailableHosts([]);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          fetchFeaturedHosts(),
          fetchHosts()
        ]);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Debounced search for hosts
  useEffect(() => {
    if (hostSearchQuery.length >= 2) {
      const timeoutId = setTimeout(() => {
        fetchHosts(hostSearchQuery);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else if (hostSearchQuery.length === 0) {
      fetchHosts();
    }
  }, [hostSearchQuery]);

  const handleCreate = () => {
    setEditingHost(null);
    setFormData(initialFormData);
    setHostSearchQuery('');
    setSelectedHostForDisplay(null);
    setShowHostDropdown(false);
    setIsModalOpen(true);
  };

  const handleEdit = (featuredHost: FeaturedHost) => {
    setEditingHost(featuredHost);
    setFormData({
      hostId: featuredHost.hostId,
      title: featuredHost.title,
      description: featuredHost.description || '',
      badge: featuredHost.badge || 'Expert Host',
      displayOrder: featuredHost.displayOrder,
      isActive: featuredHost.isActive,
    });
    
    // Set the selected host for display
    const selectedHost = availableHosts.find(h => h.id === featuredHost.hostId);
    if (selectedHost) {
      setSelectedHostForDisplay(selectedHost);
      setHostSearchQuery(selectedHost.name);
    }
    
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Frontend validation
    if (!formData.hostId) {
      showToast('Please select a host', 'warning');
      return;
    }
    
    if (!formData.title || formData.title.trim() === '') {
      showToast('Title is required', 'warning');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const requestData = {
        hostId: formData.hostId,
        title: formData.title,
        description: formData.description,
        badge: formData.badge,
        displayOrder: formData.displayOrder,
        isActive: formData.isActive
      };
      
      let response;
      if (editingHost) {
        // Update existing featured host
        response = await fetch(`${API_URL}/featured-hosts/${editingHost.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
      } else {
        // Create new featured host
        response = await fetch(`${API_URL}/featured-hosts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh the featured hosts list
        await fetchFeaturedHosts();
        
        // Close modal and reset form
        setIsModalOpen(false);
        setEditingHost(null);
        setFormData(initialFormData);
        setHostSearchQuery('');
        setSelectedHostForDisplay(null);
        setShowHostDropdown(false);
        
        showToast(
          editingHost 
            ? 'Featured host updated successfully!' 
            : 'Featured host created successfully!',
          'success'
        );
      } else {
        throw new Error(result.message || 'Failed to save featured host');
      }
    } catch (error) {
      console.error('Error saving featured host:', error);
      showToast('Error saving featured host: ' + (error as Error).message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    setDeletingHost({ id, name });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingHost) return;
    
    try {
      setIsDeleting(true);
      
      const response = await fetch(`${API_URL}/featured-hosts/${deletingHost.id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh the featured hosts list
        await fetchFeaturedHosts();
        showToast('Featured host deleted successfully!', 'success');
      } else {
        throw new Error(result.message || 'Failed to delete featured host');
      }
      
      setIsDeleteModalOpen(false);
      setDeletingHost(null);
    } catch (error) {
      console.error('Error deleting featured host:', error);
      showToast('Error deleting featured host: ' + (error as Error).message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingHost(null);
  };

  const handleToggleStatus = async (id: number) => {
    try {
      setTogglingStatusId(id);
      
      // First, get current featured host data
      const currentHost = featuredHosts.find(h => h.id === id);
      if (!currentHost) {
        throw new Error('Featured host not found');
      }
      
      // Toggle the status
      const updatedData = {
        hostId: currentHost.hostId,
        title: currentHost.title,
        description: currentHost.description,
        badge: currentHost.badge,
        displayOrder: currentHost.displayOrder,
        isActive: !currentHost.isActive // Toggle the status
      };
      
      const response = await fetch(`${API_URL}/featured-hosts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh the featured hosts list
        await fetchFeaturedHosts();
        showToast(`Status ${!currentHost.isActive ? 'activated' : 'deactivated'} successfully!`, 'success');
      } else {
        throw new Error(result.message || 'Failed to toggle status');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      showToast('Error toggling status: ' + (error as Error).message, 'error');
    } finally {
      setTogglingStatusId(null);
    }
  };

  if (loading) {
    return (
      <AuthGuard requiredRoles={["admin", "super_admin", "marketing"]}>
        <div className="min-h-screen bg-gray-50 flex">
          <AdminNavbar />
          <div className="flex-1 lg:ml-0 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading featured hosts...</p>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard requiredRoles={["admin", "super_admin", "marketing"]}>
        <div className="min-h-screen bg-gray-50 flex">
          <AdminNavbar />
          <div className="flex-1 lg:ml-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600">Error: {error}</p>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requiredRoles={["admin", "super_admin", "marketing"]}>
      <div className="min-h-screen bg-gray-50 flex">
        <AdminNavbar />
        <div className="flex-1 lg:ml-0">
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Featured Hosts</h1>
                <p className="text-gray-600 mt-2">Manage featured hosts displayed on the homepage</p>
              </div>
              <button
                onClick={handleCreate}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Featured Host
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="grid gap-4">
                  {featuredHosts && featuredHosts.length > 0 ? (
                    featuredHosts.map((featuredHost) => (
                      <div key={featuredHost.id} className="border rounded-lg p-4 flex flex-col lg:flex-row lg:items-center justify-between space-y-3 lg:space-y-0">
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                            {featuredHost.profilePicture ? (
                              <SimpleImage 
                                imagePath={featuredHost.profilePicture} 
                                alt={featuredHost.name}
                                className="w-full h-full object-cover rounded-full"
                                category="users/avatars"
                              />
                            ) : (
                              <span className="text-gray-500 text-xl">👤</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-gray-900">{featuredHost.name}</h3>
                              {featuredHost.isVerified && (
                                <span className="text-blue-500" title="Verified Host">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </span>
                              )}
                            </div>
                            <p className="text-blue-600 text-sm font-medium">{featuredHost.title}</p>
                            <p className="text-gray-600 text-sm mt-1">{featuredHost.description}</p>
                            <div className="flex items-center space-x-3 mt-2">
                              <span className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {featuredHost.badge}
                              </span>
                              <span className="inline-flex items-center text-gray-500 text-xs">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                                Order: {featuredHost.displayOrder}
                              </span>
                              {featuredHost.location && (
                                <span className="inline-flex items-center text-gray-500 text-xs">
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                  </svg>
                                  {featuredHost.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs self-start ${featuredHost.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {featuredHost.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <div className="flex flex-wrap items-center gap-1">
                            {/* Toggle Status Button */}
                            <button
                              onClick={() => handleToggleStatus(featuredHost.id)}
                              disabled={togglingStatusId === featuredHost.id}
                              className={`px-3 py-1 rounded text-xs font-medium transition-colors inline-flex items-center ${
                                togglingStatusId === featuredHost.id
                                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                  : featuredHost.isActive 
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                              title={featuredHost.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {togglingStatusId === featuredHost.id ? (
                                <>
                                  <svg className="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  <span className="hidden sm:inline">Updating...</span>
                                  <span className="sm:hidden">...</span>
                                </>
                              ) : (
                                <>
                                  <span className="hidden sm:inline">{featuredHost.isActive ? 'Deactivate' : 'Activate'}</span>
                                  <span className="sm:hidden">{featuredHost.isActive ? 'Off' : 'On'}</span>
                                </>
                              )}
                            </button>
                            
                            {/* Edit Button */}
                            <button
                              onClick={() => handleEdit(featuredHost)}
                              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-xs font-medium"
                              title="Edit featured host"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            
                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(featuredHost.id, featuredHost.name)}
                              className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-xs font-medium"
                              title="Delete featured host"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No featured hosts found</p>
                      <button
                        onClick={handleCreate}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add First Featured Host
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for Add/Edit Category */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingHost ? 'Edit Featured Host' : 'Add New Featured Host'}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Host Selection with Autocomplete */}
                  <div className="relative">
                    <label htmlFor="hostSearch" className="block text-sm font-medium text-gray-700 mb-1">
                      Select Host *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="hostSearch"
                        value={hostSearchQuery}
                        onChange={(e) => {
                          setHostSearchQuery(e.target.value);
                          setShowHostDropdown(true);
                          // Clear selection if search changes
                          if (e.target.value !== selectedHostForDisplay?.name) {
                            setFormData({ ...formData, hostId: null });
                            setSelectedHostForDisplay(null);
                          }
                        }}
                        onFocus={() => setShowHostDropdown(true)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search hosts by name or email..."
                        disabled={!!editingHost}
                        autoComplete="off"
                      />
                      
                      {/* Selected host display */}
                      {selectedHostForDisplay && (
                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                              {selectedHostForDisplay.avatar ? (
                                <SimpleImage 
                                  imagePath={selectedHostForDisplay.avatar} 
                                  alt={selectedHostForDisplay.name}
                                  className="w-full h-full object-cover rounded-full"
                                  category="users/avatars"
                                />
                              ) : (
                                <span className="text-gray-500 text-sm">👤</span>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{selectedHostForDisplay.name}</p>
                              <p className="text-sm text-gray-600">{selectedHostForDisplay.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {selectedHostForDisplay.verified && (
                              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                ✓ Verified
                              </span>
                            )}
                          </div>
                          {!editingHost && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedHostForDisplay(null);
                                setFormData({ ...formData, hostId: null });
                                setHostSearchQuery('');
                                setShowHostDropdown(false);
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      )}
                      
                      {/* Dropdown with host options */}
                      {showHostDropdown && !editingHost && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {availableHosts.length > 0 ? (
                            availableHosts
                              .filter(host => 
                                host.name.toLowerCase().includes(hostSearchQuery.toLowerCase()) ||
                                host.email.toLowerCase().includes(hostSearchQuery.toLowerCase())
                              )
                              .map((host) => (
                                <button
                                  key={host.id}
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, hostId: host.id });
                                    setSelectedHostForDisplay(host);
                                    setHostSearchQuery(host.name);
                                    setShowHostDropdown(false);
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                      {host.avatar ? (
                                        <SimpleImage 
                                          imagePath={host.avatar} 
                                          alt={host.name}
                                          className="w-full h-full object-cover rounded-full"
                                          category="users/avatars"
                                        />
                                      ) : (
                                        <span className="text-gray-500 text-sm">👤</span>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900">{host.name}</p>
                                      <p className="text-sm text-gray-600">{host.email}</p>
                                      {host.bio && (
                                        <p className="text-xs text-gray-500 mt-1 truncate">{host.bio}</p>
                                      )}
                                    </div>
                                    {host.verified && (
                                      <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                        ✓ Verified
                                      </span>
                                    )}
                                  </div>
                                </button>
                              ))
                          ) : (
                            <div className="px-4 py-3 text-gray-500 text-center">
                              No hosts found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {editingHost && (
                      <p className="text-sm text-gray-500 mt-1">
                        Cannot change host when editing. Create a new featured host entry instead.
                      </p>
                    )}
                    
                    {/* Click outside to close dropdown */}
                    {showHostDropdown && (
                      <div 
                        className="fixed inset-0 z-0" 
                        onClick={() => setShowHostDropdown(false)}
                      />
                    )}
                  </div>

                  {/* Title Field */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Cultural Guide & Local Expert"
                    />
                  </div>

                  {/* Description Field */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Brief description of the host's expertise..."
                    />
                  </div>

                  {/* Badge Selection */}
                  <div>
                    <label htmlFor="badge" className="block text-sm font-medium text-gray-700 mb-1">
                      Badge
                    </label>
                    <select
                      id="badge"
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {badgeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status and Display Order */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Active</span>
                      </label>
                    </div>
                    
                    <div>
                      <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 mb-1">
                        Display Order
                      </label>
                      <input
                        type="number"
                        id="displayOrder"
                        value={formData.displayOrder}
                        onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Saving...' : (editingHost ? 'Update Featured Host' : 'Create Featured Host')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Hapus Featured Host"
          categoryName={deletingHost?.name || ''}
          isLoading={isDeleting}
          description="Featured host akan dihapus dari tampilan homepage."
        />
      </div>
    </AuthGuard>
  );
}