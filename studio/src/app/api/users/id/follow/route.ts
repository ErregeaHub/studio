import { NextResponse } from 'next/server';
import { FollowRepository, NotificationRepository } from '@/lib/repositories';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: followingIdStr } = await context.params;
    const followingId = parseInt(followingIdStr);
    const body = await request.json();
    const { followerId } = body;

    if (!followerId || isNaN(followingId)) {
      return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 });
    }

    if (parseInt(followerId) === followingId) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    const followRepo = new FollowRepository();
    const isFollowing = await followRepo.isFollowing(followerId, followingId);

    if (isFollowing) {
      await followRepo.unfollow(followerId, followingId);
      return NextResponse.json({ isFollowing: false });
    } else {
      await followRepo.follow(followerId, followingId);
      
      // Create notification
      try {
        const notifRepo = new NotificationRepository();
        await notifRepo.create({
          recipient_id: followingId,
          actor_id: followerId,
          type: 'follow'
        });
      } catch (err) {
        console.error('Failed to create notification:', err);
        // Continue even if notification fails
      }

      return NextResponse.json({ isFollowing: true });
    }
  } catch (error: any) {
    console.error('API Error (Toggle Follow):', error);
    return NextResponse.json({ error: 'Failed to toggle follow' }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: followingIdStr } = await context.params;
    const followingId = parseInt(followingIdStr);
    const { searchParams } = new URL(request.url);
    const followerIdStr = searchParams.get('follower_id');

    if (!followerIdStr || isNaN(followingId)) {
      return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 });
    }
    
    const followerId = parseInt(followerIdStr);
    const followRepo = new FollowRepository();
    const isFollowing = await followRepo.isFollowing(followerId, followingId);

    return NextResponse.json({ isFollowing });
  } catch (error: any) {
    console.error('API Error (Check Follow Status):', error);
    return NextResponse.json({ error: 'Failed to check follow status' }, { status: 500 });
  }
}
