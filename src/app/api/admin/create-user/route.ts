import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/jwt';
import nodemailer from "nodemailer";
import { saveOtp } from "@/lib/otpStore";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { name, email, role } = await req.json();

    if (!name || !email || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email: normalizedEmail,
          role,
          status: 'APPROVED',
        },
      });

      if (role === 'MENTOR') {
        await tx.mentor.create({
          data: { userId: user.id },
        });
      } else if (role === 'INTERN') {
        await tx.internProfile.create({
          data: {
            userId: user.id,
            skills: [],
          },
        });
      }

      return user;
    });

    // Generate OTP for initial login
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    saveOtp(normalizedEmail, otp);

    // Send Welcome Email
    const hasRealCredentials = process.env.EMAIL_USER && process.env.EMAIL_PASSWORD && !process.env.EMAIL_USER.includes('your-email');
    if (hasRealCredentials) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: `"TARCIN Internship Portal" <${process.env.EMAIL_USER}>`,
          to: normalizedEmail,
          subject: `Welcome to TARCIN as ${role}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2>Hello ${name},</h2>
              <p>Your account as an <b>${role}</b> has been created by an administrator.</p>
              <p>You can now log in to the portal using this OTP:</p>
              <div style="background: #f4f7ff; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2563eb;">
                ${otp}
              </div>
              <p>Visit <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login">TARCIN Login</a> to get started.</p>
            </div>
          `,
        });
      } catch (err) {
        console.error("Failed to send welcome email:", err);
      }
    } else {
      console.log(`\n[DEV MODE] Created ${role}: ${normalizedEmail} | OTP: ${otp}\n`);
    }

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
