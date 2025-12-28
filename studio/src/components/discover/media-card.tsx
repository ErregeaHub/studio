'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clapperboard, Layers, Play, Type } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DiscoverMediaCardProps {
  media: {
    id: string;
    type: 'video' | 'photo' | 'text';
    title: string;
    thumbnailUrl?: string;
    description?: string;
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
      {/* Media Content */}
      {media.type === 'text' ? (
        <div className="flex h-full w-full flex-col items-center justify-center bg-secondary/20 p-4 text-center">
          <Type className="mb-2 h-6 w-6 text-muted-foreground/50" />
          <p className="text-[10px] font-medium line-clamp-4 text-muted-foreground leading-relaxed italic">
            {media.description}
          </p>
        </div>
      ) : (
        <Image
          src={media.thumbnailUrl || '/placeholder-media.jpg'}
          alt={media.title}
          fill
          className="object-cover transition-opacity duration-300 active:opacity-80"
          sizes="33vw"
        />
      )}

      {/* Content Indicator Icon (Top Right) */}
      <div className="absolute top-2 right-2 z-10 text-white drop-shadow-lg">
        {media.type === 'video' ? (
          <Clapperboard className="w-4 h-4 fill-white/20" />
        ) : media.type === 'text' ? (
          <Type className="w-4 h-4 text-primary/50" />
        ) : media.isGallery ? (
          <Layers className="w-4 h-4 fill-white/20" />
        ) : null}
      </div>
    </Link>
  );
}
