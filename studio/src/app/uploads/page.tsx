'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UploadCloud, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useAuthGuard } from '@/hooks/use-auth-guard';

export default function UploadPage() {
  const { user, isLoading: isUserLoading } = useAuth();
  const { checkAuth } = useAuthGuard();
  const router = useRouter();
  const { toast } = useToast();

  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);
  const [preview, setPreview] = useState<{ url: string; type: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      checkAuth('upload media');
    }
  }, [user, isUserLoading, checkAuth]);
  
  useEffect(() => {
    return () => {
      if (preview?.url) {
        URL.revokeObjectURL(preview.url);
      }
    };
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (preview?.url) {
      URL.revokeObjectURL(preview.url);
    }
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreview({ url, type: selectedFile.type });
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const clearPreview = () => {
    if (preview?.url) {
      URL.revokeObjectURL(preview.url);
    }
    setPreview(null);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file && description.trim().length === 0) {
      toast({ variant: 'destructive', title: 'Missing Information', description: 'Please select a file or enter a description.' });
      setIsUploading(false);
      return;
    }

    if (!user) {
      toast({ variant: 'destructive', title: 'Authentication Required', description: 'Please log in to upload media.' });
      setIsUploading(false);
      return;
    }
    
    setIsUploading(true);

    try {
      const type = file ? (file.type.startsWith('video/') ? 'video' : 'photo') : 'text';
      
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      formData.append('title', file ? file.name.split('.')[0] : 'Text Post');
      formData.append('description', description);
      formData.append('type', type);
      formData.append('uploader_id', user.id.toString());

      // Generate thumbnail for videos
      if (type === 'video' && file) {
        try {
          const thumbnailBlob = await generateVideoThumbnail(file);
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload media');
      }
      
      toast({ title: 'Upload Complete!', description: 'Your media has been successfully uploaded.' });
      router.push(`/`);

    } catch (error: any) {
      console.error('Upload process failed:', error);
      toast({ variant: 'destructive', title: 'Upload Failed', description: error.message || 'An unknown error occurred.' });
    } finally {
      setIsUploading(false);
    }
  };

  const generateVideoThumbnail = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);
      video.muted = true;
      video.playsInline = true;

      video.onloadedmetadata = () => {
        // Seek to 1 second (or start) to get a good frame
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
  
  const canSubmit = !isUploading && !isUserLoading && (!!file || description.trim().length > 0) && !!user;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-black uppercase tracking-tight">Create Post</h1>
        <p className="text-muted-foreground font-medium">Share your creativity with the RedRAW community.</p>
      </div>

      <Card className="border-border/50 bg-secondary/10 rounded-3xl overflow-hidden shadow-none ring-1 ring-border/50">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Media File</label>
              {!preview ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative flex aspect-video cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-background/50 transition-all hover:border-primary/50 hover:bg-primary/5"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <UploadCloud className="h-8 w-8" />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm font-bold uppercase tracking-widest">Click to upload</p>
                    <p className="mt-1 text-xs text-muted-foreground uppercase tracking-tighter">MP4, PNG, JPG up to 50MB</p>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                    className="hidden"
                    required
                  />
                </div>
              ) : (
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black ring-1 ring-border/50">
                  {preview.type.startsWith('video/') ? (
                    <video src={preview.url} controls className="h-full w-full object-contain" />
                  ) : (
                    <Image src={preview.url} alt="Preview" fill className="object-contain" />
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-4 top-4 h-8 w-8 rounded-full shadow-lg"
                    onClick={clearPreview}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Description (SEO Rich)</label>
                <Textarea
                  placeholder="Tell us more about your creation..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px] rounded-xl border-border/50 bg-background focus-visible:ring-primary/20 font-medium resize-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button 
                type="button" 
                variant="ghost" 
                className="flex-1 rounded-full font-bold uppercase tracking-widest text-xs h-12"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 rounded-full font-bold uppercase tracking-widest text-xs h-12 shadow-lg shadow-primary/20"
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Publish Post'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
