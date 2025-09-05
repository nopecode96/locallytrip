'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/ui/Toast';

// Define interfaces for type safety
interface HostCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface ExperienceType {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface City {
  id: number;
  name: string;
  country?: {
    id: number;
    name: string;
  };
}

interface ItineraryStep {
  stepNumber: number;
  title: string;
  description: string;
  durationMinutes: number;
  location?: string;
}

export default function CreateExperiencePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast, showSuccess, showError, hideToast } = useToast();
  
  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    title: '',
    shortDescription: '',
    description: '',
    categoryId: '',
    experienceTypeId: '',
    cityId: '',
    
    // Step 2: Logistics & Pricing
    duration: 4,
    maxGuests: 10,
    minGuests: 1,
    difficulty: 'Easy',
    fitnessLevel: 'Easy',
    pricePerPackage: '',
    currency: 'IDR',
    meetingPoint: '',
    endingPoint: '',
    walkingDistance: '',
    
    // Step 3: Category-specific
    hostSpecificData: {},
    deliverables: [],
    equipmentUsed: [],
    
    // Step 4: Inclusions
    includedItems: [],
    excludedItems: [],
    
    // Step 5: Itinerary
    itinerary: [] as ItineraryStep[],
    
    // Step 6: Media
    images: []
  });
  
  // Options data
  const [hostCategories, setHostCategories] = useState<HostCategory[]>([]);
  const [experienceTypes, setExperienceTypes] = useState<ExperienceType[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [filteredExperienceTypes, setFilteredExperienceTypes] = useState<ExperienceType[]>([]);
  
  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);
  
  // Filter experience types based on selected category
  useEffect(() => {
    if (formData.categoryId) {
      filterExperienceTypes();
    }
  }, [formData.categoryId, experienceTypes]);
  
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [categoriesRes, typesRes, citiesRes] = await Promise.all([
        fetch('/api/host-categories'),
        fetch('/api/experience-types'),
        fetch('/api/cities')
      ]);
      
      const [categoriesData, typesData, citiesData] = await Promise.all([
        categoriesRes.json(),
        typesRes.json(),
        citiesRes.json()
      ]);
      
      if (categoriesData.success) setHostCategories(categoriesData.data);
      if (typesData.success) setExperienceTypes(typesData.data);
      if (citiesData.success) setCities(citiesData.data);
      
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filterExperienceTypes = () => {
    const categoryId = parseInt(formData.categoryId);
    let filtered: ExperienceType[] = [];
    
    // Filter experience types based on category
    switch (categoryId) {
      case 1: // Local Guide
        filtered = experienceTypes.filter(type => [1, 2, 3, 4].includes(type.id));
        break;
      case 2: // Photographer
        filtered = experienceTypes.filter(type => [5, 6, 7, 8, 9, 10, 11].includes(type.id));
        break;
      case 3: // Combo Guide
        filtered = experienceTypes.filter(type => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].includes(type.id));
        break;
      case 4: // Trip Planner
        filtered = experienceTypes.filter(type => [12, 13, 14, 15, 16].includes(type.id));
        break;
      default:
        filtered = experienceTypes;
    }
    
    setFilteredExperienceTypes(filtered);
    
    // Reset experience type if it's not in the filtered list
    if (formData.experienceTypeId && !filtered.some(t => t.id === parseInt(formData.experienceTypeId))) {
      setFormData(prev => ({ ...prev, experienceTypeId: '' }));
    }
  };
  
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const addToArrayField = (field: 'includedItems' | 'excludedItems' | 'deliverables' | 'equipmentUsed', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };
  
  const removeFromArrayField = (field: 'includedItems' | 'excludedItems' | 'deliverables' | 'equipmentUsed', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };
  
  const addItineraryStep = () => {
    const newStep: ItineraryStep = {
      stepNumber: formData.itinerary.length + 1,
      title: '',
      description: '',
      durationMinutes: 60,
      location: ''
    };
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, newStep]
    }));
  };
  
  const updateItineraryStep = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((step, i) => 
        i === index ? { ...step, [field]: value } : step
      )
    }));
  };
  
  const removeItineraryStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, stepNumber: i + 1 }))
    }));
  };
  
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/experiences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          categoryId: parseInt(formData.categoryId),
          experienceTypeId: parseInt(formData.experienceTypeId),
          cityId: parseInt(formData.cityId),
          pricePerPackage: parseFloat(formData.pricePerPackage),
          hostSpecificData: formData.hostSpecificData,
          deliverables: formData.deliverables,
          equipmentUsed: formData.equipmentUsed,
          includedItems: formData.includedItems,
          excludedItems: formData.excludedItems
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        router.push('/host/experiences?created=success');
      } else {
        showError('Failed to create experience: ' + result.message);
      }
    } catch (error) {
      console.error('Failed to create experience:', error);
      showError('Failed to create experience. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  const getSelectedCategory = () => {
    return hostCategories.find(cat => cat.id === parseInt(formData.categoryId));
  };
  
  const getStepProgress = () => (currentStep / totalSteps) * 100;
  
  if (loading) {
    return (
      <DashboardLayout allowedRoles={['host']}>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading awesome stuff... ✨</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout allowedRoles={['host']}>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-purple-100 z-40">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Create Your Experience ✨
                </h1>
                <p className="text-gray-600 text-sm">Step {currentStep} of {totalSteps}</p>
              </div>
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-sm font-medium">Close</span>
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500 ease-out"
                style={{ width: `${getStepProgress()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
            
            {/* Step Content */}
            <div className="p-8">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's start with the basics! 🚀</h2>
                    <p className="text-gray-600">Tell us about your amazing experience</p>
                  </div>
                  
                  {/* Experience Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Experience Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => updateFormData('title', e.target.value)}
                      placeholder="e.g., Hidden Jakarta Coffee Culture Tour ☕"
                      className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-500 mt-1">Make it catchy and specific! Use emojis to make it pop ✨</p>
                  </div>
                  
                  {/* Short Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quick Hook (Short Description) *
                    </label>
                    <input
                      type="text"
                      value={formData.shortDescription}
                      onChange={(e) => updateFormData('shortDescription', e.target.value)}
                      placeholder="One line that makes people go 'YESSS I need this!' 🔥"
                      className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.shortDescription.length}/500 characters</p>
                  </div>
                  
                  {/* Full Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Story *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => updateFormData('description', e.target.value)}
                      placeholder="Spill all the tea! What makes this experience absolutely incredible? What will they see, feel, taste, discover? Be specific and get them hyped! 🙌"
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400 resize-none"
                    />
                  </div>
                  
                  {/* Host Category Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      What's your vibe? *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hostCategories.map((category) => (
                        <div
                          key={category.id}
                          onClick={() => updateFormData('categoryId', category.id.toString())}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                            formData.categoryId === category.id.toString()
                              ? 'border-purple-500 bg-purple-50 shadow-lg'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                              style={{ backgroundColor: category.color }}
                            >
                              {category.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                              <p className="text-sm text-gray-600">{category.description}</p>
                            </div>
                            {formData.categoryId === category.id.toString() && (
                              <div className="text-purple-500">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Experience Type Selection */}
                  {formData.categoryId && filteredExperienceTypes.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Choose your experience type *
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredExperienceTypes.map((type) => (
                          <div
                            key={type.id}
                            onClick={() => updateFormData('experienceTypeId', type.id.toString())}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              formData.experienceTypeId === type.id.toString()
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900">{type.name}</h4>
                                <p className="text-xs text-gray-500">{type.description}</p>
                              </div>
                              {formData.experienceTypeId === type.id.toString() && (
                                <div className="text-purple-500">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* City Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Where's the magic happening? *
                    </label>
                    <select
                      value={formData.cityId}
                      onChange={(e) => updateFormData('cityId', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900"
                    >
                      <option value="">Select a city</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}{city.country ? `, ${city.country.name}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              
              {/* Step 2: Logistics & Pricing */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's talk logistics! 📋</h2>
                    <p className="text-gray-600">Time, people, and pricing details</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Duration (hours) *
                      </label>
                      <input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => updateFormData('duration', parseInt(e.target.value))}
                        min="1"
                        max="24"
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900"
                      />
                    </div>
                    
                    {/* Max Guests */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Max Guests *
                      </label>
                      <input
                        type="number"
                        value={formData.maxGuests}
                        onChange={(e) => updateFormData('maxGuests', parseInt(e.target.value))}
                        min="1"
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900"
                      />
                    </div>
                    
                    {/* Min Guests */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Min Guests *
                      </label>
                      <input
                        type="number"
                        value={formData.minGuests}
                        onChange={(e) => updateFormData('minGuests', parseInt(e.target.value))}
                        min="1"
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900"
                      />
                    </div>
                    
                    {/* Difficulty */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Difficulty Level *
                      </label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => updateFormData('difficulty', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900"
                      >
                        <option value="Easy">Easy 😎 (Anyone can do it)</option>
                        <option value="Moderate">Moderate 🚶 (Some walking required)</option>
                        <option value="Challenging">Challenging 🏃 (Need to be fit)</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Pricing */}
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="text-green-500 mr-2">💰</span>
                      Pricing Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Price per Package *
                        </label>
                        <input
                          type="number"
                          value={formData.pricePerPackage}
                          onChange={(e) => updateFormData('pricePerPackage', e.target.value)}
                          placeholder="0"
                          className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Currency *
                        </label>
                        <select
                          value={formData.currency}
                          onChange={(e) => updateFormData('currency', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors text-gray-900"
                        >
                          <option value="IDR">IDR (Indonesian Rupiah)</option>
                          <option value="USD">USD (US Dollar)</option>
                          <option value="EUR">EUR (Euro)</option>
                          <option value="SGD">SGD (Singapore Dollar)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Location Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="text-blue-500 mr-2">📍</span>
                      Location Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Meeting Point *
                        </label>
                        <textarea
                          value={formData.meetingPoint}
                          onChange={(e) => updateFormData('meetingPoint', e.target.value)}
                          placeholder="Where should guests meet you? Be specific! Include landmarks, addresses, or notable features."
                          rows={3}
                          className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400 resize-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Ending Point (if different)
                        </label>
                        <input
                          type="text"
                          value={formData.endingPoint}
                          onChange={(e) => updateFormData('endingPoint', e.target.value)}
                          placeholder="Where does the experience end? (Optional)"
                          className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Walking Distance (km)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.walkingDistance}
                          onChange={(e) => updateFormData('walkingDistance', e.target.value)}
                          placeholder="0.0"
                          className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Placeholder for other steps */}
              {currentStep > 2 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🚧</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Step {currentStep} Coming Soon!</h2>
                  <p className="text-gray-600">We're building something awesome here...</p>
                </div>
              )}
            </div>
            
            {/* Navigation */}
            <div className="bg-gray-50 px-8 py-6 flex items-center justify-between border-t border-gray-200">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back</span>
              </button>
              
              <div className="flex items-center space-x-2">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index + 1 <= currentStep ? 'bg-purple-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              {currentStep === totalSteps ? (
                <button
                  onClick={handleSubmit}
                  disabled={submitLoading || !formData.title || !formData.categoryId || !formData.description}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {submitLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Experience</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && (!formData.title || !formData.categoryId || !formData.description)) ||
                    (currentStep === 2 && (!formData.pricePerPackage || !formData.meetingPoint))
                  }
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span>Continue</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </DashboardLayout>
  );
}
