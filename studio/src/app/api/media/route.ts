import { NextResponse } from 'next/server';
import { MediaRepository } from '@/lib/repositories';
import { put } from '@vercel/blob';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const following = searchParams.get('following');
    const userId = searchParams.get('userId');

    const mediaRepo = new MediaRepository();
    let media;

    if (following === 'true' && userId) {
      media = await mediaRepo.findFollowingFeed(parseInt(userId));
    } else {
      media = await mediaRepo.findAllWithDetails();
    }

    return NextResponse.json(media);
  } catch (error: any) {
    console.error('API Error (Media List):', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const thumbnailFile = formData.get('thumbnail') as File | null;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const uploader_id = parseInt(formData.get('uploader_id') as string);
    const type = formData.get('type') as 'photo' | 'video';

    if (!file || !uploader_id) {
      return NextResponse.json({ error: 'File and Uploader ID are required' }, { status: 400 });
    }

    // Upload main file to Vercel Blob
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9_.-]/g, '-');
    const blob = await put(`uploads/${Date.now()}-${sanitizedFilename}`, file, {
      access: 'public',
    });
    const media_url = blob.url;

    let thumbnail_url: string;
    if (thumbnailFile) {
      const thumbBlob = await put(`uploads/thumb-${Date.now()}.jpg`, thumbnailFile, {
        access: 'public',
      });
      thumbnail_url = thumbBlob.url;
    } else if (type === 'video') {
      // Use a placeholder for videos if no thumbnail is provided or generated
      thumbnail_url = '/images/video-placeholder.svg';
    } else {
      thumbnail_url = media_url;
    }

    const mediaRepo = new MediaRepository();
    const newMedia = await mediaRepo.create({
      uploader_id,
      type,
      title,
      description,
      media_url,
      thumbnail_url,
    });

    return NextResponse.json(newMedia, { status: 201 });
  } catch (error: any) {
    console.error('API Error (Create Media):', error);
    return NextResponse.json({ error: error.message || 'Failed to create media' }, { status: 400 });
  }
}
