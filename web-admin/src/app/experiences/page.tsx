'use client';

import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/contexts/AdminContext';
import AdminNavbar from '@/components/AdminNavbar';
import AuthGuard from '@/components/AuthGuard';
import RejectModal from '@/components/RejectModal';
import { Experience, getExperienceCategoryType } from '../../types/experience-categories';

interface ExperienceStats {
  total: number;
  draft: number;
  pending_review: number;
  published: number;
  rejected: number;
  suspended: number;
}

interface PaginationData {
  total: number;
  pages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const ExperiencesPage = () => {
  const { user } = useAdminAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ExperienceStats | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  
  // Modal states
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedExperienceForReject, setSelectedExperienceForReject] = useState<Experience | null>(null);

  useEffect(() => {
    if (user && ['super_admin', 'admin', 'moderator'].includes(user.role)) {
      fetchExperiences();
      fetchStats();
    }
  }, [selectedStatus, selectedCategory, searchTerm, currentPage, itemsPerPage, user]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, selectedCategory, searchTerm]);

  const fetchExperiences = async () => {
    try {
      const params = new URLSearchParams();
      params.append('includeAllStatuses', 'true');
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());
      if (selectedStatus !== 'all') params.append('status', selectedStatus);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/experiences?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setExperiences(data.data?.experiences || []);
        setPagination(data.data?.pagination || null);
      } else {
        console.error('Failed to fetch experiences:', response.status);
        setExperiences([]);
        setPagination(null);
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setExperiences([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/experiences?includeAllStatuses=true&limit=1000');
      if (response.ok) {
        const data = await response.json();
        const allExperiences = data.data?.experiences || [];
        
        const statsData: ExperienceStats = {
          total: allExperiences.length,
          draft: allExperiences.filter((exp: any) => exp.status === 'draft').length,
          pending_review: allExperiences.filter((exp: any) => exp.status === 'pending_review').length,
          published: allExperiences.filter((exp: any) => exp.status === 'published').length,
          rejected: allExperiences.filter((exp: any) => exp.status === 'rejected').length,
          suspended: allExperiences.filter((exp: any) => exp.status === 'suspended').length,
        };
        
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApproveExperience = async (experienceId: number) => {
    try {
      const response = await fetch(`/api/experiences/${experienceId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await fetchExperiences();
        await fetchStats();
        alert('Experience approved successfully!');
      } else {
        alert('Error approving experience');
      }
    } catch (error) {
      console.error('Error approving experience:', error);
      alert('Error approving experience');
    }
  };

  const handleRejectExperience = async (experienceId: number, experienceTitle?: string) => {
    const experience = experiences.find(exp => exp.id === experienceId);
    setSelectedExperienceForReject(experience || null);
    setShowRejectModal(true);
  };

  const handleConfirmReject = async (reason: string) => {
    if (!selectedExperienceForReject) return;

    try {
      const response = await fetch(`/api/experiences/${selectedExperienceForReject.id}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        await fetchExperiences();
        await fetchStats();
        alert('Experience rejected successfully!');
      } else {
        alert('Error rejecting experience');
      }
    } catch (error) {
      console.error('Error rejecting experience:', error);
      alert('Error rejecting experience');
    }
  };

  const handleSuspendExperience = async (experienceId: number) => {
    if (!confirm('Are you sure you want to suspend this experience? It will be removed from public view.')) {
      return;
    }

    try {
      const response = await fetch(`/api/experiences/${experienceId}/suspend`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await fetchExperiences();
        await fetchStats();
        alert('Experience suspended successfully!');
      } else {
        alert('Error suspending experience');
      }
    } catch (error) {
      console.error('Error suspending experience:', error);
      alert('Error suspending experience');
    }
  };

  const handleViewDetails = (experienceId: number) => {
    // Open in new tab with admin access parameter
    window.open(`http://localhost:3000/experiences/${experienceId}?admin=true`, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'pending_review': return 'bg-purple-100 text-purple-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Safety check: ensure experiences is an array before using reduce
  const safeExperiences = Array.isArray(experiences) ? experiences : [];
  
  const groupedExperiences = safeExperiences.reduce((acc, experience) => {
    const categoryType = getExperienceCategoryType(experience.categoryId);
    if (!acc[categoryType]) {
      acc[categoryType] = [];
    }
    acc[categoryType].push(experience);
    return acc;
  }, {} as Record<string, Experience[]>);

  return (
    <AuthGuard requiredRoles={['admin', 'super_admin', 'moderator']}>
      <div className="min-h-screen bg-gray-50 flex">
        <AdminNavbar />
        
        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Experience Moderation</h1>
              <p className="text-gray-600">Review and approve experiences submitted by hosts</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Experiences</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <span className="text-blue-600 text-xl">🎯</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Published</p>
                    <p className="text-2xl font-bold text-green-600">{stats.published}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <span className="text-green-600 text-xl">✅</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Review</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.pending_review}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <span className="text-purple-600 text-xl">👀</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Draft</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <span className="text-yellow-600 text-xl">📝</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Rejected</p>
                    <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <span className="text-red-600 text-xl">❌</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Suspended</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.suspended}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <span className="text-orange-600 text-xl">⏸️</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="published">Published</option>
                  <option value="rejected">Rejected</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="1">Local Guide</option>
                  <option value="2">Photographer</option>
                  <option value="3">Combo Guide</option>
                  <option value="4">Trip Planner</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Experiences
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title or host name..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Experiences List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Experiences ({safeExperiences.length})
              </h2>
            </div>
            
            <div className="p-6">
              {safeExperiences.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No experiences found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {safeExperiences.map((experience) => (
                    <div key={experience.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{experience.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor((experience as any).status || 'draft')}`}>
                              {(experience as any).status || 'draft'}
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {getExperienceCategoryType(experience.categoryId)}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{experience.shortDescription}</p>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                            <span>💰 IDR {(experience.pricePerPackage ? parseFloat(experience.pricePerPackage).toLocaleString() : 'N/A')}</span>
                            <span>⏱️ {experience.duration || 0} hours</span>
                            <span>👥 {experience.minGuests || 0}-{experience.maxGuests || 0} guests</span>
                            <span>🚶 {experience.walkingDistance || 0}km walk</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              experience.fitnessLevel === 'Easy' ? 'bg-green-100 text-green-800' :
                              experience.fitnessLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {experience.fitnessLevel}
                            </span>
                          </div>

                          {/* Host Information */}
                          {(experience as any).host && (
                            <div className="text-sm text-gray-600 mb-3">
                              <span className="font-medium">Host:</span> {(experience as any).host.name}
                              {(experience as any).city && (
                                <span> • <span className="font-medium">Location:</span> {(experience as any).city.name}</span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 ml-4">
                          {/* Approve Button - Only for pending_review */}
                          {(experience as any).status === 'pending_review' && (
                            <button 
                              onClick={() => handleApproveExperience(experience.id)}
                              className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                            >
                              ✅ Approve
                            </button>
                          )}

                          {/* Reject Button - For draft, pending_review */}
                          {((experience as any).status === 'draft' || (experience as any).status === 'pending_review') && (
                            <button 
                              onClick={() => handleRejectExperience(experience.id, experience.title)}
                              className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                            >
                              ❌ Reject
                            </button>
                          )}

                          {/* Suspend Button - Only for published */}
                          {(experience as any).status === 'published' && (
                            <button 
                              onClick={() => handleSuspendExperience(experience.id)}
                              className="px-4 py-2 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700 transition-colors"
                            >
                              🚫 Suspend
                            </button>
                          )}

                          {/* Reactivate Button - For rejected, suspended */}
                          {((experience as any).status === 'rejected' || (experience as any).status === 'suspended') && (
                            <button 
                              onClick={() => handleApproveExperience(experience.id)}
                              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                            >
                              🔄 Reactivate
                            </button>
                          )}
                          
                          {/* View Details Button - Always available */}
                          <button 
                            onClick={() => handleViewDetails(experience.id)}
                            className="px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
                          >
                            👁️ View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-700">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total} experiences
                    </span>
                    
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                      className="text-sm border border-gray-300 rounded-md px-2 py-1"
                    >
                      <option value={6}>6 per page</option>
                      <option value={12}>12 per page</option>
                      <option value={24}>24 per page</option>
                      <option value={50}>50 per page</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      First
                    </button>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={!pagination.hasPrev}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        let pageNum;
                        if (pagination.pages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= pagination.pages - 2) {
                          pageNum = pagination.pages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-3 py-1 text-sm border rounded-md ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                      disabled={!pagination.hasNext}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                    
                    <button
                      onClick={() => setCurrentPage(pagination.pages)}
                      disabled={currentPage === pagination.pages}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Last
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Reject Modal */}
    <RejectModal
      isOpen={showRejectModal}
      onClose={() => {
        setShowRejectModal(false);
        setSelectedExperienceForReject(null);
      }}
      onConfirm={handleConfirmReject}
      experienceTitle={selectedExperienceForReject?.title}
    />
    </AuthGuard>
  );
};

export default ExperiencesPage;
