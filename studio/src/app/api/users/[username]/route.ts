import { NextResponse } from 'next/server';
import { UserRepository, MediaRepository } from '@/lib/repositories';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const userRepo = new UserRepository();
    const mediaRepo = new MediaRepository();

    const user = await userRepo.findByUsername(username);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const media = await mediaRepo.findByUploaderWithDetails(user.id);

    return NextResponse.json({
      user,
      media
    });
  } catch (error: any) {
    console.error('API Error (User Profile):', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}
