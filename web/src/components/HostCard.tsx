'use client';

import React from 'react';
import Link from 'next/link';
import { Star, MapPin, Camera, Calendar, Users, Crown, Award, Globe } from 'lucide-react';
import { SimpleImage } from '@/components/SimpleImage';
import { Host } from '@/hooks/useHosts';

interface HostCardProps {
  host: Host;
  isFeatured?: boolean;
}

// Instagram Style Card Layout
const HostCard: React.FC<HostCardProps> = ({ host, isFeatured = false }) => {
  const getSpecialtyIcon = (specialty: string) => {
    switch (specialty.toLowerCase()) {
      case 'photographer':
      case 'photography':
        return <Camera className="w-3 h-3" />;
      case 'tour guide':
      case 'guide':
        return <Users className="w-3 h-3" />;
      case 'trip planner':
      case 'planner':
        return <Calendar className="w-3 h-3" />;
      default:
        return <Star className="w-3 h-3" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    const badges = {
      'Photographer': 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 border-pink-200',
      'Tour Guide': 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200',
      'Local Guide': 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200',
      'Trip Planner': 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border-orange-200',
    };
    return badges[category as keyof typeof badges] || 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-200';
  };

  return (
    <Link 
      href={`/hosts/${host.slug}`}
      className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:scale-[1.02] hover:-translate-y-3"
    >
      {/* Header Image Section */}
      <div className="relative h-32 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
        </div>
        
        {isFeatured && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-white/90 backdrop-blur-sm text-orange-600 px-3 py-1.5 rounded-full text-xs font-bold flex items-center shadow-lg">
              <Crown className="w-3 h-3 mr-1" />
              FEATURED
            </div>
          </div>
        )}

        <div className="absolute -bottom-12 left-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden group-hover:scale-105 transition-transform duration-300">
              <SimpleImage
                imagePath={host.avatar}
                alt={host.name}
                className="w-full h-full object-cover"
                placeholderType="profile"
                name={host.name}
              />
            </div>
            
            {host.rating >= 4.8 && (
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1.5 shadow-lg">
                <Award className="w-3 h-3 text-white" />
              </div>
            )}
            
            <div className={`absolute -bottom-2 -right-2 px-2 py-1 rounded-lg text-xs font-semibold border-2 border-white shadow-md ${getCategoryBadge(host.category)}`}>
              <div className="flex items-center space-x-1">
                {getSpecialtyIcon(host.category)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-16 pb-6 px-6">
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300 line-clamp-1">
              {host.name}
            </h3>
            <div className="flex items-center bg-yellow-50 px-2.5 py-1 rounded-lg ml-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-semibold text-sm text-gray-900">{host.rating}</span>
              <span className="text-xs text-gray-500 ml-1">({host.reviewCount})</span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-1 text-purple-500" />
            <span>{host.city ? `${host.city.name}, ${host.city.country.name}` : host.location}</span>
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-2 leading-relaxed">
          {host.bio}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {host.specialties.slice(0, 1).map((specialty, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 text-xs font-medium rounded-full border border-purple-200"
            >
              {getSpecialtyIcon(specialty)}
              <span className="ml-1">{specialty}</span>
            </span>
          ))}
          
          {host.languages && host.languages.length > 0 && 
            host.languages.slice(0, 2).map((language) => (
              <span 
                key={language.id}
                className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200"
                title={`${language.name} (${language.proficiency})`}
              >
                <Globe className="w-3 h-3 mr-1" />
                {language.name}
              </span>
            ))
          }
          
          {(host.specialties.length > 1 || (host.languages && host.languages.length > 2)) && (
            <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              +{(host.specialties.length - 1) + ((host.languages?.length || 0) - 2)} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div>
            <div className="text-purple-600 font-bold text-lg">
              {host.startFromPrice && host.startFromPrice > 0 
                ? `Start From IDR ${host.startFromPrice.toLocaleString('id-ID')}`
                : 'Contact for pricing'
              }
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">
              {host.experienceCount || 0} experience{(host.experienceCount || 0) !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HostCard;
