import { NextResponse } from 'next/server';
import { UserRepository } from '@/lib/repositories';
import { put } from '@vercel/blob';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json({ error: 'No avatar file provided' }, { status: 400 });
    }

    // Upload to Vercel Blob
    const filename = `avatars/${id}-${Date.now()}.${file.name.split('.').pop()}`;
    const blob = await put(filename, file, {
      access: 'public',
    });

    // Update user in database
    const userRepo = new UserRepository();
    const updatedUser = await userRepo.update(parseInt(id), {
      avatar_url: blob.url,
    });

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error('API Error (Upload Avatar):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
