'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import { useCitiesAutocomplete } from '@/hooks/useCitiesAutocomplete';
import { useExperience } from '@/hooks/useExperience';
import Toast from '@/components/ui/Toast';
import { SimpleImage } from '@/components/SimpleImage';
import { authAPI } from '@/services/authAPI';

// Define interfaces for type safety (same as create page)
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

export default function EditExperiencePage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const experienceId = params.id as string;
  const { toast, showSuccess, showError, hideToast } = useToast();
  
  // Fetch existing experience data
  const { data: existingExperience, loading: fetchingExperience, error: fetchError } = useExperience(experienceId);
  
  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  
  // Images to delete (track existing images marked for deletion)
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  
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
    deliverables: [] as string[],
    equipmentUsed: [] as string[],
    
    // Step 4: Inclusions
    includedItems: [] as string[],
    excludedItems: [] as string[],
    
    // Step 5: Itinerary/Design Steps + Media + Final Review
    itinerary: [] as ItineraryStep[],
    images: [] as File[] // Store new File objects for upload, existing images are handled separately
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
  
  // Check if user is authorized to edit this experience
  useEffect(() => {
    if (existingExperience && user) {
      // Check if current user is the host of this experience
      const hostId = String(existingExperience.host?.id);
      const userId = String(user.id);
      const userUuid = String(user.uuid);
      
      if (hostId !== userId && hostId !== userUuid) {
        showError('You are not authorized to edit this experience');
        router.push('/host/experiences');
        return;
      }
    }
  }, [existingExperience, user, router]);
  
  // Helper function to check if field is editable based on status
  const isFieldEditable = (fieldName: string) => {
    if (!existingExperience) {
      return true;
    }
    
    const status = existingExperience.status;
    
    // Draft status allows editing all fields
    if (status === 'draft') {
      return true;
    }
    
    // Define restrictions based on status
    const restrictions: Record<string, { allowed: string[] }> = {
      'pending_review': {
        allowed: [
          'description', 'shortDescription', 'includedItems', 'excludedItems', 
          'deliverables', 'equipmentUsed', 'itinerary', 'hostSpecificData',
          'endingPoint', 'walkingDistance', 'images'
        ]
      },
      'published': {
        allowed: [
          'description', 'shortDescription', 'includedItems', 'excludedItems',
          'deliverables', 'equipmentUsed', 'hostSpecificData', 'images'
        ]
      },
      'rejected': {
        allowed: [
          'title', 'description', 'shortDescription', 'pricePerPackage', 'currency',
          'duration', 'minGuests', 'maxGuests', 'includedItems', 'excludedItems',
          'deliverables', 'equipmentUsed', 'meetingPoint', 'endingPoint', 
          'walkingDistance', 'difficulty', 'fitnessLevel', 'hostSpecificData',
          'experienceTypeId', 'cityId', 'images'
        ]
      }
    };
    
    // If status has restrictions, check allowed fields
    if (restrictions[status]) {
      return restrictions[status].allowed.includes(fieldName);
    }
    
    // For other statuses (like suspended, paused), allow editing
    return true;
  };
  
  // Get status-based messaging
  const getStatusMessage = () => {
    if (!existingExperience) return null;
    
    const status = existingExperience.status;
    const messages: Record<string, { type: string; title: string; message: string; icon: string }> = {
      'pending_review': {
        type: 'warning',
        title: 'Under Review - Limited Editing',
        message: 'This experience is currently under review. You can edit descriptions and details, but core information like price and location are locked.',
        icon: '⏳'
      },
      'published': {
        type: 'info', 
        title: 'Published - Restricted Editing',
        message: 'This experience is live! Only descriptions and inclusions can be edited. For major changes, pause the experience first.',
        icon: '🟢'
      },
      'rejected': {
        type: 'error',
        title: 'Rejected - Full Editing Available',
        message: 'This experience was rejected. You can now edit all fields and resubmit for review.',
        icon: '❌'
      },
      'draft': {
        type: 'success',
        title: 'Draft - Full Editing Available', 
        message: 'This experience is in draft mode. You can edit all fields freely.',
        icon: '📝'
      }
    };
    
    return messages[status] || null;
  };
  
  // Load existing experience data into form
  useEffect(() => {
    if (existingExperience && !initialDataLoaded) {      
      setFormData({
        title: existingExperience.title || '',
        shortDescription: existingExperience.shortDescription || '',
        description: existingExperience.description || '',
        categoryId: existingExperience.categoryId?.toString() || '',
        experienceTypeId: existingExperience.experienceTypeId?.toString() || '',
        cityId: existingExperience.cityId?.toString() || '',
        duration: existingExperience.duration || 4,
        maxGuests: existingExperience.maxGuests || 10,
        minGuests: existingExperience.minGuests || 1,
        difficulty: existingExperience.difficulty || 'Easy',
        fitnessLevel: existingExperience.fitnessLevel || 'Easy',
        pricePerPackage: existingExperience.pricePerPackage?.toString() || '',
        currency: existingExperience.currency || 'IDR',
        meetingPoint: existingExperience.meetingPoint || '',
        endingPoint: existingExperience.endingPoint || '',
        walkingDistance: existingExperience.walkingDistance?.toString() || '',
        hostSpecificData: existingExperience.hostSpecificData || {},
        deliverables: Array.isArray(existingExperience.deliverables) ? existingExperience.deliverables : [],
        equipmentUsed: Array.isArray(existingExperience.equipmentUsed) ? existingExperience.equipmentUsed : [],
        includedItems: Array.isArray(existingExperience.includedItems) ? existingExperience.includedItems : [],
        excludedItems: Array.isArray(existingExperience.excludedItems) ? existingExperience.excludedItems : [],
        itinerary: Array.isArray(existingExperience.itinerary) ? existingExperience.itinerary : [],
        images: [] // Reset images array for new uploads
      });
      
      // Set search values for dropdowns
      if (existingExperience.experienceTypeId) {
        // Find experience type and set search
        fetchInitialData().then(() => {
          const type = experienceTypes.find(t => t.id === existingExperience.experienceTypeId);
          if (type) {
            setExperienceTypeSearch(type.name);
          }
        });
      }
      
      if (existingExperience.cityId) {
        // First try to use city data from existing experience
        if (existingExperience.city) {
          const cityDisplayName = existingExperience.city.country?.name 
            ? `${existingExperience.city.name}, ${existingExperience.city.country.name}`
            : `${existingExperience.city.name}`;
          setCitySearch(cityDisplayName);
        } else {
          // Fallback: Find city in cities array
          const city = cities.find(c => c.id === existingExperience.cityId);
          if (city) {
            setCitySearch(city.displayName || `${city.name}, ${city.country}`);
          }
        }
      }
      
      setInitialDataLoaded(true);
    }
  }, [existingExperience, initialDataLoaded, cities, experienceTypes]);
  
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

  // Helper function to get proper city display name
  const getCityDisplayName = () => {
    // First try to get from existing experience data (more accurate)
    if (existingExperience?.city && formData.cityId === existingExperience.cityId?.toString()) {
      return existingExperience.city.country?.name 
        ? `${existingExperience.city.name}, ${existingExperience.city.country.name}`
        : existingExperience.city.name;
    }
    
    // Fallback to cities array
    const selectedCity = getSelectedCity();
    return selectedCity 
      ? (selectedCity.displayName || `${selectedCity.name}, ${selectedCity.country}`)
      : null;
  };

  // Image handling functions (same as create page)
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
      // Check total image limit (including existing ones minus deleted ones)
      const currentTotal = formData.images.length + (existingExperience?.images?.length || 0) - imagesToDelete.length;
      const remainingSlots = 10 - currentTotal;
      
      if (validFiles.length > remainingSlots) {
        showError(`You can only add ${remainingSlots} more image(s). Maximum 10 images total.`);
        return;
      }

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

  const removeNewImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    showSuccess('Image removed');
  };

  const removeExistingImage = (imageUrl: string) => {
    setImagesToDelete(prev => [...prev, imageUrl]);
    showSuccess('Image marked for deletion');
  };

  const restoreExistingImage = (imageUrl: string) => {
    setImagesToDelete(prev => prev.filter(url => url !== imageUrl));
    showSuccess('Image restored');
  };

  // Array management functions (same as create page)
  const updateFormData = (field: string, value: any) => {
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
  
  // Helper functions from create page
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
        }
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
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
  
  const handleSubmit = async (submitForReview = false) => {
    // Set appropriate loading state
    if (submitForReview) {
      setReviewLoading(true);
    } else {
      setDraftLoading(true);
    }
    
    try {
      const token = authAPI.getToken();
      
      if (!token) {
        showError('Authentication required. Please login again.');
        return;
      }

      if (!user || user.role !== 'host') {
        showError('Only hosts can edit experiences.');
        return;
      }
      
      console.log('Updating experience with token:', token ? 'Present' : 'Missing');
      console.log('User role:', user?.role);
      console.log('Form data being submitted - ALL FIELDS:', {
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription,
        categoryId: formData.categoryId,
        cityId: formData.cityId,
        pricePerPackage: formData.pricePerPackage,
        duration: formData.duration,
        maxGuests: formData.maxGuests,
        minGuests: formData.minGuests,
        meetingPoint: formData.meetingPoint,
        submitForReview,
        // Check for empty values
        emptyFields: Object.entries(formData).filter(([key, value]) => 
          value === '' || value === null || value === undefined || 
          (Array.isArray(value) && value.length === 0)
        ).map(([key]) => key)
      });
      
      // Step 1: Update experience data first (without status change)
      let updateSuccess = false;
      
      // Prepare update data - use FormData if there are new images or image deletions
      if (formData.images.length > 0 || imagesToDelete.length > 0) {
        // Use FormData for image uploads/deletions
        const formDataToSend = new FormData();
        
        // Add text fields (NO STATUS FIELD HERE)
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('shortDescription', formData.shortDescription);
        formDataToSend.append('categoryId', formData.categoryId);
        formDataToSend.append('experienceTypeId', formData.experienceTypeId || '');
        formDataToSend.append('cityId', formData.cityId);
        formDataToSend.append('pricePerPackage', formData.pricePerPackage);
        formDataToSend.append('duration', formData.duration.toString());
        formDataToSend.append('maxGuests', formData.maxGuests.toString());
        formDataToSend.append('minGuests', formData.minGuests.toString());
        formDataToSend.append('meetingPoint', formData.meetingPoint);
        formDataToSend.append('endingPoint', formData.endingPoint || '');
        formDataToSend.append('difficulty', formData.difficulty);
        formDataToSend.append('fitnessLevel', formData.fitnessLevel);
        formDataToSend.append('walkingDistance', formData.walkingDistance || '');
        formDataToSend.append('currency', formData.currency);
        formDataToSend.append('includedItems', JSON.stringify(formData.includedItems));
        formDataToSend.append('excludedItems', JSON.stringify(formData.excludedItems));
        formDataToSend.append('deliverables', JSON.stringify(formData.deliverables));
        formDataToSend.append('equipmentUsed', JSON.stringify(formData.equipmentUsed));
        formDataToSend.append('itinerary', JSON.stringify(formData.itinerary));
        formDataToSend.append('hostSpecificData', JSON.stringify(formData.hostSpecificData));
        
        // Add new images
        formData.images.forEach((file, index) => {
          formDataToSend.append('images', file);
        });
        
        // Add images to delete
        if (imagesToDelete.length > 0) {
          formDataToSend.append('imagesToDelete', JSON.stringify(imagesToDelete));
        }

        const response = await fetch(`/api/experiences/${experienceId}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
            // Don't set Content-Type for FormData, browser will set it with boundary
          },
          body: formDataToSend
        });
        
        const result = await response.json();
        console.log('Backend response:', result);
        
        if (result.success) {
          updateSuccess = true;
        } else {
          console.error('Update errors:', result.errors);
          const errorMessage = result.errors && result.errors.length > 0 
            ? `Update failed: ${result.errors.map((e: any) => e.msg).join(', ')}`
            : result.message || 'Failed to update experience';
          showError('Failed to update experience: ' + errorMessage);
          return;
        }
      } else {
        // Use JSON for text-only updates (NO STATUS FIELD HERE)
        const updateData = {
          title: formData.title,
          description: formData.description,
          shortDescription: formData.shortDescription,
          categoryId: parseInt(formData.categoryId),
          experienceTypeId: formData.experienceTypeId ? parseInt(formData.experienceTypeId) : null,
          cityId: parseInt(formData.cityId),
          pricePerPackage: parseFloat(formData.pricePerPackage),
          duration: formData.duration,
          maxGuests: formData.maxGuests,
          minGuests: formData.minGuests,
          location: formData.meetingPoint,
          meetingPoint: formData.meetingPoint,
          endingPoint: formData.endingPoint,
          difficulty: formData.difficulty,
          fitnessLevel: formData.fitnessLevel,
          walkingDistance: formData.walkingDistance ? parseFloat(formData.walkingDistance) : null,
          included: formData.includedItems,
          excluded: formData.excludedItems,
          deliverables: formData.deliverables,
          equipmentUsed: formData.equipmentUsed,
          itinerary: formData.itinerary,
          hostSpecificData: formData.hostSpecificData
        };

        const response = await fetch(`/api/experiences/${experienceId}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updateData)
        });
        
        const result = await response.json();
        console.log('Backend response:', result);
        
        if (result.success) {
          updateSuccess = true;
        } else {
          console.error('Update errors:', result.errors);
          const errorMessage = result.errors && result.errors.length > 0 
            ? `Update failed: ${result.errors.map((e: any) => e.msg).join(', ')}`
            : result.message || 'Failed to update experience';
          showError('Failed to update experience: ' + errorMessage);
          return;
        }
      }
      
      // Step 2: If submitForReview is true AND update was successful, submit for review
      if (submitForReview && updateSuccess) {
        const submitResponse = await fetch(`/api/experiences/${experienceId}/submit-review/`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const submitResult = await submitResponse.json();
        console.log('Submit for review response:', submitResult);
        
        if (submitResult.success) {
          showSuccess('Experience updated and submitted for review successfully! Redirecting...');
        } else {
          showError('Experience was updated but failed to submit for review: ' + (submitResult.message || 'Unknown error'));
          return;
        }
      } else if (updateSuccess) {
        showSuccess('Experience updated and saved as draft successfully! Redirecting...');
      }
      
      // Redirect after successful operation
      setTimeout(() => {
        router.push('/host/experiences');
      }, 1500);
      
    } catch (error) {
      console.error('Failed to update experience:', error);
      showError('Failed to update experience. Please try again.');
    } finally {
      // Reset appropriate loading state
      if (submitForReview) {
        setReviewLoading(false);
      } else {
        setDraftLoading(false);
      }
    }
  };

  // Drag and drop handlers for image upload
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImageUpload(Array.from(files));
    }
  };
  
  // Handle fetch error
  if (fetchError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Experience Not Found</h2>
          <p className="text-gray-600 mb-4">{fetchError}</p>
          <button
            onClick={() => router.push('/host/experiences')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Experiences
          </button>
        </div>
      </div>
    );
  }
  
  if (fetchingExperience || loading || !initialDataLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading experience data... ✨</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-purple-100 z-40">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Edit Your Experience ✏️
                </h1>
                <p className="text-gray-600 text-sm">Step {currentStep} of {totalSteps}</p>
                {existingExperience && (
                  <p className="text-gray-500 text-xs mt-1">Editing: {existingExperience.title}</p>
                )}
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
          {/* Status Message Banner */}
          {existingExperience && getStatusMessage() && (
            <div className={`mb-6 p-4 rounded-lg border-l-4 ${
              getStatusMessage()?.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
              getStatusMessage()?.type === 'info' ? 'bg-blue-50 border-blue-400' :
              getStatusMessage()?.type === 'error' ? 'bg-red-50 border-red-400' :
              'bg-green-50 border-green-400'
            }`}>
              <div className="flex items-start">
                <span className="text-xl mr-3">{getStatusMessage()?.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {getStatusMessage()?.title}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {getStatusMessage()?.message}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
            
            {/* Step Content */}
            <div className="p-8">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's start with the basics! 🚀</h2>
                    <p className="text-gray-600">Edit your amazing experience details</p>
                  </div>
                  
                  {/* Host Category Display (read-only in edit) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Your Host Category
                    </label>
                    
                    {existingExperience?.category && (
                      <div className="p-4 rounded-xl border-2 border-purple-500 bg-purple-50 shadow-lg">
                        <div className="flex items-start space-x-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: '#8B5CF6' }}
                          >
                            {existingExperience.category.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-gray-900">{existingExperience.category.name}</h3>
                              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">
                                Current Category
                              </span>
                            </div>
                            <p className="text-xs text-purple-600 mt-2 font-medium">
                              ⚠️ Category cannot be changed when editing
                            </p>
                          </div>
                          <div className="text-purple-500">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Experience Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Experience Title *
                      {!isFieldEditable('title') && (
                        <span className="text-xs text-gray-500 ml-2">(Locked during review)</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => updateFormData('title', e.target.value)}
                      disabled={!isFieldEditable('title')}
                      placeholder="e.g., Hidden Jakarta Coffee Culture Tour ☕"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-900 placeholder-gray-400 ${
                        !isFieldEditable('title') 
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600' 
                          : 'border-purple-100 focus:border-purple-500'
                      }`}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {isFieldEditable('title') 
                        ? 'Make it catchy and specific! Use emojis to make it pop ✨' 
                        : 'Title cannot be changed while experience is under review or published'
                      }
                    </p>
                  </div>
                  
                  {/* Short Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quick Hook (Short Description) *
                      {!isFieldEditable('shortDescription') && (
                        <span className="text-xs text-gray-500 ml-2">(Editable)</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={formData.shortDescription}
                      onChange={(e) => updateFormData('shortDescription', e.target.value)}
                      disabled={!isFieldEditable('shortDescription')}
                      placeholder="One line that makes people go 'YESSS I need this!' 🔥"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-900 placeholder-gray-400 ${
                        !isFieldEditable('shortDescription') 
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600' 
                          : 'border-purple-100 focus:border-purple-500'
                      }`}
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.shortDescription.length}/500 characters</p>
                  </div>
                  
                  {/* Full Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Story *
                      {!isFieldEditable('description') && (
                        <span className="text-xs text-gray-500 ml-2">(Editable)</span>
                      )}
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => updateFormData('description', e.target.value)}
                      disabled={!isFieldEditable('description')}
                      placeholder="Spill all the tea! What makes this experience absolutely incredible? What will they see, feel, taste, discover? Be specific and get them hyped! 🙌"
                      rows={6}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-900 placeholder-gray-400 resize-none ${
                        !isFieldEditable('description') 
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600' 
                          : 'border-purple-100 focus:border-purple-500'
                      }`}
                    />
                  </div>
                  
                  {/* Experience Type Selection - Autocomplete */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      What type of experience is this? *
                      {!isFieldEditable('experienceTypeId') && (
                        <span className="text-xs text-red-500 ml-2">(Locked during review)</span>
                      )}
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
                          disabled={!isFieldEditable('experienceTypeId')}
                          placeholder="Search for experience type... (e.g., food, photo, adventure)"
                          className={`w-full px-4 py-3 pr-10 border-2 rounded-xl focus:outline-none transition-colors text-gray-900 placeholder-gray-400 ${
                            !isFieldEditable('experienceTypeId') 
                              ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600' 
                              : 'border-purple-100 focus:border-purple-500'
                          }`}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Dropdown Options */}
                      {showExperienceTypeDropdown && isFieldEditable('experienceTypeId') && (
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
                          {isFieldEditable('experienceTypeId') && (
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
                          )}
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
                      {!isFieldEditable('cityId') && (
                        <span className="text-xs text-red-500 ml-2">(Locked during review)</span>
                      )}
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
                          disabled={!isFieldEditable('cityId')}
                          placeholder="Search for a city... (e.g., Jakarta, Bali, Bandung)"
                          className={`w-full px-4 py-3 pr-10 border-2 rounded-xl focus:outline-none transition-colors text-gray-900 placeholder-gray-400 ${
                            !isFieldEditable('cityId') 
                              ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600' 
                              : 'border-purple-100 focus:border-purple-500'
                          }`}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414a1 1 0 00-1.414 0L7.757 16.657m0 0a8 8 0 111.414-1.414m-1.414 1.414L5.636 14.636M17.657 16.657L19.071 18.071" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Dropdown Options */}
                      {showCityDropdown && isFieldEditable('cityId') && (
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
                                        📍
                                      </div>
                                      
                                      {/* Content */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2">
                                          <h4 className="font-semibold text-gray-900 text-sm truncate">
                                            {city.displayName || `${city.name}, ${city.country}`}
                                          </h4>
                                          {formData.cityId === city.id.toString() && (
                                            <div className="text-green-500 flex-shrink-0">
                                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                              </svg>
                                            </div>
                                          )}
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1">
                                          {city.country}
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414a1 1 0 00-1.414 0L7.757 16.657" />
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
                    {formData.cityId && getCityDisplayName() && (
                      <div className="mt-3 p-4 bg-gradient-to-r from-green-50 via-blue-50 to-indigo-50 border border-green-200 rounded-xl">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-500 text-white font-bold text-sm flex-shrink-0 shadow-lg">
                            📍
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-bold text-gray-900">
                                {getCityDisplayName()}
                              </h4>
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">
                                Selected
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">
                              Experience location: {existingExperience?.city?.country?.name || getSelectedCity()?.country || 'Unknown Country'}
                            </p>
                          </div>
                          {isFieldEditable('cityId') && (
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
                          )}
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-2">
                      🌍 Start typing to search through available cities
                    </p>
                  </div>
                  
                  {/* Note about editing limitations */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">💡 Note:</span> Some fields like category and location are locked during editing to maintain experience integrity. 
                      If you need to change these, please contact support or create a new experience.
                    </p>
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's talk logistics! �</h2>
                    <p className="text-gray-600">Time, people, and pricing details</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Duration (hours) *
                        {!isFieldEditable('duration') && (
                          <span className="text-xs text-red-500 ml-2">(Locked during review)</span>
                        )}
                      </label>
                      <input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => updateFormData('duration', parseInt(e.target.value))}
                        disabled={!isFieldEditable('duration')}
                        min="1"
                        max="24"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-900 ${
                          !isFieldEditable('duration') 
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600' 
                            : 'border-purple-100 focus:border-purple-500'
                        }`}
                      />
                    </div>
                    
                    {/* Max Guests */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Max Guests *
                        {!isFieldEditable('maxGuests') && (
                          <span className="text-xs text-red-500 ml-2">(Locked during review)</span>
                        )}
                      </label>
                      <input
                        type="number"
                        value={formData.maxGuests}
                        onChange={(e) => updateFormData('maxGuests', parseInt(e.target.value))}
                        disabled={!isFieldEditable('maxGuests')}
                        min="1"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-900 ${
                          !isFieldEditable('maxGuests') 
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600' 
                            : 'border-purple-100 focus:border-purple-500'
                        }`}
                      />
                    </div>
                    
                    {/* Min Guests */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Min Guests *
                        {!isFieldEditable('minGuests') && (
                          <span className="text-xs text-red-500 ml-2">(Locked during review)</span>
                        )}
                      </label>
                      <input
                        type="number"
                        value={formData.minGuests}
                        onChange={(e) => updateFormData('minGuests', parseInt(e.target.value))}
                        disabled={!isFieldEditable('minGuests')}
                        min="1"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-900 ${
                          !isFieldEditable('minGuests') 
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600' 
                            : 'border-purple-100 focus:border-purple-500'
                        }`}
                      />
                    </div>
                    
                    {/* Difficulty */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Difficulty Level *
                        {!isFieldEditable('difficulty') && (
                          <span className="text-xs text-red-500 ml-2">(Locked during review)</span>
                        )}
                      </label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => updateFormData('difficulty', e.target.value)}
                        disabled={!isFieldEditable('difficulty')}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-900 ${
                          !isFieldEditable('difficulty') 
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600' 
                            : 'border-purple-100 focus:border-purple-500'
                        }`}
                      >
                        <option value="Easy">Easy 😎 (Anyone can do it)</option>
                        <option value="Moderate">Moderate 🚶 (Some walking required)</option>
                        <option value="Challenging">Challenging 🏃 (Need to be fit)</option>
                      </select>
                    </div>

                    {/* Fitness Level */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Required Fitness Level *
                        {!isFieldEditable('fitnessLevel') && (
                          <span className="text-xs text-red-500 ml-2">(Locked during review)</span>
                        )}
                      </label>
                      <select
                        value={formData.fitnessLevel}
                        onChange={(e) => updateFormData('fitnessLevel', e.target.value)}
                        disabled={!isFieldEditable('fitnessLevel')}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-900 ${
                          !isFieldEditable('fitnessLevel') 
                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600' 
                            : 'border-purple-100 focus:border-purple-500'
                        }`}
                      >
                        <option value="Beginner">Beginner 🌱 (No fitness required)</option>
                        <option value="Basic">Basic 💪 (Basic fitness level)</option>
                        <option value="Intermediate">Intermediate 🏋️ (Regular exercise)</option>
                        <option value="Advanced">Advanced 🏆 (Athletic fitness)</option>
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
                          {!isFieldEditable('pricePerPackage') && (
                            <span className="text-xs text-red-500 ml-2">(Locked during review)</span>
                          )}
                        </label>
                        <input
                          type="number"
                          value={formData.pricePerPackage}
                          onChange={(e) => updateFormData('pricePerPackage', e.target.value)}
                          disabled={!isFieldEditable('pricePerPackage')}
                          placeholder="0"
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-900 ${
                            !isFieldEditable('pricePerPackage') 
                              ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600' 
                              : 'border-green-200 focus:border-green-500'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Currency *
                          {!isFieldEditable('currency') && (
                            <span className="text-xs text-red-500 ml-2">(Locked during review)</span>
                          )}
                        </label>
                        <select
                          value={formData.currency}
                          onChange={(e) => updateFormData('currency', e.target.value)}
                          disabled={!isFieldEditable('currency')}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-900 ${
                            !isFieldEditable('currency') 
                              ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600' 
                              : 'border-green-200 focus:border-green-500'
                          }`}
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
                          {!isFieldEditable('meetingPoint') && (
                            <span className="text-xs text-red-500 ml-2">(Locked during review)</span>
                          )}
                        </label>
                        <textarea
                          value={formData.meetingPoint}
                          onChange={(e) => updateFormData('meetingPoint', e.target.value)}
                          disabled={!isFieldEditable('meetingPoint')}
                          placeholder="Where should guests meet you? Be specific! Include landmarks, addresses, or notable features."
                          rows={3}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-900 placeholder-gray-400 resize-none ${
                            !isFieldEditable('meetingPoint') 
                              ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600' 
                              : 'border-purple-100 focus:border-purple-500'
                          }`}
                        />
                      </div>

                      {/* Ending Point */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Ending Point (if different)
                          {!isFieldEditable('endingPoint') && (
                            <span className="text-xs text-gray-500 ml-2">(Editable)</span>
                          )}
                        </label>
                        <input
                          type="text"
                          value={formData.endingPoint || ''}
                          onChange={(e) => updateFormData('endingPoint', e.target.value)}
                          disabled={!isFieldEditable('endingPoint')}
                          placeholder="Where does the experience end? e.g., Same as meeting point, nearby cafe..."
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-900 placeholder-gray-400 ${
                            !isFieldEditable('endingPoint') 
                              ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600' 
                              : 'border-purple-100 focus:border-purple-500'
                          }`}
                        />
                      </div>
                      
                      {/* Walking Distance - Hide for Trip Planner */}
                      {getSelectedCategoryName() !== 'Trip Planner' && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Walking Distance (km)
                            {!isFieldEditable('walkingDistance') && (
                              <span className="text-xs text-gray-500 ml-2">(Editable)</span>
                            )}
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={formData.walkingDistance}
                            onChange={(e) => updateFormData('walkingDistance', e.target.value)}
                            disabled={!isFieldEditable('walkingDistance')}
                            placeholder="0.0"
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-900 ${
                              !isFieldEditable('walkingDistance') 
                                ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600' 
                                : 'border-purple-100 focus:border-purple-500'
                            }`}
                          />
                        </div>
                      )}
                      
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 3: Category Configuration */}
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

                  {/* Equipment Section */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      Equipment & Tools Used
                      {!isFieldEditable('equipmentUsed') && (
                        <span className="text-xs text-gray-500 ml-2">(Editable)</span>
                      )}
                    </h3>
                    <p className="text-purple-700 mb-4">
                      List the professional equipment, tools, or software you use to deliver your experience
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder={getSelectedCategoryName() === 'Trip Planner' 
                              ? 'e.g., Google Maps Pro, TripAdvisor, Canva, Adobe Illustrator, Local travel databases'
                              : 'e.g., Canon EOS R5, DJI Drone, Professional lighting kit, Adobe Lightroom'
                            }
                            disabled={!isFieldEditable('equipmentUsed')}
                            className={`flex-1 px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-900 placeholder-gray-400 ${
                              !isFieldEditable('equipmentUsed') 
                                ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600' 
                                : 'border-purple-200 focus:border-purple-500'
                            }`}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && e.currentTarget.value.trim() && isFieldEditable('equipmentUsed')) {
                                addToArrayField('equipmentUsed', e.currentTarget.value.trim());
                                e.currentTarget.value = '';
                              }
                            }}
                          />
                          <button
                            type="button"
                            disabled={!isFieldEditable('equipmentUsed')}
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              if (input.value.trim() && isFieldEditable('equipmentUsed')) {
                                addToArrayField('equipmentUsed', input.value.trim());
                                input.value = '';
                              }
                            }}
                            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                              !isFieldEditable('equipmentUsed')
                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                : 'bg-purple-600 text-white hover:bg-purple-700'
                            }`}
                          >
                            Add
                          </button>
                        </div>
                        
                        {formData.equipmentUsed.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-semibold text-purple-700 mb-2">
                              {getSelectedCategoryName() === 'Trip Planner' ? 'Tools & Software List:' : 'Equipment List:'}
                            </h4>
                            <div className="space-y-2">
                              {formData.equipmentUsed.map((item, index) => (
                                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-purple-200">
                                  <span className="text-gray-900">{item}</span>
                                  <button
                                    onClick={() => removeFromArrayField('equipmentUsed', index)}
                                    disabled={!isFieldEditable('equipmentUsed')}
                                    className={`font-medium text-sm ${
                                      !isFieldEditable('equipmentUsed')
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-red-500 hover:text-red-700'
                                    }`}
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
                  
                  {/* Deliverables Section */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">
                      What You'll Deliver
                      {!isFieldEditable('deliverables') && (
                        <span className="text-xs text-gray-500 ml-2">(Editable)</span>
                      )}
                    </h3>
                    <p className="text-blue-700 mb-4">
                      List the specific outcomes and deliverables guests will receive
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
                            disabled={!isFieldEditable('deliverables')}
                            className={`flex-1 px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                              !isFieldEditable('deliverables') 
                                ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600' 
                                : 'border-blue-200 focus:border-blue-500'
                            }`}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && e.currentTarget.value.trim() && isFieldEditable('deliverables')) {
                                addToArrayField('deliverables', e.currentTarget.value.trim());
                                e.currentTarget.value = '';
                              }
                            }}
                          />
                          <button
                            type="button"
                            disabled={!isFieldEditable('deliverables')}
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              if (input.value.trim() && isFieldEditable('deliverables')) {
                                addToArrayField('deliverables', input.value.trim());
                                input.value = '';
                              }
                            }}
                            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                              !isFieldEditable('deliverables')
                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
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
                                    disabled={!isFieldEditable('deliverables')}
                                    className={`font-medium text-sm ${
                                      !isFieldEditable('deliverables')
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-red-500 hover:text-red-700'
                                    }`}
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
                  
                  {/* Inclusions & Exclusions Section */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-4">What's Included & Excluded</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Included Items */}
                      <div>
                        <h4 className="text-md font-semibold text-green-800 mb-3">
                          ✅ What's Included
                          {!isFieldEditable('includedItems') && (
                            <span className="text-xs text-gray-500 ml-2">(Editable)</span>
                          )}
                        </h4>
                        <div className="space-y-3">
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder={getSelectedCategoryName() === 'Trip Planner' 
                                ? 'e.g., Detailed itinerary, Local recommendations, Maps, Transport guide'
                                : 'e.g., Professional equipment, Photo editing, Travel guide, Local insights'
                              }
                              disabled={!isFieldEditable('includedItems')}
                              className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none text-sm ${
                                !isFieldEditable('includedItems') 
                                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600' 
                                  : 'border-green-300 focus:border-green-500'
                              }`}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && e.currentTarget.value.trim() && isFieldEditable('includedItems')) {
                                  addToArrayField('includedItems', e.currentTarget.value.trim());
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <button
                              type="button"
                              disabled={!isFieldEditable('includedItems')}
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                if (input.value.trim() && isFieldEditable('includedItems')) {
                                  addToArrayField('includedItems', input.value.trim());
                                  input.value = '';
                                }
                              }}
                              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                !isFieldEditable('includedItems')
                                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                  : 'bg-green-600 text-white hover:bg-green-700'
                              }`}
                            >
                              Add
                            </button>
                          </div>
                          
                          {formData.includedItems && formData.includedItems.length > 0 && (
                            <div className="space-y-2">
                              {formData.includedItems.map((item, index) => (
                                <div key={index} className="flex items-center justify-between bg-white p-2 rounded border border-green-200">
                                  <span className="text-sm text-gray-900">{item}</span>
                                  <button
                                    onClick={() => removeFromArrayField('includedItems', index)}
                                    disabled={!isFieldEditable('includedItems')}
                                    className={`text-xs font-medium ${
                                      !isFieldEditable('includedItems')
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-red-500 hover:text-red-700'
                                    }`}
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
                        <h4 className="text-md font-semibold text-red-800 mb-3">
                          ❌ What's Not Included
                          {!isFieldEditable('excludedItems') && (
                            <span className="text-xs text-gray-500 ml-2">(Editable)</span>
                          )}
                        </h4>
                        <div className="space-y-3">
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder={getSelectedCategoryName() === 'Trip Planner' 
                                ? 'e.g., Hotel bookings, Flight bookings, Travel insurance, Personal expenses'
                                : 'e.g., Transportation, Meals, Personal expenses, Travel insurance'
                              }
                              disabled={!isFieldEditable('excludedItems')}
                              className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none text-sm ${
                                !isFieldEditable('excludedItems') 
                                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600' 
                                  : 'border-red-300 focus:border-red-500'
                              }`}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && e.currentTarget.value.trim() && isFieldEditable('excludedItems')) {
                                  addToArrayField('excludedItems', e.currentTarget.value.trim());
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <button
                              type="button"
                              disabled={!isFieldEditable('excludedItems')}
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                if (input.value.trim() && isFieldEditable('excludedItems')) {
                                  addToArrayField('excludedItems', input.value.trim());
                                  input.value = '';
                                }
                              }}
                              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                !isFieldEditable('excludedItems')
                                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                  : 'bg-red-600 text-white hover:bg-red-700'
                              }`}
                            >
                              Add
                            </button>
                          </div>
                          
                          {formData.excludedItems && formData.excludedItems.length > 0 && (
                            <div className="space-y-2">
                              {formData.excludedItems.map((item, index) => (
                                <div key={index} className="flex items-center justify-between bg-white p-2 rounded border border-red-200">
                                  <span className="text-sm text-gray-900">{item}</span>
                                  <button
                                    onClick={() => removeFromArrayField('excludedItems', index)}
                                    disabled={!isFieldEditable('excludedItems')}
                                    className={`text-xs font-medium ${
                                      !isFieldEditable('excludedItems')
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-red-500 hover:text-red-700'
                                    }`}
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
                </div>
              )}



              {/* Step 4: Experience Flow (Itinerary for Tour Guide, Design Steps for Trip Planner) + Media */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  {/* Local Tour Guide Specific */}
                  {(getSelectedCategoryName() === 'Local Tour Guide' || getSelectedCategoryName().includes('Combo')) && (
                    <div>
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0V7" />
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
                            disabled={!isFieldEditable('itinerary')}
                            className={`px-4 py-2 rounded-lg font-medium ${
                              !isFieldEditable('itinerary')
                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
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
                              disabled={!isFieldEditable('itinerary')}
                              className={`px-6 py-3 rounded-lg font-medium ${
                                !isFieldEditable('itinerary')
                                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
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
                                    disabled={!isFieldEditable('itinerary')}
                                    className={`text-sm font-medium ${
                                      !isFieldEditable('itinerary')
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-red-500 hover:text-red-700'
                                    }`}
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
                                      disabled={!isFieldEditable('itinerary')}
                                      placeholder="e.g., Arrival at Historic Temple"
                                      className={`w-full p-3 border rounded-lg focus:ring-2 ${
                                        !isFieldEditable('itinerary')
                                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600'
                                          : 'border-gray-300 focus:ring-blue-500'
                                      }`}
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                    <input
                                      type="text"
                                      value={step.time}
                                      onChange={(e) => updateItineraryStep(index, 'time', e.target.value)}
                                      disabled={!isFieldEditable('itinerary')}
                                      placeholder="e.g., 09:00 - 10:30"
                                      className={`w-full p-3 border rounded-lg focus:ring-2 ${
                                        !isFieldEditable('itinerary')
                                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600'
                                          : 'border-gray-300 focus:ring-blue-500'
                                      }`}
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input
                                      type="text"
                                      value={step.location}
                                      onChange={(e) => updateItineraryStep(index, 'location', e.target.value)}
                                      disabled={!isFieldEditable('itinerary')}
                                      placeholder="e.g., Tanah Lot Temple"
                                      className={`w-full p-3 border rounded-lg focus:ring-2 ${
                                        !isFieldEditable('itinerary')
                                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600'
                                          : 'border-gray-300 focus:ring-blue-500'
                                      }`}
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                                    <input
                                      type="number"
                                      value={step.durationMinutes}
                                      onChange={(e) => updateItineraryStep(index, 'durationMinutes', parseInt(e.target.value))}
                                      disabled={!isFieldEditable('itinerary')}
                                      placeholder="90"
                                      className={`w-full p-3 border rounded-lg focus:ring-2 ${
                                        !isFieldEditable('itinerary')
                                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600'
                                          : 'border-gray-300 focus:ring-blue-500'
                                      }`}
                                    />
                                  </div>
                                </div>
                                
                                <div className="mt-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                  <textarea
                                    rows={3}
                                    value={step.description}
                                    onChange={(e) => updateItineraryStep(index, 'description', e.target.value)}
                                    disabled={!isFieldEditable('itinerary')}
                                    placeholder="Describe what happens in this step..."
                                    className={`w-full p-3 border rounded-lg focus:ring-2 ${
                                      !isFieldEditable('itinerary')
                                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600'
                                        : 'border-gray-300 focus:ring-blue-500'
                                    }`}
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
                            disabled={!isFieldEditable('itinerary')}
                            className={`px-4 py-2 rounded-lg font-medium ${
                              !isFieldEditable('itinerary')
                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                : 'bg-purple-600 text-white hover:bg-purple-700'
                            }`}
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
                              disabled={!isFieldEditable('itinerary')}
                              className={`px-6 py-3 rounded-lg font-medium ${
                                !isFieldEditable('itinerary')
                                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                  : 'bg-purple-600 text-white hover:bg-purple-700'
                              }`}
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
                                    disabled={!isFieldEditable('itinerary')}
                                    className={`text-sm font-medium ${
                                      !isFieldEditable('itinerary')
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-red-500 hover:text-red-700'
                                    }`}
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
                                      disabled={!isFieldEditable('itinerary')}
                                      placeholder={getSelectedCategoryName() === 'Trip Planner' 
                                        ? 'e.g., Consultation & Preferences Gathering'
                                        : 'e.g., Initial Consultation & Research'
                                      }
                                      className={`w-full p-3 border rounded-lg focus:ring-2 ${
                                        !isFieldEditable('itinerary')
                                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600'
                                          : 'border-gray-300 focus:ring-purple-500'
                                      }`}
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
                                      disabled={!isFieldEditable('itinerary')}
                                      placeholder={getSelectedCategoryName() === 'Trip Planner' 
                                        ? 'e.g., 2 days'
                                        : 'e.g., 09:00 - 10:30'
                                      }
                                      className={`w-full p-3 border rounded-lg focus:ring-2 ${
                                        !isFieldEditable('itinerary')
                                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600'
                                          : 'border-gray-300 focus:ring-purple-500'
                                      }`}
                                    />
                                  </div>
                                  
                                  {/* Location & Duration - Hide for Trip Planner */}
                                  {getSelectedCategoryName() !== 'Trip Planner' && (
                                    <>
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <input
                                          type="text"
                                          value={step.location}
                                          onChange={(e) => updateItineraryStep(index, 'location', e.target.value)}
                                          disabled={!isFieldEditable('itinerary')}
                                          placeholder="e.g., Borobudur Temple"
                                          className={`w-full p-3 border rounded-lg focus:ring-2 ${
                                            !isFieldEditable('itinerary')
                                              ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600'
                                              : 'border-gray-300 focus:ring-purple-500'
                                          }`}
                                        />
                                      </div>
                                      
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                                        <input
                                          type="number"
                                          value={step.durationMinutes}
                                          onChange={(e) => updateItineraryStep(index, 'durationMinutes', parseInt(e.target.value))}
                                          disabled={!isFieldEditable('itinerary')}
                                          placeholder="90"
                                          className={`w-full p-3 border rounded-lg focus:ring-2 ${
                                            !isFieldEditable('itinerary')
                                              ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600'
                                              : 'border-gray-300 focus:ring-purple-500'
                                          }`}
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
                                    disabled={!isFieldEditable('itinerary')}
                                    placeholder={getSelectedCategoryName() === 'Trip Planner' 
                                      ? 'e.g., Online meeting/chat (WhatsApp/Zoom/Telegram). Discuss traveller type, identify interests, define budget range...'
                                      : 'Describe the activities and what guests will experience at this step...'
                                    }
                                    className={`w-full p-3 border rounded-lg focus:ring-2 ${
                                      !isFieldEditable('itinerary')
                                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed text-gray-600'
                                        : 'border-gray-300 focus:ring-purple-500'
                                    }`}
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
                          onClick={() => !isFieldEditable('images') ? null : document.getElementById('image-upload')?.click()}
                          onDragOver={handleDragOver}
                          onDragEnter={handleDragEnter}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                            !isFieldEditable('images')
                              ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                              : 'border-orange-300 hover:border-orange-400 cursor-pointer bg-white'
                          }`}
                        >
                          <svg className={`mx-auto h-12 w-12 ${
                            !isFieldEditable('images') ? 'text-gray-400' : 'text-orange-400'
                          }`} stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="mt-4">
                            <p className={`text-lg font-medium ${
                              !isFieldEditable('images') ? 'text-gray-600' : 'text-orange-900'
                            }`}>
                              {!isFieldEditable('images') ? 'Image Upload Not Available' : 'Upload Experience Photos'}
                            </p>
                            <p className={`mt-1 ${
                              !isFieldEditable('images') ? 'text-gray-500' : 'text-orange-600'
                            }`}>
                              {!isFieldEditable('images') ? 'Cannot edit images for this status' : 'Drag and drop files here, or click to select'}
                            </p>
                            <p className={`text-xs mt-2 ${
                              !isFieldEditable('images') ? 'text-gray-400' : 'text-orange-500'
                            }`}>
                              Maximum 10 photos, up to 5MB each
                            </p>
                          </div>
                        </div>
                        
                        <input
                          id="image-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageInputChange}
                          disabled={!isFieldEditable('images')}
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
                        
                        {/* Show existing images from database */}
                        {existingExperience?.images && existingExperience.images.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-orange-700 mb-3">
                              Current Photos ({existingExperience.images.length})
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {existingExperience.images.map((imageUrl, index) => (
                                <div key={index} className="relative group">
                                  <div className={`relative ${imagesToDelete.includes(imageUrl) ? 'opacity-50' : ''}`}>
                                    <SimpleImage
                                      imagePath={imageUrl}
                                      alt={`Experience ${index + 1}`}
                                      className="w-full h-24 object-cover rounded-lg border border-orange-200"
                                      placeholderType="experience"
                                      category="experiences"
                                    />
                                    {index === 0 && !imagesToDelete.includes(imageUrl) && (
                                      <div className="absolute bottom-0 left-0 right-0 bg-orange-600 text-white text-xs text-center py-1 rounded-b-lg">
                                        Main Photo
                                      </div>
                                    )}
                                    {imagesToDelete.includes(imageUrl) && (
                                      <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center rounded-lg">
                                        <span className="text-white text-xs font-bold">Will be deleted</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {isFieldEditable('images') && (
                                    <div className="absolute -top-2 -right-2">
                                      {!imagesToDelete.includes(imageUrl) ? (
                                        <button
                                          onClick={() => removeExistingImage(imageUrl)}
                                          className="rounded-full w-6 h-6 bg-red-500 text-white hover:bg-red-600 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                          title="Delete image"
                                        >
                                          ×
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => restoreExistingImage(imageUrl)}
                                          className="rounded-full w-6 h-6 bg-green-500 text-white hover:bg-green-600 flex items-center justify-center text-xs opacity-100 transition-opacity"
                                          title="Restore image"
                                        >
                                          ↶
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-orange-600 mt-2">
                              💡 First image is the main photo shown in search results<br/>
                              📸 Click × to delete existing photos, ↶ to restore deleted photos<br/>
                              {imagesToDelete.length > 0 && (
                                <span className="text-red-600">🗑️ {imagesToDelete.length} photo(s) will be deleted on save</span>
                              )}
                            </p>
                          </div>
                        )}
                        
                        {/* Show uploaded files (for new uploads) */}
                        {formData.images.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-orange-700 mb-3">
                              New Uploads ({formData.images.length}/10)
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
                                    onClick={() => removeNewImage(index)}
                                    disabled={!isFieldEditable('images')}
                                    className={`absolute -top-2 -right-2 rounded-full w-6 h-6 flex items-center justify-center text-xs transition-opacity ${
                                      !isFieldEditable('images')
                                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed opacity-50'
                                        : 'bg-red-500 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100'
                                    }`}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Changes! 🎉</h2>
                    <p className="text-gray-600">Review your experience edits before submitting for approval</p>
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
                            <p><strong>Category:</strong> {existingExperience?.category?.name || 'Not set'}</p>
                            <p><strong>Duration:</strong> {formData.duration} hours</p>
                            <p><strong>Price:</strong> {formData.currency} {formData.pricePerPackage || '0'}</p>
                            <p><strong>Max Guests:</strong> {formData.maxGuests}</p>
                          </div>
                        </div>
                        
                        {/* Location Details */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Location Details</h4>
                          <div className="bg-white p-4 rounded-lg border">
                            <p><strong>Meeting Point:</strong> {formData.meetingPoint || 'Not set'}</p>
                            {formData.endingPoint && (
                              <p><strong>Ending Point:</strong> {formData.endingPoint}</p>
                            )}
                            {formData.walkingDistance && (
                              <p><strong>Walking Distance:</strong> {formData.walkingDistance} km</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Inclusions & Details */}
                      <div className="space-y-4">
                        {formData.includedItems && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">What's Included</h4>
                            <div className="bg-white p-4 rounded-lg border max-h-32 overflow-y-auto">
                              <p className="text-sm">{formData.includedItems}</p>
                            </div>
                          </div>
                        )}
                        
                        {formData.excludedItems && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">What's Not Included</h4>
                            <div className="bg-white p-4 rounded-lg border max-h-32 overflow-y-auto">
                              <p className="text-sm">{formData.excludedItems}</p>
                            </div>
                          </div>
                        )}
                        
                        {formData.equipmentUsed && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Equipment & Tools</h4>
                            <div className="bg-white p-4 rounded-lg border max-h-32 overflow-y-auto">
                              <p className="text-sm">{formData.equipmentUsed}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Itinerary */}
                    {formData.itinerary.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {getSelectedCategoryName() === 'Local Tour Guide' || getSelectedCategoryName().includes('Combo') ? 'Tour Itinerary' : 
                           getSelectedCategoryName() === 'Trip Planner' ? 'Planning Steps' : 'Itinerary'}
                        </h4>
                        <div className="bg-white p-4 rounded-lg border max-h-40 overflow-y-auto">
                          <div className="space-y-2">
                            {formData.itinerary.map((step, index) => (
                              <div key={index} className="text-sm border-l-2 border-blue-300 pl-3">
                                <p className="font-medium">{step.stepNumber}. {step.title}</p>
                                <p className="text-gray-600">{step.time}</p>
                                {step.description && (
                                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">{step.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Images - Filter out images marked for deletion */}
                    {((existingExperience?.images && existingExperience.images.filter(img => !imagesToDelete.includes(img)).length > 0) || formData.images.length > 0) && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Photos</h4>
                        <div className="bg-white p-4 rounded-lg border">
                          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                            {/* Existing images - only show images not marked for deletion */}
                            {existingExperience?.images?.filter(imageUrl => !imagesToDelete.includes(imageUrl)).map((imageUrl, index) => (
                              <div key={`existing-${index}`} className="relative">
                                <SimpleImage
                                  imagePath={imageUrl}
                                  alt={`Experience ${index + 1}`}
                                  className="w-full h-16 object-cover rounded border"
                                  placeholderType="experience"
                                  category="experiences"
                                />
                                {index === 0 && (
                                  <div className="absolute bottom-0 left-0 right-0 bg-orange-600 text-white text-xs text-center py-0.5 rounded-b">
                                    Main
                                  </div>
                                )}
                              </div>
                            ))}
                            {/* New uploaded images */}
                            {formData.images.map((file, index) => (
                              <div key={`new-${index}`} className="relative">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`New ${index + 1}`}
                                  className="w-full h-16 object-cover rounded border border-green-300"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-green-600 text-white text-xs text-center py-0.5 rounded-b">
                                  New
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-gray-600 mt-2">
                            💡 {(existingExperience?.images?.filter(img => !imagesToDelete.includes(img)).length || 0) + formData.images.length} total images
                            {imagesToDelete.length > 0 && (
                              <span className="text-red-600 ml-2">({imagesToDelete.length} will be deleted)</span>
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Submission Guidelines */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">📋 Before Submitting</h3>
                    <div className="space-y-2 text-sm text-blue-800">
                      <div className="flex items-start space-x-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Double-check all information for accuracy</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Ensure your pricing is competitive and fair</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Review your photos and itinerary for completeness</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>Make sure all required fields are filled</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                      <p className="text-xs text-blue-700">
                        <strong>Review Process:</strong> Your edited experience will be reviewed by our team within 24-48 hours. 
                        You'll receive a notification once approved or if changes are needed.
                      </p>
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
                    disabled={draftLoading || reviewLoading || !formData.title || !formData.description || !formData.pricePerPackage || !formData.meetingPoint}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {draftLoading ? (
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
                    disabled={draftLoading || reviewLoading || !formData.title || !formData.description || !formData.pricePerPackage || !formData.meetingPoint}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {reviewLoading ? (
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
                    (currentStep === 1 && (!formData.title || !formData.description)) ||
                    (currentStep === 2 && (!formData.pricePerPackage || !formData.meetingPoint)) ||
                    (currentStep === 3 && (!formData.equipmentUsed && !formData.deliverables && !formData.includedItems)) ||
                    (currentStep === 4 && false) // Step 4 has no required fields
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
