'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Image, Film, X, Loader2, Globe, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AuthGuard } from '@/components/auth/AuthGuard';

const generateVideoThumbnail = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, video.duration / 2);
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(video.src);
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob from canvas'));
        }, 'image/jpeg', 0.8);
      } else {
        URL.revokeObjectURL(video.src);
        reject(new Error('Failed to get canvas context'));
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Failed to load video for thumbnail generation'));
    };
  });
};

interface CreatePostProps {
  onPostCreated?: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (e.g., 50MB limit)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 50MB.",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() || !user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      const type = selectedFile 
        ? (selectedFile.type.startsWith('video') ? 'video' : 'photo')
        : 'text';

      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      formData.append('title', ''); // Title is no longer used, but kept for DB compatibility
      formData.append('description', content);
      formData.append('uploader_id', user.id);
      formData.append('type', type);

      if (type === 'video' && selectedFile) {
        try {
          const thumbnailBlob = await generateVideoThumbnail(selectedFile);
          if (thumbnailBlob) {
            formData.append('thumbnail', thumbnailBlob, 'thumbnail.jpg');
          }
        } catch (err) {
          console.error('Failed to generate video thumbnail:', err);
          // Continue anyway, it will fallback to a placeholder
        }
      }

      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setContent('');
        removeFile();
        toast({
          title: "Post created!",
          description: "Your post has been shared with the community.",
        });
        if (onPostCreated) onPostCreated();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create post');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  const charLimit = 280;
  const isOverLimit = content.length > charLimit;

  return (
    <AuthGuard action="create posts" mode="dialog">
      <Card className="border-none bg-background rounded-none border-b border-border/50 p-4 transition-all duration-300">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-background shadow-sm">
            <AvatarImage src={user?.avatar_url || ''} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold uppercase font-action text-xs">
              {user?.display_name?.substring(0, 2) || user?.username?.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary/30 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <Globe className="h-3 w-3" />
                  <span>Public</span>
                </div>
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's happening?"
                className="w-full resize-none bg-transparent text-lg outline-none placeholder:text-muted-foreground/50 min-h-[100px] py-2 leading-relaxed"
                disabled={isSubmitting}
              />
            </div>

            {previewUrl && (
              <div className="relative mt-2 rounded-2xl overflow-hidden border border-border/50 group bg-secondary/20 ring-1 ring-border/30">
                {selectedFile?.type.startsWith('video') ? (
                  <video src={previewUrl} className="w-full h-auto max-h-[450px] object-contain" controls />
                ) : (
                  <img src={previewUrl} alt="Preview" className="w-full h-auto max-h-[450px] object-contain mx-auto" />
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-3 right-3 h-8 w-8 rounded-full opacity-0 active:opacity-100 transition-all duration-200 active:scale-110 shadow-lg"
                  onClick={removeFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          
          <div className="flex items-center justify-between border-t border-border/20 pt-4 mt-2">
            <div className="flex items-center gap-1">
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileSelect}
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-primary active:bg-primary/10 rounded-full transition-colors"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
                title="Add Photo"
              >
                <Image className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-primary active:bg-primary/10 rounded-full transition-colors"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
                title="Add Video"
              >
                <Film className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-primary active:bg-primary/10 rounded-full transition-colors"
                disabled={isSubmitting}
                title="Add Poll"
              >
                
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-primary active:bg-primary/10 rounded-full transition-colors"
                disabled={isSubmitting}
                title="Emoji"
              >
                
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={cn(
                "text-[11px] font-bold font-action transition-colors",
                isOverLimit ? "text-destructive" : "text-muted-foreground",
                content.length > charLimit * 0.8 ? "opacity-100" : "opacity-0"
              )}>
                {content.length} / {charLimit}
              </div>
              
              <Button 
                size="sm"
                className={cn(
                  "rounded-full px-6 font-bold uppercase tracking-widest font-action transition-all shadow-md h-9",
                  content.trim() && !isSubmitting && !isOverLimit 
                    ? "bg-primary active:bg-primary/90 text-white translate-y-0 opacity-100" 
                    : "bg-primary/30 text-white/50 cursor-not-allowed translate-y-0.5 opacity-70"
                )}
                disabled={!content.trim() || isSubmitting || isOverLimit}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Posting</span>
                  </div>
                ) : 'Post'}
              </Button>
            </div>
            </div>
          </div>
        </div>
      </Card>
    </AuthGuard>
  );
}
