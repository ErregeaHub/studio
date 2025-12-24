import { NextResponse } from 'next/server';
import { UserRepository } from '@/lib/repositories';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Verification token is missing' }, { status: 400 });
    }

    const userRepo = new UserRepository();
    const user = await userRepo.findByVerificationToken(token);

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired verification token' }, { status: 404 });
    }

    if (user.is_verified) {
      return NextResponse.json({ message: 'Account already verified' }, { status: 200 });
    }

    await userRepo.update(user.id, { is_verified: true, verification_token: null });

    return NextResponse.json({ message: 'Account verified successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Email verification API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
