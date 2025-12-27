import { NextResponse } from 'next/server';
import { UserRepository } from '@/lib/repositories';
import { LoginSchema } from '@/lib/validations';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = LoginSchema.parse(body);

    const userRepo = new UserRepository();
    const user = await userRepo.findByEmail(email);

    if (!user || !user.password_hash) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!user.is_verified) {
      return NextResponse.json({ error: 'Account not verified. Please check your email.' }, { status: 403 });
    }

    // --- Supabase Session Management ---
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    // Sign in with Supabase to set the session cookie
    let { error: sbError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // --- Auto-Sync Legacy Users & Auto-Confirmation ---
    if (sbError && (sbError.code === 'invalid_credentials' || sbError.code === 'email_not_confirmed' || sbError.status === 400)) {
      console.log(`[AuthSync] User ${email} needs sync or confirmation. Code: ${sbError.code}.`);

      const { createAdminClient } = await import('@/lib/supabase/admin');
      const adminSupabase = createAdminClient();

      if (sbError.code === 'email_not_confirmed') {
        // User exists in Supabase but isn't confirmed
        const { data: { users }, error: listError } = await adminSupabase.auth.admin.listUsers();
        const sbUser = users.find(u => u.email === email);

        if (sbUser) {
          console.log(`[AuthSync] Auto-confirming existing user ${email}...`);
          await adminSupabase.auth.admin.updateUserById(sbUser.id, { email_confirm: true });
          const retry = await supabase.auth.signInWithPassword({ email, password });
          sbError = retry.error;
        }
      } else {
        // User likely missing from Supabase, attempt sync via Admin to auto-confirm
        console.log(`[AuthSync] Attempting legacy sync for ${email}...`);
        const { data: syncData, error: syncError } = await adminSupabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { username: user.username, display_name: user.display_name }
        });

        if (!syncError) {
          console.log(`[AuthSync] User ${email} synced and confirmed.`);
          const retry = await supabase.auth.signInWithPassword({ email, password });
          sbError = retry.error;
        } else {
          console.error('[AuthSync] Admin sync FAILED:', syncError);
        }
      }
    }
    // ----------------------------------------------------

    if (sbError) {
      console.error('Supabase Login Error Final:', sbError);
      return NextResponse.json({
        error: 'Authentication failed.',
        debug: {
          code: sbError.code,
          status: sbError.status,
          message: sbError.message
        }
      }, { status: 401 });
    }
    // ------------------------------------

    // Exclude sensitive information like password_hash before returning
    const { password_hash, verification_token, ...userWithoutSensitiveData } = user;

    return NextResponse.json(userWithoutSensitiveData, { status: 200 });
  } catch (error: any) {
    console.error('API Error (Login):', error);
    return NextResponse.json({ error: error.message || 'Failed to login' }, { status: 400 });
  }
}
