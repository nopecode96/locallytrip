import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StoryDetail from '@/components/StoryDetail';
import { getServerBackendUrl } from '@/utils/serverBackend';

interface Props {
  params: { slug: string };
}

async function fetchStoryForMetadata(slug: string) {
  try {
    const backendUrl = getServerBackendUrl();
    const response = await fetch(
      `${backendUrl}/stories/slug/${encodeURIComponent(slug)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching story for metadata:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  
  const story = await fetchStoryForMetadata(slug);
  
  if (!story) {
    return {
      title: 'Story Not Found - LocallyTrip.com',
      description: 'The story you are looking for could not be found.',
    };
  }

  // Use meta fields if available, fallback to story data
  const title = story.meta?.title || story.title || 'LocallyTrip Story';
  const description = story.meta?.description || story.excerpt || 'Discover amazing travel stories and experiences from local travelers.';
  const keywords = story.keywords ? story.keywords.join(', ') : 'travel, story, local experience, LocallyTrip';
  
  // Generate Open Graph image URL
  const ogImageUrl = story.coverImage 
    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/images/stories/${story.coverImage}`
    : `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/favicon.svg`;

  return {
    title: `${title} - LocallyTrip.com`,
    description,
    keywords,
    authors: [{ name: story.author?.name || 'LocallyTrip' }],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/stories/${slug}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      authors: [story.author?.name || 'LocallyTrip'],
      publishedTime: story.createdAt,
      modifiedTime: story.updatedAt,
      tags: story.tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: `@${story.author?.name?.replace(/\s+/g, '').toLowerCase() || 'locallytrip'}`,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/stories/${slug}`,
    },
  };
}

const StoryDetailPage: React.FC<Props> = async ({ params }) => {
  const { slug } = params;

  if (!slug) {
    notFound();
  }

  // Fetch story data for structured data
  const story = await fetchStoryForMetadata(slug);

  // Generate structured data (JSON-LD) for SEO
  const structuredData = story ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": story.title,
    "description": story.excerpt || story.meta?.description,
    "image": story.coverImage 
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/images/stories/${story.coverImage}`
      : `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/og-image.jpg`,
    "author": {
      "@type": "Person",
      "name": story.author?.name || 'LocallyTrip'
    },
    "publisher": {
      "@type": "Organization",
      "name": "LocallyTrip",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/logo.png`
      }
    },
    "datePublished": story.createdAt,
    "dateModified": story.updatedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/stories/${slug}`
    },
    "keywords": story.keywords?.join(', ') || 'travel, story, local experience',
    "articleSection": "Travel Stories",
    "wordCount": story.content?.length || 0,
    "readingTime": story.readingTime || 5,
    "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/stories/${slug}`,
    "locationCreated": story.location ? {
      "@type": "Place",
      "name": story.location.name,
      "addressCountry": story.location.country
    } : undefined
  } : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
      <StoryDetail slug={slug} />
    </div>
  );
};

export default StoryDetailPage;
