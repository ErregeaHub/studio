import { NextResponse } from 'next/server';
import { NotificationRepository } from '@/lib/repositories';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userIdStr = searchParams.get('userId');

    if (!userIdStr) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const notifRepo = new NotificationRepository();
    const notifications = await notifRepo.findByRecipient(parseInt(userIdStr));

    return NextResponse.json(notifications);
  } catch (error: any) {
    console.error('API Error (Get Notifications):', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}
