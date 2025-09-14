// ...existing code...
'use client';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Heart, UserPlus, MapPin, Star, Shield, Clock, MessageCircle, Instagram, Camera, Zap, Calendar, ChevronLeft, ExternalLink, BookOpen, Award, Globe } from 'lucide-react';
import { SimpleImage } from '@/components/SimpleImage';
import ExperienceCard from '@/components/ExperienceCard';
import ExperienceSkeleton from '@/components/ExperienceSkeleton';
import { QuickContactButtons, CommunicationContactList } from '@/components/CommunicationContacts';
import { useHost, useHostExperiences, useHostReviews, useHostStories } from '@/hooks/useHost';
import { extractHostIdFromSlug } from '@/utils/slugUtils';
import Footer from '@/components/Footer';

// Additional types for reviews and stories
interface Review {
  id: string;
  travelerName: string;
  travelerAvatar: string;
  rating: number;
  comment: string;
  date: string;
  experienceTitle?: string;
}

interface Story {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  publishedAt: string;
  readTime: string;
  slug: string;
}

export default function HostDetailPage() {
  const params = useParams();
  const hostId = params?.slug as string;

  // Extract UUID from slug (supports both old UUID-only format and new name-uuid format)
  const extractedHostId = extractHostIdFromSlug(hostId);

  // Use custom hooks
  const { host, loading: hostLoading, error } = useHost(extractedHostId);
  const { experiences, loading: experiencesLoading } = useHostExperiences(extractedHostId);
  const { reviews, loading: reviewsLoading, error: reviewsError } = useHostReviews(extractedHostId);
  const { stories, loading: storiesLoading } = useHostStories(extractedHostId);

  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'experiences' | 'reviews' | 'stories' | 'about'>('experiences');

  const loading = hostLoading || experiencesLoading || reviewsLoading || storiesLoading;

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: API call to like/unlike host
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: API call to follow/unfollow host
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="space-y-4">
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !host) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Host Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The host you are looking for does not exist.'}</p>
          <Link href="/hosts" className="text-blue-600 hover:text-blue-800">
            ← Back to All Hosts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/hosts" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Hosts
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Host Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <SimpleImage
                    imagePath={host.avatar}
                    alt={host.name}
                    className="w-20 h-20 rounded-full object-cover"
                    placeholderType="profile"
                    name={host.name}
                  />
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h1 className="text-2xl font-bold text-gray-900">{host.name}</h1>
                      {host.verified && (
                        <Shield className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{host.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{host.rating} ({host.reviewCount} reviews)</span>
                      </div>
                    </div>
                    <p className="text-gray-700">{host.bio}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleLike}
                    className={`p-2 rounded-full ${isLiked ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'} hover:bg-red-50 hover:text-red-600`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleFollow}
                    className={`px-4 py-2 rounded-lg font-medium ${isFollowing ? 'bg-gray-100 text-gray-700' : 'bg-blue-600 text-white'} hover:bg-blue-700`}
                  >
                    <UserPlus className="w-4 h-4 inline mr-2" />
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>

              {/* Quick Contact Buttons */}
              {host.communicationContacts && host.communicationContacts.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Contact</h3>
                  <QuickContactButtons 
                    contacts={host.communicationContacts} 
                    maxButtons={5}
                    size="md"
                  />
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  {['experiences', 'reviews', 'stories', 'about'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'experiences' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Experiences by {host.name}</h3>
                    {experiencesLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2].map((i) => (
                          <ExperienceSkeleton key={i} />
                        ))}
                      </div>
                    ) : experiences?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {experiences.map((experience) => (
                          <ExperienceCard 
                            key={experience.id} 
                            experience={{
                              ...experience,
                              coverImage: experience.coverImage || undefined
                            }} 
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No experiences available yet.</p>
                    )}
                  </div>
                )}

                {activeTab === 'about' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">About {host.name}</h3>
                      <p className="text-gray-700">{host.bio}</p>
                    </div>
                    
                    {host.languages && host.languages.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Languages</h4>
                        <div className="flex flex-wrap gap-2">
                          {host.languages.map((lang) => (
                            <span
                              key={lang.id}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                              {lang.name} ({lang.proficiency})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {host.categories && host.categories.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Specialties</h4>
                        <div className="flex flex-wrap gap-2">
                          {host.categories.map((category) => (
                            <span
                              key={category.id}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                            >
                              {category.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Host Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Host Information</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member since</span>
                  <span className="font-medium">
                    {new Date(host.memberSince).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Response rate</span>
                  <span className="font-medium">{host.responseRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Response time</span>
                  <span className="font-medium">{host.responseTime}h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total experiences</span>
                  <span className="font-medium">{host.toursCount}</span>
                </div>
              </div>
            </div>

            {/* Communication Contacts */}
            {host.communicationContacts && host.communicationContacts.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <CommunicationContactList
                  contacts={host.communicationContacts}
                  title="Contact Host"
                  size="sm"
                  showContactValues={false}
                  emptyMessage="No contact methods available"
                />
              </div>
            )}

            {/* Contact Host Button */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                <MessageCircle className="w-5 h-5 inline mr-2" />
                Message Host
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
