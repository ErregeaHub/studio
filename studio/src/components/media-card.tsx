import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Media } from '@/lib/types';
import { Eye, Heart, Clapperboard, Camera } from 'lucide-react';

interface MediaCardProps {
  media: Media;
}

export default function MediaCard({ media }: MediaCardProps) {
  const thumbnailUrl = media.thumbnailUrl;
  const imageHint = media.imageHint || `${media.type} titled ${media.title}`;

  return (
    <Link href={`/media/${media.id}`} className="group block">
      <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20">
        <CardContent className="p-0">
          <div className="relative aspect-video overflow-hidden bg-muted flex items-center justify-center">
            {thumbnailUrl ? (
              <Image
                src={media.type === 'video' && media.thumbnailUrl === media.mediaUrl
                  ? '/images/video-placeholder.jpg'
                  : thumbnailUrl}
                alt={media.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={imageHint}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                {media.type === 'video' ? (
                  <Clapperboard className="h-12 w-12 mb-2" />
                ) : (
                  <Camera className="h-12 w-12 mb-2" />
                )}
                <span className="text-xs font-medium uppercase tracking-wider">
                  {media.type}
                </span>
              </div>
            )}
            <Badge variant="secondary" className="absolute right-2 top-2 z-10">
              {media.type === 'video' ? (
                <Clapperboard className="mr-1 h-3 w-3" />
              ) : (
                <Camera className="mr-1 h-3 w-3" />
              )}
              {media.type === 'video' ? 'Video' : 'Photo'}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="flex items-start gap-4 p-4">
          <Avatar className="h-10 w-10 border-2 border-transparent group-hover:border-accent">
            <AvatarImage src={media.user.avatar} alt={media.user.name} />
            <AvatarFallback>{media.user.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-headline font-semibold leading-tight group-hover:text-accent truncate">{media.title}</p>
            <p className="text-sm text-muted-foreground truncate">{media.user.name}</p>
            <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>{media.likes?.toLocaleString() || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{media.views?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
