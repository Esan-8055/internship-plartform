"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";
import { saveOtp } from "@/lib/otpStore";
import { createNotification } from "@/lib/notifications";

export async function inviteMentorAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const domainId = formData.get("domainId") as string;

  if (!name || !email || !domainId) {
    throw new Error("Missing required fields");
  }

  const normalizedEmail = email.toLowerCase().trim();

  // 1. Find or create the user with MENTOR role
  const user = await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: {
      role: "MENTOR",
      status: "APPROVED",
    },
    create: {
      name,
      email: normalizedEmail,
      role: "MENTOR",
      status: "APPROVED",
    }
  });

  // 2. Find or create the mentor profile linked to the domain
  await prisma.mentor.upsert({
    where: { userId: user.id },
    update: {
      domainId: domainId,
    },
    create: {
      userId: user.id,
      domainId: domainId,
    }
  });

  // 4. Generate and save OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  saveOtp(normalizedEmail, otp);

  // 5. Send welcome email with OTP
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
        subject: 'Welcome to TARCIN as a Mentor',
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
                      <p style="margin:0 0 28px;font-size:14px;color:#6b7280;line-height:1.6;">You have been invited as a Mentor to TARCIN. Use the code below to log in for the first time. Expires in <strong>10 minutes</strong>.</p>
                      <div style="background:#eff6ff;border:2px dashed #93c5fd;border-radius:12px;padding:28px;text-align:center;margin-bottom:28px;">
                        <p style="margin:0 0 6px;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:2px;">Your Login Code</p>
                        <span style="font-size:42px;font-weight:900;letter-spacing:12px;color:#2563eb;font-family:'Courier New',monospace;">${otp}</span>
                      </div>
                      <p style="margin:0;font-size:12px;color:#9ca3af;">Please go to our login page to get started.</p>
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
      console.log(`[MENTOR INVITE] OTP sent to ${normalizedEmail}`);
    } catch (err) {
      console.error("[MENTOR INVITE] Failed to send email:", err);
    }
  } else {
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║  [DEV MODE] MENTOR INVITED — USE THIS OTP    ║');
    console.log(`║  Email : ${normalizedEmail.padEnd(35)}║`);
    console.log(`║  OTP   : ${otp.padEnd(35)}║`);
    console.log('╚══════════════════════════════════════════════╝\n');
  }

  // Notify the newly created mentor (they will see it when they log in)
  await createNotification({
    userId: user.id,
    title: "Welcome to TARCIN",
    message: "You have been added as a mentor. Welcome to the team!",
    type: "SUCCESS"
  });

  revalidatePath("/admin/mentors");
  revalidatePath("/admin");
}
