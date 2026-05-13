import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { saveOtp, checkRateLimit, incrementRateLimit } from '@/lib/otpStore';

// Create transporter once
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ── Rate limiting ──────────────────────────────────────────────────────
    if (checkRateLimit(normalizedEmail)) {
      console.warn(`[OTP] Rate limit hit for ${normalizedEmail}`);
      return NextResponse.json(
        { error: 'Too many OTP requests. Please wait 15 minutes.' },
        { status: 429 }
      );
    }

    // ── Only registered users can receive OTP ──────────────────────────────
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      console.log(`[OTP] Email not found: ${normalizedEmail}`);
      return NextResponse.json({ message: 'If this email is registered, an OTP has been sent.' });
    }

    // ── CRITICAL: Save OTP FIRST before attempting email ───────────────────
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    saveOtp(normalizedEmail, otp);
    incrementRateLimit(normalizedEmail);

    // ── Attempt email delivery ─────────────────────────────────────────────
    const isDev = process.env.NODE_ENV !== 'production';
    const hasRealCredentials =
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASSWORD &&
      !process.env.EMAIL_USER.includes('your-email');

    if (hasRealCredentials) {
      try {
        await transporter.sendMail({
          from: `"TARCIN Internship Portal" <${process.env.EMAIL_USER}>`,
          to: normalizedEmail,
          subject: 'Your TARCIN Login OTP',
          html: `
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"></head>
            <body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
                <tr><td align="center">
                  <table width="100%" style="max-width:520px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
                    <tr>
                      <td style="background:linear-gradient(135deg,#2563eb,#3b82f6);padding:32px;text-align:center;">
                        <span style="color:#fff;font-weight:900;font-size:22px;letter-spacing:1px;">TARCIN</span>
                        <p style="color:rgba(255,255,255,0.85);font-size:12px;margin:8px 0 0;letter-spacing:2px;text-transform:uppercase;">Internship Portal</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:40px;">
                        <p style="margin:0 0 8px;font-size:15px;color:#374151;">Hello <strong>${user.name}</strong>,</p>
                        <p style="margin:0 0 28px;font-size:14px;color:#6b7280;line-height:1.6;">Use the code below to sign in. Expires in <strong>10 minutes</strong>.</p>
                        <div style="background:#eff6ff;border:2px dashed #93c5fd;border-radius:12px;padding:28px;text-align:center;margin-bottom:28px;">
                          <p style="margin:0 0 6px;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:2px;">One-Time Password</p>
                          <span style="font-size:42px;font-weight:900;letter-spacing:12px;color:#2563eb;font-family:'Courier New',monospace;">${otp}</span>
                        </div>
                        <p style="margin:0;font-size:12px;color:#9ca3af;">If you did not request this, ignore this email.</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background:#f8fafc;padding:16px 40px;border-top:1px solid #e5e7eb;text-align:center;">
                        <p style="margin:0;font-size:11px;color:#9ca3af;">© 2026 TARCIN · Unlock The Tech · Unleash The World</p>
                      </td>
                    </tr>
                  </table>
                </td></tr>
              </table>
            </body>
            </html>
          `,
        });
        console.log(`[OTP] Email sent successfully to ${normalizedEmail}`);
      } catch (emailError: any) {
        console.error('[OTP] Email delivery failed:', emailError.message);
        if (isDev) {
          console.log('\n╔══════════════════════════════════════════════╗');
          console.log('║  [DEV FALLBACK] Email failed — use this OTP  ║');
          console.log(`║  Email : ${normalizedEmail.padEnd(35)}║`);
          console.log(`║  OTP   : ${otp.padEnd(35)}║`);
          console.log('╚══════════════════════════════════════════════╝\n');
        } else {
          return NextResponse.json(
            { error: 'Failed to send OTP email. Please try again.' },
            { status: 500 }
          );
        }
      }
    } else {
      console.log('\n╔══════════════════════════════════════════════╗');
      console.log('║  [DEV MODE] No email credentials configured  ║');
      console.log(`║  Email : ${normalizedEmail.padEnd(35)}║`);
      console.log(`║  OTP   : ${otp.padEnd(35)}║`);
      console.log('╚══════════════════════════════════════════════╝\n');
    }

    return NextResponse.json({ message: 'If this email is registered, an OTP has been sent.' });

  } catch (error) {
    console.error('[send-otp] Unexpected error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
