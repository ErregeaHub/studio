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
    <Link href={`/media/${media.id}`} className="group block active:scale-[0.98] transition-transform duration-200">
      <Card className="overflow-hidden border-none shadow-none bg-secondary/10">
        <CardContent className="p-0">
          <div className="relative aspect-video overflow-hidden bg-muted flex items-center justify-center rounded-xl">
            {thumbnailUrl ? (
              <Image
                src={media.type === 'video' && media.thumbnailUrl === media.mediaUrl
                  ? '/images/video-placeholder.jpg'
                  : thumbnailUrl}
                alt={media.title}
                fill
                className="object-cover"
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
            <Badge variant="secondary" className="absolute right-2 top-2 z-10 bg-background/80 backdrop-blur-sm border-none">
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
          <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
            <AvatarImage src={media.user.avatar} alt={media.user.name} />
            <AvatarFallback>{media.user.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground truncate">{media.user.name}</p>
            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 bg-secondary/20 px-2 py-1 rounded-full">
                <Heart className="h-3.5 w-3.5" />
                <span className="font-medium">{media.likes?.toLocaleString() || 0}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-secondary/20 px-2 py-1 rounded-full">
                <Eye className="h-3.5 w-3.5" />
                <span className="font-medium">{media.views?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
