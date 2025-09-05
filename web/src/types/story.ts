// Story interface matching both API response and StoriesContent expectations
export interface Story {
  id: number | string; // Support both
  title: string;
  slug?: string;
  excerpt: string;
  content?: string; // Made optional since API doesn't always return it
  
  // API format fields
  authorName?: string; // From API
  authorImage?: string; // From API
  location?: string; // From API
  image?: string; // From API
  publishedAt?: string; // From API
  
  // StoriesContent format fields
  imageUrl?: string; // For StoriesContent
  author?: {
    id: string;
    name: string;
    avatar: string;
  }; // For StoriesContent
  createdAt?: string; // For StoriesContent
  
  // Common fields
  readingTime?: number;
  views?: number;
  likes?: number;
  likeCount?: number; // New field from backend
  commentsCount?: number;
  commentCount?: number; // New field from backend
  category?: string;
  featured?: boolean;
}

// Type guard to check if an object is a valid Story (flexible for both formats)
export function isValidStory(obj: any): obj is Story {
  return (
    obj &&
    typeof obj === 'object' &&
    (typeof obj.id === 'number' || typeof obj.id === 'string') &&
    typeof obj.title === 'string' &&
    typeof obj.excerpt === 'string' &&
    // Accept either format for author
    (obj.authorName || obj.author?.name) &&
    // Accept either format for image  
    (obj.image || obj.imageUrl)
  );
}

// Safe story title renderer to prevent object rendering in JSX
export function safeStoryTitle(story: Story | any): string {
  if (isValidStory(story)) {
    return story.title;
  }
  if (story && typeof story === 'object' && story.title) {
    return String(story.title);
  }
  return 'Untitled Story';
}

// Safe story excerpt renderer
export function safeStoryExcerpt(story: Story | any): string {
  if (isValidStory(story)) {
    return story.excerpt;
  }
  if (story && typeof story === 'object' && story.excerpt) {
    return String(story.excerpt);
  }
  return 'No excerpt available';
}

// Safe author name renderer
export function safeAuthorName(story: Story | any): string {
  if (story?.author?.name) {
    return story.author.name;
  }
  if (story?.authorName) {
    return story.authorName;
  }
  return 'Unknown Author';
}

export interface StoriesResponse {
  success: boolean;
  stories: Story[];
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}
