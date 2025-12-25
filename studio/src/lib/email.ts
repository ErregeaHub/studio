import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || process.env.EMAIL_PASS);

export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
  const verificationLink = `${baseUrl}/verify?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'RedRAW <onboarding@resend.dev>',
      to: email,
      subject: 'Verify your RedRAW account',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #000; font-weight: 800; text-transform: uppercase; letter-spacing: -0.025em;">Welcome to RedRAW!</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
            Thank you for signing up. Please verify your email address to activate your account.
          </p>
          <div style="margin: 32px 0;">
            <a href="${verificationLink}" 
               style="background-color: #000; color: #fff; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 12px;">
            If you didn't create an account, you can safely ignore this email.
          </p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em;">
            RedRAW Media &bull; Digital Studio Platform
          </p>
        </div>
      `,
    });

    if (error) {
      if ((error as any).statusCode === 403 || error.name === 'validation_error') {
        console.error('Resend Restriction: You are using a test domain. You can only send emails to your own registered email address (gardaqurajaaa@gmail.com).');
      } else {
        console.error('Resend API Error:', error);
      }
      return;
    }

    console.log(`Verification email sent via Resend to ${email}:`, data?.id);
  } catch (error) {
    console.error('Unexpected error sending verification email:', error);
  }
}
