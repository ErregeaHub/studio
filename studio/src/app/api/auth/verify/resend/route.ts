import { NextResponse } from 'next/server';
import { UserRepository } from '@/lib/repositories';
import { sendVerificationEmail } from '@/lib/email';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const userRepo = new UserRepository();
    const user = await userRepo.findByEmail(email);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.is_verified) {
      return NextResponse.json({ message: 'Account already verified' }, { status: 200 });
    }

    // Generate a new token
    const newToken = uuidv4();
    await userRepo.update(user.id, { verification_token: newToken });

    // Send the new email
    await sendVerificationEmail(email, newToken);

    return NextResponse.json({ message: 'Verification email resent successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Resend Verification API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
