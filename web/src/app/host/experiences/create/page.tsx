'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import { useCitiesAutocomplete } from '@/hooks/useCitiesAutocomplete';
import Toast from '@/components/ui/Toast';
import { authAPI } from '@/services/authAPI';

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
  country: string;
  displayName?: string;
}

interface HostSpecificData {
  // Local Tour Guide specific
  languages?: string;
  transportationIncluded?: boolean;
  groupSizePreference?: string;
  
  // Photographer specific
  photographyStyle?: string;
  editedPhotosCount?: number;
  editingTimelineDays?: number;
  rawPhotosIncluded?: boolean;
  cameraEquipment?: string;
  additionalEquipment?: string;
  propsAccessories?: string;
  
  // Trip Planner specific
  maxRevisions?: number;
  planningTimelineDays?: number;
  pdfDeliveryMethod?: string;
  designSoftware?: string;
  researchTools?: string;
  
  // Tour Guide tools
  communicationTools?: string;
  navigationTools?: string;
  
  // Delivery settings
  deliveryTimeline?: string;
  deliveryMethod?: string;
  customTimeline?: string;
}

interface ItineraryStep {
  stepNumber: number;
  title: string;
  description: string;
  time: string; // e.g., "09:00 - 10:30"
  durationMinutes: number;
  location: string;
}

