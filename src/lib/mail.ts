import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  attachments = [],
}: {
  to: string;
  subject: string;
  html: string;
  attachments?: any[];
}) {
  const hasRealCredentials =
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASSWORD &&
    !process.env.EMAIL_USER.includes('your-email');

  if (!hasRealCredentials) {
    console.log(`[MAIL_MOCK] To: ${to} | Subject: ${subject}`);
    return { success: true, mocked: true };
  }

  try {
    await transporter.sendMail({
      from: `"TARCIN Internship Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    });
    return { success: true };
  } catch (error) {
    console.error('[MAIL_ERROR]:', error);
    throw error;
  }
}
