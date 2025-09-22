// Master Data Types for Admin Dashboard

export interface Bank {
  id: number;
  bank_code: string;
  bank_name: string;
  bank_name_short?: string;
  swift_code?: string;
  country_code?: string;
  logo_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Country {
  id: number;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface City {
  id: number;
  name: string;
  country_id?: number;
  latitude?: number;
  longitude?: number;
  description?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  Country?: Country;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: 'general' | 'booking' | 'payment' | 'traveller' | 'host' | 'technical';
  is_active: boolean;
  is_featured: boolean;
  display_order?: number;
  view_count: number;
  helpful_count: number;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface Language {
  id: number;
  name: string;
  code: string;
  native_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// Form data interfaces for creating/editing
export interface BankFormData {
  bank_code: string;
  bank_name: string;
  bank_name_short?: string;
  swift_code?: string;
  country_code?: string;
  logo_url?: string;
  is_active: boolean;
}

export interface CountryFormData {
  name: string;
  code: string;
}

export interface CityFormData {
  name: string;
  country_id?: number;
  latitude?: number;
  longitude?: number;
  description?: string;
  image_url?: string;
  is_active: boolean;
}

export interface FAQFormData {
  question: string;
  answer: string;
  category: FAQ['category'];
  is_active: boolean;
  is_featured: boolean;
  display_order?: number;
  tags?: string[];
}

export interface LanguageFormData {
  name: string;
  code: string;
  native_name?: string;
  is_active: boolean;
}

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type BanksResponse = ApiResponse<Bank[]>;
export type BankResponse = ApiResponse<Bank>;
export type CountriesResponse = ApiResponse<Country[]>;
export type CountryResponse = ApiResponse<Country>;
export type CitiesResponse = ApiResponse<City[]>;
export type CityResponse = ApiResponse<City>;
export type FAQsResponse = ApiResponse<FAQ[]>;
export type FAQResponse = ApiResponse<FAQ>;
export type LanguagesResponse = ApiResponse<Language[]>;
export type LanguageResponse = ApiResponse<Language>;