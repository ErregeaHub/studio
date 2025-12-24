import { NextResponse } from 'next/server';
import { MediaRepository } from '@/lib/repositories';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const mediaRepo = new MediaRepository();
    const media = await mediaRepo.findAllWithDetails();
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

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Directory might already exist
    }

    // Save main file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9_.-]/g, '-');
    const uniqueFilename = `${uuidv4()}-${sanitizedFilename}`;
    const filePath = join(uploadDir, uniqueFilename);
    await writeFile(filePath, buffer);
    const media_url = `/uploads/${uniqueFilename}`;

    let thumbnail_url: string;
    if (thumbnailFile) {
      const thumbBytes = await thumbnailFile.arrayBuffer();
      const thumbBuffer = Buffer.from(thumbBytes);
      const thumbFilename = `thumb-${uuidv4()}.jpg`;
      const thumbPath = join(uploadDir, thumbFilename);
      await writeFile(thumbPath, thumbBuffer);
      thumbnail_url = `/uploads/${thumbFilename}`;
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
