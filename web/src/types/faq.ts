/**
 * TypeScript types for FAQ components
 * These types prevent object rendering errors at compile time
 */

// Base renderable types
export type RenderableString = string;
export type RenderableNumber = number;
export type RenderableContent = RenderableString | RenderableNumber;

// Strict FAQ interface with only renderable properties
export interface FAQ {
  readonly id: RenderableString;
  readonly question: RenderableString;
  readonly answer: RenderableString;
  readonly category: RenderableString;
  readonly featured?: boolean;
  readonly viewCount?: RenderableNumber;
  readonly helpfulCount?: RenderableNumber;
  readonly tags?: readonly RenderableString[];
  readonly createdAt?: RenderableString;
}

// Type guard to validate FAQ data at runtime
export const isValidFAQ = (data: unknown): data is FAQ => {
  if (!data || typeof data !== 'object') return false;
  
  const faq = data as Record<string, unknown>;
  
  return (
    typeof faq.id === 'string' &&
    typeof faq.question === 'string' &&
    typeof faq.answer === 'string' &&
    typeof faq.category === 'string' &&
    (faq.featured === undefined || typeof faq.featured === 'boolean') &&
    (faq.viewCount === undefined || typeof faq.viewCount === 'number') &&
    (faq.helpfulCount === undefined || typeof faq.helpfulCount === 'number') &&
    (faq.tags === undefined || (Array.isArray(faq.tags) && faq.tags.every(tag => typeof tag === 'string'))) &&
    (faq.createdAt === undefined || typeof faq.createdAt === 'string')
  );
};

// Safe rendering utility for FAQ content
export const renderFAQSafeContent = <T extends RenderableContent | null | undefined>(
  value: T,
  fallback: RenderableString,
  fieldName?: string
): RenderableString => {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return String(value);
  }
  if (value === null || value === undefined) {
    return fallback;
  }
  
  // Log warning for objects to help with debugging
  if (typeof value === 'object') {
  }
  
  return fallback;
};

// FAQ list response type
export interface FAQResponse {
  success: boolean;
  faqs: FAQ[];
  message?: string;
  error?: string;
}

// Props for FAQ components
export interface FAQComponentProps {
  readonly faq: FAQ;
  readonly className?: RenderableString;
  readonly showCategory?: boolean;
  readonly onToggleHelpful?: (faqId: RenderableString) => void;
}

// Hook return type
export interface UseFAQsReturn {
  faqs: FAQ[];
  loading: boolean;
  error: string | null;
}

// Hook options interface
export interface UseFAQsOptions {
  category?: string;
  featured?: boolean;
  limit?: number;
}
