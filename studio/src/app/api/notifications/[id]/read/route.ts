import { NextResponse } from 'next/server';
import { NotificationRepository } from '@/lib/repositories';

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: notifIdStr } = await context.params;
    const notifId = parseInt(notifIdStr);

    if (isNaN(notifId)) {
      return NextResponse.json({ error: 'Invalid Notification ID' }, { status: 400 });
    }

    const notifRepo = new NotificationRepository();
    await notifRepo.markAsRead(notifId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API Error (Mark Notification Read):', error);
    return NextResponse.json({ error: 'Failed to mark notification as read' }, { status: 500 });
  }
}
