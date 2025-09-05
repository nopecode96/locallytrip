// ...existing code...
'use client';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Heart, UserPlus, MapPin, Star, Shield, Clock, MessageCircle, Instagram, Camera, Zap, Calendar, ChevronLeft, ExternalLink, BookOpen, Award, Globe } from 'lucide-react';
import { SimpleImage } from '@/components/SimpleImage';
import ExperienceCard from '@/components/ExperienceCard';
import ExperienceSkeleton from '@/components/ExperienceSkeleton';
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

  // ...existing code...
}
// ...existing code...
