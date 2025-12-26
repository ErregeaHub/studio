import { NextResponse } from 'next/server';
import { FollowRepository } from '@/lib/repositories';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userIdStr } = await context.params;
    const userId = parseInt(userIdStr);

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
    }

    const followRepo = new FollowRepository();
    const [followersCount, followingCount] = await Promise.all([
      followRepo.getFollowersCount(userId),
      followRepo.getFollowingCount(userId)
    ]);

    return NextResponse.json({ followersCount, followingCount });
  } catch (error: any) {
    console.error('API Error (Get User Stats):', error);
    if (error.message?.includes('timeout') || error.code === 'ETIMEDOUT') {
      return NextResponse.json({ error: 'Database connection timeout' }, { status: 504 });
    }
    return NextResponse.json({ error: 'Failed to fetch user stats' }, { status: 500 });
  }
}
