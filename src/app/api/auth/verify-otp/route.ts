import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/jwt';
import { checkOtp } from '@/lib/otpStore';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required.' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ── Verify OTP ────────────────────────────────────────────────────────
    const result = checkOtp(normalizedEmail, otp.trim());

    if (result === 'not_found') {
      return NextResponse.json(
        { error: 'No OTP was requested for this email. Please request a new one.' },
        { status: 401 }
      );
    }

    if (result === 'expired') {
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 401 }
      );
    }

    if (result === 'max_attempts') {
      return NextResponse.json(
        { error: 'Too many incorrect attempts. Please request a new OTP.' },
        { status: 429 }
      );
    }

    if (result === 'invalid') {
      return NextResponse.json(
        { error: 'Incorrect OTP. Please check your email and try again.' },
        { status: 401 }
      );
    }

    // result === 'valid' ──────────────────────────────────────────────────

    // ── Fetch user ────────────────────────────────────────────────────────
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return NextResponse.json(
        { error: 'No account found. Please contact your admin.' },
        { status: 404 }
      );
    }

    // ── Create JWT session ────────────────────────────────────────────────
    const sessionToken = await encrypt({
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    });

    // ── Set httpOnly cookie ───────────────────────────────────────────────
    const cookieStore = await cookies();
    cookieStore.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    // ── Determine redirect ────────────────────────────────────────────────
    let redirectUrl = '/under-review';
    if (user.status === 'APPROVED') {
      redirectUrl = `/${user.role.toLowerCase()}`;
    }

    console.log(`[AUTH] ${normalizedEmail} logged in as ${user.role} → ${redirectUrl}`);

    return NextResponse.json({
      success: true,
      redirectUrl,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error('[verify-otp] Error:', error);
    return NextResponse.json({ error: 'Failed to verify OTP. Please try again.' }, { status: 500 });
  }
}
