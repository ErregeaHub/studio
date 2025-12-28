import { Metadata } from 'next';
import { MediaRepository } from '@/lib/repositories';
import JsonLd from '@/components/json-ld';
import { getBaseUrl } from '@/lib/urls';

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const mediaRepo = new MediaRepository();
  const media = await mediaRepo.findByIdWithDetails(parseInt(id));

  if (!media) {
    return {
      title: 'Media Not Found',
    };
  }

  const baseUrl = getBaseUrl();

  return {
    title: media.title,
    description: media.description || `Check out this ${media.type} on RedRAW`,
    alternates: {
      canonical: `/media/${id}`,
    },
    openGraph: {
      title: media.title || 'Post',
      description: media.description,
      url: `${baseUrl}/media/${id}`,
      type: media.type === 'video' ? 'video.other' : 'article',
      images: media.thumbnail_url ? [
        {
          url: media.thumbnail_url,
          width: 1200,
          height: 630,
          alt: media.title || 'Post',
        },
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: media.title || 'Post',
      description: media.description,
      images: media.thumbnail_url ? [media.thumbnail_url] : [],
    },
  };
}

export default async function MediaLayout({ params, children }: Props) {
  const { id } = await params;
  const mediaRepo = new MediaRepository();
  const media = await mediaRepo.findByIdWithDetails(parseInt(id));

  if (!media) return <>{children}</>;

  const baseUrl = getBaseUrl();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': media.type === 'video' ? 'VideoObject' : media.type === 'photo' ? 'ImageObject' : 'SocialMediaPosting',
    name: media.title || 'Post',
    description: media.description,
    thumbnailUrl: media.thumbnail_url || undefined,
    contentUrl: media.media_url || undefined,
    uploadDate: media.created_at,
    articleBody: media.type === 'text' ? media.description : undefined,
    author: {
      '@type': 'Person',
      name: media.display_name,
      url: `${baseUrl}/profile/${media.username}`,
    },
    interactionStatistic: [
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/LikeAction',
        userInteractionCount: media.likes_count,
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/WatchAction',
        userInteractionCount: media.views_count,
      },
    ],
  };

  return (
    <>
      <JsonLd data={structuredData} />
      {children}
    </>
  );
}
