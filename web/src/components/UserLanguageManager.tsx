'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '../hooks/useToast';
import { useLanguagesAutocomplete } from '../hooks/useLanguagesAutocomplete';
import { authAPI } from '../services/authAPI';
import ConfirmDialog from './ConfirmDialog';

interface Language {
  id: number;
  name: string;
  nativeName?: string;
  code: string;
}

interface UserLanguage {
  id: string;
  languageId: number;
  proficiency: string;
  isActive: boolean;
  Language: Language;
}

interface UserLanguageManagerProps {
  userLanguages: UserLanguage[];
  onLanguagesUpdate: () => void;
}

interface DeleteDialogState {
  isOpen: boolean;
  languageId: string | null;
  languageName: string;
}

const PROFICIENCY_LEVELS = [
  { value: 'beginner', label: 'Beginner', description: 'Basic words and phrases' },
  { value: 'intermediate', label: 'Intermediate', description: 'Can have simple conversations' },
  { value: 'advanced', label: 'Advanced', description: 'Fluent in most situations' },
  { value: 'native', label: 'Native', description: 'Native speaker level' }
];

const PROFICIENCY_COLORS: Record<string, string> = {
  beginner: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  intermediate: 'bg-blue-100 text-blue-800 border-blue-200',
  advanced: 'bg-green-100 text-green-800 border-green-200',
  native: 'bg-purple-100 text-purple-800 border-purple-200'
};

