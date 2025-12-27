import { NextResponse, NextRequest } from 'next/server';
import { MediaRepository } from '@/lib/repositories/media.repository';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
    }

    const mediaRepo = new MediaRepository();
    const media = await mediaRepo.findByIdWithDetails(parseInt(id));

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    return NextResponse.json(media);
  } catch (error: any) {
    console.error('API Error (Get Media by ID):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
    }

    const mediaRepo = new MediaRepository();

    // Get the authenticated user from Supabase
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Since our database uses integer IDs, we might need to map Supabase UUID to our DB user ID
    // For now, if your DB user ID is stored in Supabase user metadata or if you use email to lookup:
    const { UserRepository } = await import('@/lib/repositories');
    const userRepo = new UserRepository();
    const dbUser = await userRepo.findByEmail(user.email!);

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    const deleted = await mediaRepo.deleteMedia(parseInt(id), dbUser.id);

    if (!deleted) {
      return NextResponse.json({ error: 'Media not found or user not authorized to delete' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Media deleted successfully' });
  } catch (error: any) {
    console.error('API Error (Delete Media):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