export default function CreateExperiencePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast, showSuccess, showError, hideToast } = useToast();
  
  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  
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
    
    // Step 3: Category-specific (combined: hostSpecificData + equipmentUsed + deliverables)
    hostSpecificData: {} as HostSpecificData,
    deliverables: [],
    equipmentUsed: [],
    
    // Step 4: Inclusions
    includedItems: [],
    excludedItems: [],
    
    // Step 5: Itinerary/Design Steps + Media + Final Review
    itinerary: [] as ItineraryStep[],
    images: [] as File[] // Store File objects, will be processed on submit
  });
  
  // User data
  const [userLanguages, setUserLanguages] = useState<string[]>([]);
  
  // Options data
  const [hostCategories, setHostCategories] = useState<HostCategory[]>([]);
  const [experienceTypes, setExperienceTypes] = useState<ExperienceType[]>([]);
  const [filteredExperienceTypes, setFilteredExperienceTypes] = useState<ExperienceType[]>([]);
  const [userHostCategories, setUserHostCategories] = useState<HostCategory[]>([]);
  const [experienceTypeSearch, setExperienceTypeSearch] = useState('');
  const [showExperienceTypeDropdown, setShowExperienceTypeDropdown] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  
  // Use cities autocomplete hook
  const { cities, loading: citiesLoading, searchCities } = useCitiesAutocomplete();
  
  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
    fetchUserProfile();
  }, []);
  
  // Filter experience types based on selected category
  useEffect(() => {
    // Show all experience types instead of filtering
    setFilteredExperienceTypes(experienceTypes);
  }, [experienceTypes]);

  // Filter experience types based on search
  const getFilteredExperienceTypes = () => {
    if (!experienceTypeSearch) return experienceTypes;
    
    return experienceTypes.filter(type => 
      type.name.toLowerCase().includes(experienceTypeSearch.toLowerCase()) ||
      type.description.toLowerCase().includes(experienceTypeSearch.toLowerCase())
    );
  };

  // Filter cities based on search - now handled by the hook
  const getFilteredCities = () => {
    return cities; // Hook already handles filtering
  };

  const handleExperienceTypeSelect = (type: ExperienceType) => {
    updateFormData('experienceTypeId', type.id.toString());
    setExperienceTypeSearch(type.name);
    setShowExperienceTypeDropdown(false);
  };

  const handleCitySelect = (city: City) => {
    updateFormData('cityId', city.id.toString());
    setCitySearch(city.displayName || `${city.name}, ${city.country}`);
    setShowCityDropdown(false);
  };

  const getSelectedExperienceType = () => {
    return experienceTypes.find(type => type.id.toString() === formData.experienceTypeId);
  };

  const getSelectedCity = () => {
    return cities.find(city => city.id.toString() === formData.cityId);
  };

  // Image handling functions
  const handleImageUpload = (files: File[]) => {
    const validFiles = files.filter(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        showError(`${file.name} is not a valid image file`);
        return false;
      }
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showError(`${file.name} is too large. Please keep images under 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...validFiles]
      }));
      showSuccess(`${validFiles.length} image(s) added successfully`);
    }
  };

  // Wrapper function for input onChange event
  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleImageUpload(Array.from(files));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    showSuccess('Image removed');
  };
  
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [categoriesRes, typesRes] = await Promise.all([
        fetch('/api/host-categories'),
        fetch('/api/experience-types')
      ]);
      
      const [categoriesData, typesData] = await Promise.all([
        categoriesRes.json(),
        typesRes.json()
      ]);
      
      if (categoriesData.success) setHostCategories(categoriesData.data);
      if (typesData.success) setExperienceTypes(typesData.data);
      
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success && data.data.hostCategories) {
        setUserHostCategories(data.data.hostCategories);
        
        // Set user languages if available
        if (data.data.languages && data.data.languages.length > 0) {
          const languageNames = data.data.languages.map((lang: any) => lang.name);
          setUserLanguages(languageNames);
          
          // Auto-populate languages in hostSpecificData for relevant categories
          setFormData(prev => ({
            ...prev,
            hostSpecificData: {
              ...prev.hostSpecificData,
              languages: languageNames.join(', ')
            }
          }));
        }
        
        // Auto-select category if only one exists
        if (data.data.hostCategories.length === 1) {
          setFormData(prev => ({ 
            ...prev, 
            categoryId: data.data.hostCategories[0].id.toString() 
          }));
        } else if (data.data.hostCategories.length > 1) {
          // If multiple categories, set primary as default if exists
          const primaryCategory = data.data.hostCategories.find((cat: any) => cat.UserHostCategory?.isPrimary);
          if (primaryCategory) {
            setFormData(prev => ({ 
              ...prev, 
              categoryId: primaryCategory.id.toString() 
            }));
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };  const updateFormData = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-set default values for Trip Planner when category is selected
      if (field === 'categoryId' && value) {
        const selectedCategory = hostCategories.find(cat => cat.id.toString() === value);
        if (selectedCategory?.name === 'Trip Planner') {
          // Set default values that make sense for Trip Planner
          newData.minGuests = 1; // Always 1 for consultation
          newData.fitnessLevel = 'Easy'; // No physical activity
          newData.walkingDistance = '0'; // No walking involved
          newData.endingPoint = ''; // Not applicable for virtual consultation
        }
      }
      
      return newData;
    });
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
      time: '',
      durationMinutes: 60,
      location: ''
    };
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, newStep]
    }));
  };

  const addDefaultTripPlannerSteps = () => {
    const defaultSteps: ItineraryStep[] = [
      {
        stepNumber: 1,
        title: 'Consultation & Preferences Gathering',
        description: 'Online meeting/chat (WhatsApp/Zoom/Telegram).\nDiscuss traveller type (solo, couple, family, group).\nIdentify interests: nature, culinary, shopping, culture, adventure.\nDefine budget range and travel duration.',
        time: '2 days',
        durationMinutes: 48, // 2 days = 48 hours
        location: 'Initial Consultation'
      },
      {
        stepNumber: 2,
        title: 'Research & Local Insights',
        description: 'Curate must-visit attractions and hidden gems.\nCheck updated schedules (opening hours, ticket prices).\nSuggest transport options (car rental, Grab, public transport).\nSelect recommended cafés, restaurants, and accommodation.',
        time: '2 days',
        durationMinutes: 48, // 2 days = 48 hours
        location: 'Research & Planning'
      }
    ];
    
    setFormData(prev => ({
      ...prev,
      itinerary: defaultSteps
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
  
  const handleSubmit = async (submitForReview = true) => {
    setSubmitLoading(true);
    try {
      const token = authAPI.getToken();
      
      if (!token) {
        showError('Authentication required. Please login again.');
        return;
      }

      if (!user || user.role !== 'host') {
        showError('Only hosts can create experiences.');
        return;
      }
      
      console.log('Submitting experience with token:', token ? 'Present' : 'Missing');
      console.log('User role:', user?.role);
      console.log('Images count:', formData.images.length);
      console.log('Full token value:', token?.substring(0, 20) + '...');
      console.log('Form data being submitted:', {
        title: formData.title,
        description: formData.description,
        categoryId: formData.categoryId,
        cityId: formData.cityId,
        pricePerPackage: formData.pricePerPackage,
        duration: formData.duration,
        maxGuests: formData.maxGuests,
        minGuests: formData.minGuests,
        meetingPoint: formData.meetingPoint,
        submitForReview
      });
      
      // Create FormData for file upload
      const submitFormData = new FormData();
      
      // Add basic experience data
      submitFormData.append('title', formData.title);
      submitFormData.append('description', formData.description);
      submitFormData.append('shortDescription', formData.shortDescription);
      submitFormData.append('categoryId', formData.categoryId);
      submitFormData.append('experienceTypeId', formData.experienceTypeId);
      submitFormData.append('cityId', formData.cityId);
      submitFormData.append('pricePerPackage', formData.pricePerPackage);
      submitFormData.append('duration', formData.duration.toString());
      submitFormData.append('maxGuests', formData.maxGuests.toString());
      submitFormData.append('minGuests', formData.minGuests.toString());
      submitFormData.append('location', formData.meetingPoint);
      submitFormData.append('meetingPoint', formData.meetingPoint);
      submitFormData.append('endingPoint', formData.endingPoint);
      submitFormData.append('difficulty', formData.difficulty);
      submitFormData.append('fitnessLevel', formData.fitnessLevel);
      submitFormData.append('walkingDistance', formData.walkingDistance.toString());
      
      // Add arrays as JSON strings
      submitFormData.append('included', JSON.stringify(formData.includedItems));
      submitFormData.append('excluded', JSON.stringify(formData.excludedItems));
      submitFormData.append('deliverables', JSON.stringify(formData.deliverables));
      submitFormData.append('equipmentUsed', JSON.stringify(formData.equipmentUsed));
      submitFormData.append('itinerary', JSON.stringify(formData.itinerary));
      submitFormData.append('hostSpecificData', JSON.stringify(formData.hostSpecificData));
      
      // Set status based on user choice
      submitFormData.append('status', submitForReview ? 'pending_review' : 'draft');
      
      // Add image files
      formData.images.forEach((file, index) => {
        submitFormData.append(`images`, file);
      });

      console.log('Submitting FormData with files:', formData.images.length); // Debug log

      const response = await fetch('/api/experiences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type - let browser handle it for FormData
        },
        body: submitFormData
      });
      
      const result = await response.json();
      console.log('Backend response:', result);
      
      if (result.success) {
        if (submitForReview) {
          showSuccess('Experience submitted for review successfully! You\'ll be notified once it\'s approved.');
        } else {
          showSuccess('Experience saved as draft successfully! You can submit it for review later from your experiences page.');
        }
        setTimeout(() => {
          router.push('/host/experiences');
        }, 2000);
      } else {
        console.error('Validation errors:', result.errors);
        const errorMessage = result.errors && result.errors.length > 0 
          ? `Validation failed: ${result.errors.map((e: any) => e.msg).join(', ')}`
          : result.message || 'Failed to create experience';
        showError('Failed to create experience: ' + errorMessage);
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

  const getSelectedCategoryName = () => {
    const selectedCategory = getSelectedCategory();
    return selectedCategory?.name || '';
  };
  
  // Helper function to determine if category requires itinerary
  const categoryRequiresItinerary = () => {
    const categoryName = getSelectedCategoryName();
    return categoryName === 'Local Tour Guide' || 
           categoryName === 'Trip Planner' || 
           categoryName.includes('Combo'); // Combo includes tour guiding
  };
  
  const getStepProgress = () => (currentStep / totalSteps) * 100;
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading awesome stuff... ✨</p>
        </div>
      </div>
    );
  }
  
  // Debug logging
  console.log(`Debug: currentStep=${currentStep}, totalSteps=${totalSteps}, showing buttons: ${currentStep === totalSteps ? 'dual' : 'continue'}`);
  
  return (
    <>
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
                  
                  {/* Host Category Selection/Display */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Your Host Category {userHostCategories.length > 1 ? '(Choose One) *' : ''}
                    </label>
                    
                    {userHostCategories.length > 0 ? (
                      <div className="space-y-3">
                        {userHostCategories.length === 1 ? (
                          // Single category - display only
                          <div className="p-4 rounded-xl border-2 border-purple-500 bg-purple-50 shadow-lg">
                            <div className="flex items-start space-x-3">
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                style={{ backgroundColor: '#8B5CF6' }}
                              >
                                {userHostCategories[0].name.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-semibold text-gray-900">{userHostCategories[0].name}</h3>
                                  <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">
                                    Your Category
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{userHostCategories[0].description}</p>
                                <p className="text-xs text-purple-600 mt-2 font-medium">
                                  ✨ Your experience will be created under this category
                                </p>
                              </div>
                              <div className="text-purple-500">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Multiple categories - allow selection
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {userHostCategories.map((category: any) => (
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
                                    style={{ backgroundColor: '#8B5CF6' }}
                                  >
                                    {category.name.charAt(0)}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                                      {category.UserHostCategory?.isPrimary && (
                                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">
                                          Primary
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
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
                        )}
                        
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-700">
                            <span className="font-medium">💡 Tip:</span> Your experience must align with your host category. 
                            This ensures travelers get exactly what they expect when booking with you!
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-700">
                          <span className="font-medium">⚠️ Notice:</span> No host category found. 
                          Please complete your host profile setup first.
                        </p>
                      </div>
                    )}
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
                  
                  {/* Experience Type Selection - Autocomplete */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Choose your experience type *
                    </label>
                    
                    {/* Autocomplete Input */}
                    <div className="relative">
                      <div className="relative">
                        <input
                          type="text"
                          value={experienceTypeSearch}
                          onChange={(e) => {
                            setExperienceTypeSearch(e.target.value);
                            setShowExperienceTypeDropdown(true);
                          }}
                          onFocus={() => setShowExperienceTypeDropdown(true)}
                          placeholder="Search for experience type... (e.g., food, photo, adventure)"
                          className="w-full px-4 py-3 pr-10 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Dropdown Options */}
                      {showExperienceTypeDropdown && (
                        <>
                          {/* Backdrop */}
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setShowExperienceTypeDropdown(false)}
                          />
                          
                          {/* Dropdown Menu */}
                          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
                            {getFilteredExperienceTypes().length > 0 ? (
                              <>
                                <div className="p-3 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                                  <p className="text-xs font-medium text-gray-600">
                                    {getFilteredExperienceTypes().length} experience types available
                                  </p>
                                </div>
                                
                                {getFilteredExperienceTypes().map((type, index) => (
                                  <div
                                    key={type.id}
                                    onClick={() => handleExperienceTypeSelect(type)}
                                    className={`px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 border-b border-gray-50 last:border-b-0 ${
                                      formData.experienceTypeId === type.id.toString() 
                                        ? 'bg-gradient-to-r from-purple-100 to-blue-100 border-purple-200' 
                                        : ''
                                    } ${index === getFilteredExperienceTypes().length - 1 ? 'rounded-b-xl' : ''}`}
                                  >
                                    <div className="flex items-start space-x-3">
                                      {/* Icon */}
                                      <div 
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md"
                                        style={{ backgroundColor: type.color || '#8B5CF6' }}
                                      >
                                        <i className={type.icon || 'fa-star'}></i>
                                      </div>
                                      
                                      {/* Content */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2">
                                          <h4 className="font-semibold text-gray-900 text-sm truncate">
                                            {type.name}
                                          </h4>
                                          {formData.experienceTypeId === type.id.toString() && (
                                            <div className="text-purple-500 flex-shrink-0">
                                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                              </svg>
                                            </div>
                                          )}
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                          {type.description}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </>
                            ) : (
                              <div className="p-6 text-center">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-3-1V8m0 4v3" />
                                  </svg>
                                </div>
                                <p className="text-sm text-gray-500">No experience types found</p>
                                <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    
                    {/* Selected Experience Type Details */}
                    {formData.experienceTypeId && getSelectedExperienceType() && (
                      <div className="mt-3 p-4 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border border-purple-200 rounded-xl">
                        <div className="flex items-start space-x-3">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg"
                            style={{ backgroundColor: getSelectedExperienceType()?.color || '#8B5CF6' }}
                          >
                            <i className={getSelectedExperienceType()?.icon || 'fa-star'}></i>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-bold text-gray-900">{getSelectedExperienceType()?.name}</h4>
                              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">
                                Selected
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                              {getSelectedExperienceType()?.description}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setFormData(prev => ({ ...prev, experienceTypeId: '' }));
                              setExperienceTypeSearch('');
                            }}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title="Clear selection"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-2">
                      💡 Start typing to search through all {experienceTypes.length} available experience types
                    </p>
                  </div>
                  
                  {/* City Selection - Autocomplete */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Where's the magic happening? *
                    </label>
                    
                    {/* Autocomplete Input */}
                    <div className="relative">
                      <div className="relative">
                        <input
                          type="text"
                          value={citySearch}
                          onChange={(e) => {
                            setCitySearch(e.target.value);
                            searchCities(e.target.value);
                            setShowCityDropdown(true);
                          }}
                          onFocus={() => setShowCityDropdown(true)}
                          placeholder="Search for a city... (e.g., Jakarta, Bali, Bandung)"
                          className="w-full px-4 py-3 pr-10 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414a1 1 0 00-1.414 0L7.757 16.657m0 0a8 8 0 111.414-1.414m-1.414 1.414L5.636 14.636M17.657 16.657L19.071 18.071" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Dropdown Options */}
                      {showCityDropdown && (
                        <>
                          {/* Backdrop */}
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setShowCityDropdown(false)}
                          />
                          
                          {/* Dropdown Menu */}
                          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
                            {getFilteredCities().length > 0 ? (
                              <>
                                <div className="p-3 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                                  <p className="text-xs font-medium text-gray-600">
                                    {getFilteredCities().length} cities available
                                  </p>
                                </div>
                                
                                {getFilteredCities().map((city, index) => (
                                  <div
                                    key={city.id}
                                    onClick={() => handleCitySelect(city)}
                                    className={`px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 border-b border-gray-50 last:border-b-0 ${
                                      formData.cityId === city.id.toString() 
                                        ? 'bg-gradient-to-r from-green-100 to-blue-100 border-green-200' 
                                        : ''
                                    } ${index === getFilteredCities().length - 1 ? 'rounded-b-xl' : ''}`}
                                  >
                                    <div className="flex items-start space-x-3">
                                      {/* Location Icon */}
                                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-500 text-white font-bold text-sm flex-shrink-0 shadow-md">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                      
                                      {/* Content */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2">
                                          <h4 className="font-semibold text-gray-900 text-sm">
                                            {city.name}
                                          </h4>
                                          {formData.cityId === city.id.toString() && (
                                            <div className="text-green-500 flex-shrink-0">
                                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                              </svg>
                                            </div>
                                          )}
                                        </div>
                                        {city.country && (
                                          <p className="text-xs text-gray-600 mt-1 flex items-center">
                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 2v8H4V6h12z" clipRule="evenodd" />
                                            </svg>
                                            {city.country}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </>
                            ) : (
                              <div className="p-6 text-center">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-3-1V8m0 4v3" />
                                  </svg>
                                </div>
                                <p className="text-sm text-gray-500">No cities found</p>
                                <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    
                    {/* Selected City Details */}
                    {formData.cityId && getSelectedCity() && (
                      <div className="mt-3 p-4 bg-gradient-to-r from-green-50 via-blue-50 to-teal-50 border border-green-200 rounded-xl">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-500 text-white font-bold text-sm flex-shrink-0 shadow-lg">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-bold text-gray-900">{getSelectedCity()?.name}</h4>
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">
                                Selected
                              </span>
                            </div>
                            {getSelectedCity()?.country && (
                              <p className="text-sm text-gray-700 mt-1 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 2v8H4V6h12z" clipRule="evenodd" />
                                </svg>
                                {getSelectedCity()?.country && (
                                  typeof getSelectedCity()?.country === 'string' 
                                    ? getSelectedCity()?.country 
                                    : (getSelectedCity()?.country as any)?.name
                                )}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              setFormData(prev => ({ ...prev, cityId: '' }));
                              setCitySearch('');
                            }}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title="Clear selection"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-2">
                      🌍 Search through all available cities and countries
                    </p>
                  </div>
                  
                  {/* User Languages Section */}
                  {userLanguages.length > 0 && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Your Available Languages
                      </label>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium text-blue-800">
                            Languages from your profile
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {userLanguages.map((language, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                            >
                              {language}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-blue-600 mt-2">
                          💡 These languages will be automatically included in your experience
                        </p>
                      </div>
                    </div>
                  )}
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
                        {getSelectedCategoryName() === 'Trip Planner' 
                          ? 'Consultation Duration (hours) *' 
                          : 'Duration (hours) *'
                        }
                      </label>
                      <input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => updateFormData('duration', parseInt(e.target.value))}
                        min="1"
                        max="24"
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900"
                      />
                      {getSelectedCategoryName() === 'Trip Planner' && (
                        <p className="text-xs text-gray-500 mt-1">
                          💬 Duration for consultation session with the traveller
                        </p>
                      )}
                    </div>
                    
                    {/* Max Guests */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {getSelectedCategoryName() === 'Trip Planner' 
                          ? 'Max Participants in Consultation *' 
                          : 'Max Guests *'
                        }
                      </label>
                      <input
                        type="number"
                        value={formData.maxGuests}
                        onChange={(e) => updateFormData('maxGuests', parseInt(e.target.value))}
                        min="1"
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900"
                      />
                      {getSelectedCategoryName() === 'Trip Planner' && (
                        <p className="text-xs text-gray-500 mt-1">
                          👥 Maximum people who can join the planning consultation
                        </p>
                      )}
                    </div>
                    
                    {/* Min Guests - Hide for Trip Planner */}
                    {getSelectedCategoryName() !== 'Trip Planner' && (
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
                    )}
                    
                    {/* Difficulty - Modify for Trip Planner */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {getSelectedCategoryName() === 'Trip Planner' 
                          ? 'Service Complexity *' 
                          : 'Difficulty Level *'
                        }
                      </label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => updateFormData('difficulty', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900"
                      >
                        {getSelectedCategoryName() === 'Trip Planner' ? (
                          <>
                            <option value="Easy">Basic Planning 📝 (Simple city itinerary)</option>
                            <option value="Moderate">Advanced Planning 🗺️ (Multi-city or themed trip)</option>
                            <option value="Challenging">Complex Planning 🌍 (Multi-country or specialized needs)</option>
                          </>
                        ) : (
                          <>
                            <option value="Easy">Easy 😎 (Anyone can do it)</option>
                            <option value="Moderate">Moderate 🚶 (Some walking required)</option>
                            <option value="Challenging">Challenging 🏃 (Need to be fit)</option>
                          </>
                        )}
                      </select>
                    </div>

                    {/* Fitness Level - Hide for Trip Planner */}
                    {getSelectedCategoryName() !== 'Trip Planner' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Required Fitness Level *
                        </label>
                        <select
                          value={formData.fitnessLevel}
                          onChange={(e) => updateFormData('fitnessLevel', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900"
                        >
                          <option value="Beginner">Beginner 🌱 (No fitness required)</option>
                          <option value="Basic">Basic 💪 (Basic fitness level)</option>
                          <option value="Intermediate">Intermediate 🏋️ (Regular exercise)</option>
                          <option value="Advanced">Advanced 🏆 (Athletic fitness)</option>
                        </select>
                      </div>
                    )}
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
                      {getSelectedCategoryName() === 'Trip Planner' 
                        ? 'Consultation Details' 
                        : 'Location Details'
                      }
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {getSelectedCategoryName() === 'Trip Planner' 
                            ? 'Meeting Method & Location *' 
                            : 'Meeting Point *'
                          }
                        </label>
                        <textarea
                          value={formData.meetingPoint}
                          onChange={(e) => updateFormData('meetingPoint', e.target.value)}
                          placeholder={getSelectedCategoryName() === 'Trip Planner' 
                            ? "How will you conduct the consultation? (e.g., Video call via Zoom, In-person at cafe in Central Jakarta, etc.)"
                            : "Where should guests meet you? Be specific! Include landmarks, addresses, or notable features."
                          }
                          rows={3}
                          className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400 resize-none"
                        />
                        {getSelectedCategoryName() === 'Trip Planner' && (
                          <p className="text-xs text-gray-500 mt-1">
                            💡 Specify if online/offline consultation and provide details
                          </p>
                        )}
                      </div>
                      
                      {/* Ending Point - Hide for Trip Planner */}
                      {getSelectedCategoryName() !== 'Trip Planner' && (
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
                      )}
                      
                      {/* Walking Distance - Hide for Trip Planner */}
                      {getSelectedCategoryName() !== 'Trip Planner' && (
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
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 3: Category Configuration (hostSpecificData + equipmentUsed + deliverables + inclusions) */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure Your Service ⚙️</h2>
                    <p className="text-gray-600">Customize settings, equipment, deliverables, and inclusions for your experience</p>
                  </div>

                  {!formData.categoryId && (
                    <div className="text-center py-16">
                      <div className="text-6xl mb-4">⚠️</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Please Select a Category First</h3>
                      <p className="text-gray-600">Go back to Step 1 and select your host category to continue.</p>
                    </div>
                  )}

                  {/* Local Tour Guide */}
                  {getSelectedCategoryName() === 'Local Tour Guide' && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                          Tour Guide Settings
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Languages Offered
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., English, Bahasa Indonesia, Mandarin"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={formData.hostSpecificData.languages || ''}
                              onChange={(e) => updateFormData('hostSpecificData', {
                                ...formData.hostSpecificData,
                                languages: e.target.value
                              })}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Transportation Included
                            </label>
                            <select
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={formData.hostSpecificData.transportationIncluded ? 'true' : 'false'}
                              onChange={(e) => updateFormData('hostSpecificData', {
                                ...formData.hostSpecificData,
                                transportationIncluded: e.target.value === 'true'
                              })}
                            >
                              <option value="false">No Transportation</option>
                              <option value="true">Transportation Included</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Group Size Preference
                            </label>
                            <select
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={formData.hostSpecificData.groupSizePreference || 'small'}
                              onChange={(e) => updateFormData('hostSpecificData', {
                                ...formData.hostSpecificData,
                                groupSizePreference: e.target.value
                              })}
                            >
                              <option value="small">Small Groups (1-4 people)</option>
                              <option value="medium">Medium Groups (5-8 people)</option>
                              <option value="large">Large Groups (9+ people)</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Payment Release
                            </label>
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-sm text-green-700">
                                Payment will be released 1 day after tour completion
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Photographer */}
                  {getSelectedCategoryName() === 'Photographer' && (
                    <div className="space-y-6">
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                          Photography Settings
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Photography Style
                            </label>
                            <select
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              value={formData.hostSpecificData.photographyStyle || ''}
                              onChange={(e) => updateFormData('hostSpecificData', {
                                ...formData.hostSpecificData,
                                photographyStyle: e.target.value
                              })}
                            >
                              <option value="">Select Style</option>
                              <option value="pre-wedding">Pre-wedding</option>
                              <option value="family">Family</option>
                              <option value="city">City</option>
                              <option value="portrait">Portrait</option>
                              <option value="lifestyle">Lifestyle</option>
                              <option value="documentary">Documentary</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Number of Edited Photos
                            </label>
                            <input
                              type="number"
                              placeholder="e.g., 50"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              value={formData.hostSpecificData.editedPhotosCount || ''}
                              onChange={(e) => updateFormData('hostSpecificData', {
                                ...formData.hostSpecificData,
                                editedPhotosCount: parseInt(e.target.value)
                              })}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Editing Timeline (Days)
                            </label>
                            <input
                              type="number"
                              placeholder="e.g., 7"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              value={formData.hostSpecificData.editingTimelineDays || ''}
                              onChange={(e) => updateFormData('hostSpecificData', {
                                ...formData.hostSpecificData,
                                editingTimelineDays: parseInt(e.target.value)
                              })}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Raw Photos Included
                            </label>
                            <select
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              value={formData.hostSpecificData.rawPhotosIncluded ? 'true' : 'false'}
                              onChange={(e) => updateFormData('hostSpecificData', {
                                ...formData.hostSpecificData,
                                rawPhotosIncluded: e.target.value === 'true'
                              })}
                            >
                              <option value="false">Edited Photos Only</option>
                              <option value="true">Include Raw Photos</option>
                            </select>
                          </div>
                          
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Payment Release
                            </label>
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <p className="text-sm text-yellow-700">
                                Payment will be released after photos are delivered and confirmed received by traveller
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Trip Planner */}
                  {getSelectedCategoryName() === 'Trip Planner' && (
                    <div className="space-y-6">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                          Trip Planning Settings
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Maximum Revisions Allowed
                            </label>
                            <input
                              type="number"
                              placeholder="e.g., 3"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              value={formData.hostSpecificData.maxRevisions || ''}
                              onChange={(e) => updateFormData('hostSpecificData', {
                                ...formData.hostSpecificData,
                                maxRevisions: parseInt(e.target.value)
                              })}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Planning Timeline (Days)
                            </label>
                            <input
                              type="number"
                              placeholder="e.g., 5"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              value={formData.hostSpecificData.planningTimelineDays || ''}
                              onChange={(e) => updateFormData('hostSpecificData', {
                                ...formData.hostSpecificData,
                                planningTimelineDays: parseInt(e.target.value)
                              })}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              PDF Delivery Method
                            </label>
                            <select
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              value={formData.hostSpecificData.pdfDeliveryMethod || 'email'}
                              onChange={(e) => updateFormData('hostSpecificData', {
                                ...formData.hostSpecificData,
                                pdfDeliveryMethod: e.target.value
                              })}
                            >
                              <option value="email">Email Delivery</option>
                              <option value="platform">Platform Download</option>
                              <option value="both">Both Email & Platform</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Payment Release
                            </label>
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-sm text-blue-700">
                                Payment will be released after PDF itinerary is downloaded by traveller
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Combo (Tour Guide + Photographer) */}
                  {getSelectedCategoryName().includes('Combo') && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                          Combo Service Settings
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tour Languages
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., English, Bahasa Indonesia"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              value={formData.hostSpecificData.languages || ''}
                              onChange={(e) => updateFormData('hostSpecificData', {
                                ...formData.hostSpecificData,
                                languages: e.target.value
                              })}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Photography Style
                            </label>
                            <select
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              value={formData.hostSpecificData.photographyStyle || ''}
                              onChange={(e) => updateFormData('hostSpecificData', {
                                ...formData.hostSpecificData,
                                photographyStyle: e.target.value
                              })}
                            >
                              <option value="">Select Style</option>
                              <option value="city">City Tour Photography</option>
                              <option value="lifestyle">Lifestyle</option>
                              <option value="documentary">Documentary</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Edited Photos Included
                            </label>
                            <input
                              type="number"
                              placeholder="e.g., 30"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              value={formData.hostSpecificData.editedPhotosCount || ''}
                              onChange={(e) => updateFormData('hostSpecificData', {
                                ...formData.hostSpecificData,
                                editedPhotosCount: parseInt(e.target.value)
                              })}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Photo Delivery Timeline
                            </label>
                            <input
                              type="number"
                              placeholder="e.g., 7"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              value={formData.hostSpecificData.editingTimelineDays || ''}
                              onChange={(e) => updateFormData('hostSpecificData', {
                                ...formData.hostSpecificData,
                                editingTimelineDays: parseInt(e.target.value)
                              })}
                            />
                          </div>
                          
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Payment Release
                            </label>
                            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                              <p className="text-sm text-orange-700">
                                Payment will be released after photos are delivered and confirmed received by traveller
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Equipment Used Section */}
                  {formData.categoryId && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment & Tools</h3>
                      <p className="text-gray-600 mb-4">
                        {getSelectedCategoryName() === 'Trip Planner' 
                          ? 'Specify the software, tools, and resources you use for trip planning and research'
                          : `Specify the equipment and tools you'll use for your ${getSelectedCategoryName().toLowerCase()} services`
                        }
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder={getSelectedCategoryName() === 'Trip Planner' 
                                ? 'e.g., Google Maps Pro, TripAdvisor, Canva, Adobe Illustrator, Local travel databases'
                                : 'e.g., Canon EOS R5, DJI Drone, Professional lighting kit'
                              }
                              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                  addToArrayField('equipmentUsed', e.currentTarget.value.trim());
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                if (input.value.trim()) {
                                  addToArrayField('equipmentUsed', input.value.trim());
                                  input.value = '';
                                }
                              }}
                              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
                            >
                              Add
                            </button>
                          </div>
                          
                          {formData.equipmentUsed.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                {getSelectedCategoryName() === 'Trip Planner' ? 'Tools & Software List:' : 'Equipment List:'}
                              </h4>
                              <div className="space-y-2">
                                {formData.equipmentUsed.map((item, index) => (
                                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                                    <span className="text-gray-900">{item}</span>
                                    <button
                                      onClick={() => removeFromArrayField('equipmentUsed', index)}
                                      className="text-red-500 hover:text-red-700 font-medium text-sm"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Deliverables Section */}
                  {formData.categoryId && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">What You'll Deliver</h3>
                      <p className="text-blue-700 mb-4">
                        {getSelectedCategoryName() === 'Trip Planner' 
                          ? 'List the specific documents and materials travelers will receive from your planning service'
                          : 'List the specific outcomes and deliverables guests will receive'
                        }
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder={getSelectedCategoryName() === 'Trip Planner' 
                                ? 'e.g., Detailed PDF itinerary, Restaurant recommendations, Transportation guide, Budget breakdown'
                                : 'e.g., 50 edited photos, PDF itinerary, location recommendations'
                              }
                              className="flex-1 px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                  addToArrayField('deliverables', e.currentTarget.value.trim());
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                if (input.value.trim()) {
                                  addToArrayField('deliverables', input.value.trim());
                                  input.value = '';
                                }
                              }}
                              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                            >
                              Add
                            </button>
                          </div>
                          
                          {formData.deliverables.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-semibold text-blue-700 mb-2">Deliverables List:</h4>
                              <div className="space-y-2">
                                {formData.deliverables.map((item, index) => (
                                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-blue-200">
                                    <span className="text-gray-900">{item}</span>
                                    <button
                                      onClick={() => removeFromArrayField('deliverables', index)}
                                      className="text-red-500 hover:text-red-700 font-medium text-sm"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Inclusions & Exclusions Section */}
                  {formData.categoryId && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-green-900 mb-4">What's Included & Excluded</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Included Items */}
                        <div>
                          <h4 className="text-md font-semibold text-green-800 mb-3">✅ What's Included</h4>
                          <div className="space-y-3">
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                placeholder={getSelectedCategoryName() === 'Trip Planner' 
                                  ? 'e.g., Consultation session, PDF itinerary, Restaurant list, Contact details'
                                  : 'e.g., Professional equipment, Photo editing, Travel guide'
                                }
                                className="flex-1 px-3 py-2 border border-green-300 rounded-lg focus:border-green-500 focus:outline-none text-sm"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                    addToArrayField('includedItems', e.currentTarget.value.trim());
                                    e.currentTarget.value = '';
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                  if (input.value.trim()) {
                                    addToArrayField('includedItems', input.value.trim());
                                    input.value = '';
                                  }
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                              >
                                Add
                              </button>
                            </div>
                            
                            {formData.includedItems.length > 0 && (
                              <div className="space-y-2">
                                {formData.includedItems.map((item, index) => (
                                  <div key={index} className="flex items-center justify-between bg-white p-2 rounded border border-green-200">
                                    <span className="text-sm text-gray-900">{item}</span>
                                    <button
                                      onClick={() => removeFromArrayField('includedItems', index)}
                                      className="text-red-500 hover:text-red-700 text-xs font-medium"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Excluded Items */}
                        <div>
                          <h4 className="text-md font-semibold text-red-800 mb-3">❌ What's Not Included</h4>
                          <div className="space-y-3">
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                placeholder={getSelectedCategoryName() === 'Trip Planner' 
                                  ? 'e.g., Hotel bookings, Flight bookings, Travel insurance, Personal expenses'
                                  : 'e.g., Transportation, Meals, Personal expenses'
                                }
                                className="flex-1 px-3 py-2 border border-red-300 rounded-lg focus:border-red-500 focus:outline-none text-sm"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                    addToArrayField('excludedItems', e.currentTarget.value.trim());
                                    e.currentTarget.value = '';
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                  if (input.value.trim()) {
                                    addToArrayField('excludedItems', input.value.trim());
                                    input.value = '';
                                  }
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                              >
                                Add
                              </button>
                            </div>
                            
                            {formData.excludedItems.length > 0 && (
                              <div className="space-y-2">
                                {formData.excludedItems.map((item, index) => (
                                  <div key={index} className="flex items-center justify-between bg-white p-2 rounded border border-red-200">
                                    <span className="text-sm text-gray-900">{item}</span>
                                    <button
                                      onClick={() => removeFromArrayField('excludedItems', index)}
                                      className="text-red-500 hover:text-red-700 text-xs font-medium"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Experience Flow (Itinerary for Tour Guide, Design Steps for Trip Planner) + Media */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  {(getSelectedCategoryName() === 'Local Tour Guide' || getSelectedCategoryName().includes('Combo')) && (
                    <div>
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          {getSelectedCategoryName().includes('Combo') ? 'Tour Itinerary 🗺️📸' : 'Tour Itinerary 🗺️'}
                        </h2>
                        <p className="text-gray-600">
                          {getSelectedCategoryName().includes('Combo') 
                            ? 'Create a detailed step-by-step itinerary for your tour with photography spots'
                            : 'Create a detailed step-by-step itinerary for your tour'
                          }
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-blue-900">Itinerary Steps</h3>
                          <button
                            type="button"
                            onClick={addItineraryStep}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                          >
                            + Add Step
                          </button>
                        </div>
                        
                        {formData.itinerary.length === 0 && (
                          <div className="text-center py-8">
                            <div className="text-4xl mb-2">📝</div>
                            <p className="text-blue-700 mb-4">No itinerary steps yet</p>
                            <button
                              type="button"
                              onClick={addItineraryStep}
                              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                            >
                              Create First Step
                            </button>
                          </div>
                        )}
                        
                        {formData.itinerary.length > 0 && (
                          <div className="space-y-4">
                            {formData.itinerary.map((step, index) => (
                              <div key={index} className="bg-white border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-semibold text-blue-900">Step {step.stepNumber}</h4>
                                  <button
                                    type="button"
                                    onClick={() => removeItineraryStep(index)}
                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                  >
                                    Remove
                                  </button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Step Title</label>
                                    <input
                                      type="text"
                                      value={step.title}
                                      onChange={(e) => updateItineraryStep(index, 'title', e.target.value)}
                                      placeholder="e.g., Arrival at Historic Temple"
                                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                    <input
                                      type="text"
                                      value={step.time}
                                      onChange={(e) => updateItineraryStep(index, 'time', e.target.value)}
                                      placeholder="e.g., 09:00 - 10:30"
                                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input
                                      type="text"
                                      value={step.location}
                                      onChange={(e) => updateItineraryStep(index, 'location', e.target.value)}
                                      placeholder="e.g., Tanah Lot Temple"
                                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                                    <input
                                      type="number"
                                      value={step.durationMinutes}
                                      onChange={(e) => updateItineraryStep(index, 'durationMinutes', parseInt(e.target.value))}
                                      placeholder="90"
                                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                </div>
                                
                                <div className="mt-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                  <textarea
                                    rows={3}
                                    value={step.description}
                                    onChange={(e) => updateItineraryStep(index, 'description', e.target.value)}
                                    placeholder="Describe what happens in this step..."
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {getSelectedCategoryName() === 'Trip Planner' && (
                    <div>
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M13 13h3" />
                          </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Plan Your Process! 📋</h2>
                        <p className="text-gray-600">Outline your step-by-step trip planning workflow</p>
                      </div>
                      
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-purple-900">Planning Steps</h3>
                          <button
                            type="button"
                            onClick={addItineraryStep}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                          >
                            + Add Planning Step
                          </button>
                        </div>
                        
                        {formData.itinerary.length === 0 && (
                          <div className="text-center py-8">
                            <div className="text-4xl mb-2">📋</div>
                            <p className="text-purple-700 mb-4">No planning steps yet</p>
                            <button
                              type="button"
                              onClick={addItineraryStep}
                              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                            >
                              Create First Planning Step
                            </button>
                          </div>
                        )}
                        
                        {formData.itinerary.length > 0 && (
                          <div className="space-y-4">
                            {formData.itinerary.map((step, index) => (
                              <div key={index} className="bg-white border border-purple-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-semibold text-purple-900">Planning Step {step.stepNumber}</h4>
                                  <button
                                    type="button"
                                    onClick={() => removeItineraryStep(index)}
                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                  >
                                    Remove
                                  </button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Step Title</label>
                                    <input
                                      type="text"
                                      value={step.title}
                                      onChange={(e) => updateItineraryStep(index, 'title', e.target.value)}
                                      placeholder={getSelectedCategoryName() === 'Trip Planner' 
                                        ? 'e.g., Consultation & Preferences Gathering'
                                        : 'e.g., Initial Consultation & Research'
                                      }
                                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      {getSelectedCategoryName() === 'Trip Planner' ? 'Timeline' : 'Time'}
                                    </label>
                                    <input
                                      type="text"
                                      value={step.time}
                                      onChange={(e) => updateItineraryStep(index, 'time', e.target.value)}
                                      placeholder={getSelectedCategoryName() === 'Trip Planner' 
                                        ? 'e.g., 2 days'
                                        : 'e.g., 09:00 - 10:30'
                                      }
                                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                  </div>
                                  
                                  {/* Focus Area/Location - Hide for Trip Planner or simplify */}
                                  {getSelectedCategoryName() !== 'Trip Planner' && (
                                    <>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <input
                                          type="text"
                                          value={step.location}
                                          onChange={(e) => updateItineraryStep(index, 'location', e.target.value)}
                                          placeholder="e.g., Borobudur Temple"
                                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        />
                                      </div>
                                      
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                                        <input
                                          type="number"
                                          value={step.durationMinutes}
                                          onChange={(e) => updateItineraryStep(index, 'durationMinutes', parseInt(e.target.value))}
                                          placeholder="90"
                                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                        />
                                      </div>
                                    </>
                                  )}
                                </div>
                                
                                <div className="mt-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {getSelectedCategoryName() === 'Trip Planner' 
                                      ? 'What\'s Done in This Step' 
                                      : 'Activities & Description'
                                    }
                                  </label>
                                  <textarea
                                    rows={3}
                                    value={step.description}
                                    onChange={(e) => updateItineraryStep(index, 'description', e.target.value)}
                                    placeholder={getSelectedCategoryName() === 'Trip Planner' 
                                      ? 'e.g., Online meeting/chat (WhatsApp/Zoom/Telegram). Discuss traveller type, identify interests, define budget range...'
                                      : 'Describe the activities and what guests will experience at this step...'
                                    }
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Media Upload Section */}
                  <div>
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Experience Media 📸</h2>
                      <p className="text-gray-600">Upload photos to showcase your experience</p>
                    </div>
                    
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-orange-900 mb-4">Photo Gallery</h3>
                      
                      <div className="space-y-4">
                        <div
                          onClick={() => document.getElementById('image-upload')?.click()}
                          className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center hover:border-orange-400 cursor-pointer transition-colors bg-white"
                        >
                          <svg className="mx-auto h-12 w-12 text-orange-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="mt-4">
                            <p className="text-lg font-medium text-orange-900">Upload Experience Photos</p>
                            <p className="text-orange-600 mt-1">Drag and drop files here, or click to select</p>
                            <p className="text-xs text-orange-500 mt-2">Maximum 10 photos, up to 5MB each</p>
                          </div>
                        </div>
                        
                        <input
                          id="image-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageInputChange}
                          className="hidden"
                        />
                        
                        {imageUploadLoading && (
                          <div className="text-center py-4">
                            <div className="inline-flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                              <span className="text-orange-600">Processing images...</span>
                            </div>
                          </div>
                        )}
                        
                        {formData.images.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-orange-700 mb-3">
                              Uploaded Photos ({formData.images.length}/10)
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {formData.images.map((file, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Upload ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border border-orange-200"
                                  />
                                  <button
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    ×
                                  </button>
                                  {index === 0 && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-orange-600 text-white text-xs text-center py-1 rounded-b-lg">
                                      Main Photo
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-orange-600 mt-2">
                              💡 First image will be the main photo shown in search results
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Final Review & Submit */}
              {currentStep === 5 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Almost there! 🎉</h2>
                    <p className="text-gray-600">Review your experience details before submitting for approval</p>
                  </div>
                  
                  {/* Experience Summary */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-purple-900 mb-4">Experience Summary</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Info */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Basic Information</h4>
                          <div className="bg-white p-4 rounded-lg border">
                            <p><strong>Title:</strong> {formData.title || 'Not set'}</p>
                            <p><strong>Category:</strong> {getSelectedCategoryName()}</p>
                            <p><strong>City:</strong> {getSelectedCity()?.name || 'Not selected'}</p>
                            <p><strong>Duration:</strong> {formData.duration} hours {getSelectedCategoryName() === 'Trip Planner' ? '(consultation)' : ''}</p>
                            <p><strong>Price:</strong> {formData.currency} {formData.pricePerPackage || '0'}</p>
                          </div>
                        </div>
                        
                        {/* Languages */}
                        {userLanguages.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Available Languages</h4>
                            <div className="bg-white p-4 rounded-lg border">
                              <div className="flex flex-wrap gap-2">
                                {userLanguages.map((language, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                  >
                                    {language}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Equipment */}
                        {formData.equipmentUsed.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">
                              {getSelectedCategoryName() === 'Trip Planner' ? 'Tools & Software' : 'Equipment & Tools'}
                            </h4>
                            <div className="bg-white p-4 rounded-lg border">
                              <ul className="text-sm space-y-1">
                                {formData.equipmentUsed.map((item, index) => (
                                  <li key={index}>• {item}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Deliverables & Inclusions */}
                      <div className="space-y-4">
                        {formData.deliverables.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">What You'll Deliver</h4>
                            <div className="bg-white p-4 rounded-lg border">
                              <ul className="text-sm space-y-1">
                                {formData.deliverables.map((item, index) => (
                                  <li key={index}>✅ {item}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                        
                        {formData.includedItems.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">What's Included</h4>
                            <div className="bg-white p-4 rounded-lg border">
                              <ul className="text-sm space-y-1">
                                {formData.includedItems.map((item, index) => (
                                  <li key={index}>✅ {item}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                        
                        {formData.excludedItems.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">What's Not Included</h4>
                            <div className="bg-white p-4 rounded-lg border">
                              <ul className="text-sm space-y-1">
                                {formData.excludedItems.map((item, index) => (
                                  <li key={index}>❌ {item}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Itinerary/Design Steps */}
                    {formData.itinerary.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {getSelectedCategoryName() === 'Local Tour Guide' ? 'Tour Itinerary' : 
                           getSelectedCategoryName() === 'Trip Planner' ? 'Planning Steps' : 
                           getSelectedCategoryName().includes('Combo') ? 'Tour Itinerary' : 'Design Process'}
                        </h4>
                        <div className="bg-white p-4 rounded-lg border max-h-40 overflow-y-auto">
                          <div className="space-y-2">
                            {formData.itinerary.map((step, index) => (
                              <div key={index} className="text-sm border-l-2 border-blue-300 pl-3">
                                <p className="font-medium">{step.stepNumber}. {step.title}</p>
                                {getSelectedCategoryName() === 'Trip Planner' ? (
                                  // For Trip Planner - show timeline only
                                  <p className="text-gray-600">{step.time}</p>
                                ) : (
                                  // For other categories - show time and location
                                  <p className="text-gray-600">{step.time} - {step.location}</p>
                                )}
                                {step.description && (
                                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">{step.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Photos */}
                    {formData.images.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Photos ({formData.images.length})</h4>
                        <div className="bg-white p-4 rounded-lg border">
                          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                            {formData.images.slice(0, 6).map((file, index) => (
                              <img
                                key={index}
                                src={URL.createObjectURL(file)}
                                alt={`Photo ${index + 1}`}
                                className="w-full h-16 object-cover rounded border"
                              />
                            ))}
                            {formData.images.length > 6 && (
                              <div className="w-full h-16 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-600">
                                +{formData.images.length - 6} more
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Submission Notice */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                      <svg className="w-6 h-6 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-3">Choose how to save your experience</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="bg-white/60 rounded-lg p-4 border border-blue-100">
                            <h5 className="font-medium text-gray-900 mb-2">💾 Save as Draft</h5>
                            <ul className="text-gray-700 space-y-1">
                              <li>• Save your progress without publishing</li>
                              <li>• Continue editing anytime</li>
                              <li>• Submit for review when ready</li>
                            </ul>
                          </div>
                          <div className="bg-white/60 rounded-lg p-4 border border-blue-100">
                            <h5 className="font-medium text-gray-900 mb-2">✅ Submit for Review</h5>
                            <ul className="text-gray-700 space-y-1">
                              <li>• Send to admin for approval</li>
                              <li>• Get notified when approved</li>
                              <li>• Go live once approved</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                <div className="flex flex-col gap-3 min-w-0">
                  {/* Save as Draft button */}
                  <button
                    onClick={() => handleSubmit(false)}
                    disabled={submitLoading || !formData.title || !formData.categoryId || !formData.description || !formData.pricePerPackage || !formData.meetingPoint || !formData.duration || !formData.maxGuests}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {submitLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span>💾 Save as Draft</span>
                      </>
                    )}
                  </button>
                  
                  {/* Submit for Review button */}
                  <button
                    onClick={() => handleSubmit(true)}
                    disabled={submitLoading || !formData.title || !formData.categoryId || !formData.description || !formData.pricePerPackage || !formData.meetingPoint || !formData.duration || !formData.maxGuests}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {submitLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Submitting for Review...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>✅ Submit for Review</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && (!formData.title || !formData.categoryId || !formData.description)) ||
                    (currentStep === 2 && (!formData.pricePerPackage || !formData.meetingPoint || !formData.duration || !formData.maxGuests)) ||
                    (currentStep === 3 && getSelectedCategoryName() === 'Photographer' && !formData.hostSpecificData.photographyStyle) ||
                    (currentStep === 3 && getSelectedCategoryName() === 'Trip Planner' && !formData.hostSpecificData.maxRevisions) ||
                    (currentStep === 3 && getSelectedCategoryName().includes('Combo') && !formData.hostSpecificData.photographyStyle) ||
                    (currentStep === 4 && categoryRequiresItinerary() && formData.itinerary.length === 0)
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
    </>
  );
}