export default function UserLanguageManager({ userLanguages = [], onLanguagesUpdate }: UserLanguageManagerProps) {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLanguageId, setSelectedLanguageId] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedProficiency, setSelectedProficiency] = useState('intermediate');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    isOpen: false,
    languageId: null,
    languageName: ''
  });
  const { showToast } = useToast();
  
  // Debug: Log received userLanguages
  useEffect(() => {
    console.log('🔍 UserLanguageManager - Received userLanguages:', userLanguages);
    console.log('📊 UserLanguageManager - Active languages count:', userLanguages.filter(ul => ul.isActive).length);
  }, [userLanguages]);
  
  // Language search functionality
  const { searchLanguages, searchResults, searchLoading } = useLanguagesAutocomplete();

  // Handle search query changes
  useEffect(() => {
    console.log('🔍 Search query changed:', searchQuery);
    if (searchQuery.trim()) {
      console.log('🔍 Calling searchLanguages with:', searchQuery);
      searchLanguages(searchQuery);
    }
  }, [searchQuery, searchLanguages]);

  const getAuthHeaders = () => {
    const token = authAPI.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    setSelectedLanguageId(language.id);
    setSearchQuery(language.name);
    setShowSuggestions(false);
  };

  const addLanguage = async () => {
    if (!selectedLanguage) {
      showToast('Please select a language', 'error');
      return;
    }

    // Check if language already exists
    const existingLanguage = userLanguages.find(
      ul => ul.languageId === selectedLanguage.id && ul.isActive
    );
    
    if (existingLanguage) {
      showToast('This language is already in your list', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/user-languages', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          languageId: selectedLanguage.id,
          proficiency: selectedProficiency
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add language');
      }
      
      if (data.success) {
        showToast('Language added successfully', 'success');
        setSelectedLanguageId(null);
        setSelectedLanguage(null);
        setSelectedProficiency('intermediate');
        setSearchQuery('');
        setIsEditing(false);
        onLanguagesUpdate();
      } else {
        throw new Error(data.message || 'Failed to add language');
      }
    } catch (error) {
      console.error('Error adding user language:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add language';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateLanguage = async (userLanguageId: string, newProficiency: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/user-languages/${userLanguageId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          proficiency: newProficiency
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update language');
      }
      
      if (data.success) {
        showToast('Language updated successfully', 'success');
        onLanguagesUpdate();
      } else {
        throw new Error(data.message || 'Failed to update language');
      }
    } catch (error) {
      console.error('Error updating language:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update language';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (userLanguageId: string, languageName: string) => {
    setDeleteDialog({
      isOpen: true,
      languageId: userLanguageId,
      languageName
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.languageId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/user-languages/${deleteDialog.languageId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove language');
      }
      
      if (data.success) {
        showToast('Language removed successfully', 'success');
        setDeleteDialog({ isOpen: false, languageId: null, languageName: '' });
        onLanguagesUpdate();
      } else {
        throw new Error(data.message || 'Failed to remove language');
      }
    } catch (error) {
      console.error('Error removing language:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove language';
      showToast(errorMessage, 'error');
      setDeleteDialog({ isOpen: false, languageId: null, languageName: '' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ isOpen: false, languageId: null, languageName: '' });
  };

  // Filter available languages (exclude already added ones)
  const availableLanguages = searchResults.filter(lang => 
    !userLanguages.some(ul => ul.languageId === lang.id && ul.isActive)
  );

  // Debug searchResults
  useEffect(() => {
    console.log('🔍 Search results updated:', searchResults);
    console.log('🔍 Available languages:', availableLanguages.length);
    console.log('🔍 Show suggestions:', showSuggestions);
  }, [searchResults, availableLanguages, showSuggestions]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Languages Spoken</h3>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            + Add Language
          </button>
        )}
      </div>

      {/* Current Languages */}
      <div className="space-y-3">
        {userLanguages.filter(ul => ul.isActive).map((userLanguage) => (
          <div key={userLanguage.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div>
                <span className="font-medium text-gray-900">
                  {userLanguage.Language.name}
                </span>
                {userLanguage.Language.nativeName && (
                  <span className="text-sm text-gray-500 ml-2">
                    ({userLanguage.Language.nativeName})
                  </span>
                )}
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${PROFICIENCY_COLORS[userLanguage.proficiency]}`}>
                {PROFICIENCY_LEVELS.find(p => p.value === userLanguage.proficiency)?.label}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                value={userLanguage.proficiency}
                onChange={(e) => updateLanguage(userLanguage.id, e.target.value)}
                disabled={loading}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {PROFICIENCY_LEVELS.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => handleDeleteClick(userLanguage.id, userLanguage.Language.name)}
                disabled={loading}
                className="text-red-600 hover:text-red-700 p-1"
                title="Remove language"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {userLanguages.filter(ul => ul.isActive).length === 0 && (
          <div className="p-4 text-center">
            <p className="text-gray-500 text-sm italic mb-2">No languages added yet</p>
            <p className="text-xs text-gray-400">
              Debug: Total userLanguages: {userLanguages.length} | 
              Active: {userLanguages.filter(ul => ul.isActive).length}
            </p>
          </div>
        )}
      </div>

      {/* Add New Language Form */}
      {isEditing && (
        <div className="p-4 border border-gray-200 rounded-lg bg-white">
          <h4 className="font-medium text-gray-900 mb-3">Add New Language</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setSearchQuery(newValue);
                  setSelectedLanguage(null);
                  setSelectedLanguageId(null);
                  // Show suggestions as soon as user starts typing
                  if (newValue.trim()) {
                    setShowSuggestions(true);
                  }
                }}
                onFocus={() => {
                  if (searchQuery.trim()) {
                    setShowSuggestions(true);
                  }
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Type to search languages..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              
              {/* Autocomplete Suggestions */}
              {showSuggestions && availableLanguages.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {availableLanguages.map((language: Language) => (
                    <button
                      key={language.id}
                      type="button"
                      onClick={() => handleLanguageSelect(language)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 flex justify-between items-center transition-colors"
                    >
                      <span className="font-medium">{language.name}</span>
                      <span className="text-sm text-gray-500">{language.nativeName}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {searchLoading && (
                <div className="absolute right-3 top-9">
                  <div className="animate-spin h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                </div>
              )}
              
              {searchQuery && !searchLoading && availableLanguages.length === 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-gray-500 text-sm">
                  No languages found matching "{searchQuery}"
                </div>
              )}
              
              {selectedLanguage && (
                <div className="text-sm text-green-600 bg-green-50 p-2 rounded mt-2">
                  Selected: {selectedLanguage.name} {selectedLanguage.nativeName && `(${selectedLanguage.nativeName})`}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proficiency Level
              </label>
              <select
                value={selectedProficiency}
                onChange={(e) => setSelectedProficiency(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {PROFICIENCY_LEVELS.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label} - {level.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setSelectedLanguageId(null);
                setSelectedLanguage(null);
                setSelectedProficiency('intermediate');
                setSearchQuery('');
              }}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addLanguage}
              disabled={loading || !selectedLanguageId}
              className="px-3 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
            >
              {loading ? 'Adding...' : 'Add Language'}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Remove Language"
        message={`Are you sure you want to remove "${deleteDialog.languageName}" from your language list? This action cannot be undone.`}
        confirmText="Remove Language"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        type="danger"
        loading={loading}
      />
    </div>
  );
}