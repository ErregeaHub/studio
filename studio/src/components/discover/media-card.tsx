'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clapperboard, Layers, Play } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DiscoverMediaCardProps {
  media: {
    id: string;
    type: 'video' | 'photo';
    title: string;
    thumbnailUrl: string;
    likes: number;
    commentsCount: number;
    isGallery?: boolean;
    ratio?: string;
  };
}

export default function DiscoverMediaCard({ media }: DiscoverMediaCardProps) {
  return (
    <Link 
      href={`/media/${media.id}`}
      className={cn(
        "relative block overflow-hidden group cursor-pointer bg-muted",
        media.ratio || "aspect-square"
      )}
    >
      {/* Media Thumbnail */}
      <Image
        src={media.thumbnailUrl || '/placeholder-media.jpg'}
        alt={media.title}
        fill
        className="object-cover transition-opacity duration-300 group-hover:opacity-90"
        sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
      />

      {/* Content Indicator Icon (Top Right) */}
      <div className="absolute top-2 right-2 z-10 text-white drop-shadow-lg">
        {media.type === 'video' ? (
          <Clapperboard className="w-4 h-4 fill-white/20" />
        ) : media.isGallery ? (
          <Layers className="w-4 h-4 fill-white/20" />
        ) : null}
      </div>
    </Link>
  );
}
