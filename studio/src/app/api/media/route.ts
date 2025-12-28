import { NextResponse } from 'next/server';
import { MediaRepository } from '@/lib/repositories';
import { put } from '@vercel/blob';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const following = searchParams.get('following');
    const userId = searchParams.get('userId');
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = (searchParams.get('sort') || 'newest') as 'newest' | 'popular' | 'most-viewed';

    const mediaRepo = new MediaRepository();
    let media: any[];

    if (following === 'true' && userId) {
      media = await mediaRepo.findFollowingPaginated(parseInt(userId), cursor, limit);
    } else {
      media = await mediaRepo.findPaginated(cursor, limit, sort);
    }

    // Return paginated response
    return NextResponse.json({
      posts: media,
      nextCursor: media.length > 0 ? media[media.length - 1].id.toString() : null,
      hasMore: media.length === limit,
    });
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
    const type = formData.get('type') as 'photo' | 'video' | 'text';

    // Get the authenticated user from Supabase
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Map Supabase user to DB user
    const { UserRepository } = await import('@/lib/repositories');
    const userRepo = new UserRepository();
    const dbUser = await userRepo.findByEmail(user.email!);

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    const uploader_id = dbUser.id;

    let media_url = '';
    let thumbnail_url = '';

    if (file) {
      // Upload main file to Vercel Blob
      const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9_.-]/g, '-');
      const blob = await put(`uploads/${Date.now()}-${sanitizedFilename}`, file, {
        access: 'public',
      });
      media_url = blob.url;

      if (thumbnailFile) {
        const thumbBlob = await put(`uploads/thumb-${Date.now()}.jpg`, thumbnailFile, {
          access: 'public',
        });
        thumbnail_url = thumbBlob.url;
      } else if (type === 'video') {
        thumbnail_url = '/images/video-placeholder.svg';
      } else {
        thumbnail_url = media_url;
      }
    }

    const mediaRepo = new MediaRepository();
    const newMedia = await mediaRepo.create({
      uploader_id,
      type,
      title: title || (type === 'text' ? 'Text Post' : 'Untitled'),
      description,
      media_url: media_url || null,
      thumbnail_url: thumbnail_url || null,
    });

    return NextResponse.json(newMedia, { status: 201 });
  } catch (error: any) {
    console.error('API Error (Create Media):', error);
    return NextResponse.json({ error: error.message || 'Failed to create media' }, { status: 400 });
  }
}
