import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StoryDetail from '@/components/StoryDetail';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // We'll fetch story data here for SEO metadata
  return {
    title: `Story - LocallyTrip.com`,
    description: 'Read inspiring travel stories from locals and travelers around the world.',
    keywords: 'travel story, local experience, travel blog, LocallyTrip',
  };
}

const StoryDetailPage: React.FC<Props> = ({ params }) => {
  const { slug } = params;

  if (!slug) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <StoryDetail slug={slug} />
    </div>
  );
};

export default StoryDetailPage;
