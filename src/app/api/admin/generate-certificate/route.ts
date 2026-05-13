import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/jwt';
import path from 'path';
import fs from 'fs';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';

export async function POST(req: Request) {
  try {
    console.log('[CERT] Starting generation with pdf-lib...');
    
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, internName, domain, mentorName, startDate, endDate } = await req.json();

    if (!userId || !internName || !domain) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const certificateId = `TARCIN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Paths
    const certsDir = path.join(process.cwd(), 'public', 'certificates');
    const templatePath = path.join(certsDir, 'Gold and Black Ornate Achievement Certificate.png');

    if (!fs.existsSync(certsDir)) fs.mkdirSync(certsDir, { recursive: true });

    if (!fs.existsSync(templatePath)) {
      return NextResponse.json({ 
        error: 'Template not found', 
        message: 'Please ensure the template PNG is in public/certificates/' 
      }, { status: 404 });
    }

    // 1. Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // 2. Load the PNG template
    const templateBytes = fs.readFileSync(templatePath);
    const templateImage = await pdfDoc.embedPng(templateBytes);
    
    // 3. Get dimensions (A4 Landscape is 842 x 595)
    // We'll use the image's aspect ratio or fixed A4
    const page = pdfDoc.addPage([842, 595]);
    const { width, height } = page.getSize();

    // 4. Draw Template as background
    page.drawImage(templateImage, {
      x: 0,
      y: 0,
      width: width,
      height: height,
    });

    // 5. Load Fonts
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // 6. Add Intern Name
    const nameText = internName;
    const nameFontSize = 40;
    const nameWidth = boldFont.widthOfTextAtSize(nameText, nameFontSize);
    page.drawText(nameText, {
      x: (width / 2) - (nameWidth / 2),
      y: height - 235, // Adjust based on your template visual
      size: nameFontSize,
      font: boldFont,
      color: rgb(0.12, 0.23, 0.54), // #1E3A8A
    });

    // 7. Add Domain
    const domainText = `for successfully completing the ${domain} Internship`;
    const domainFontSize = 18;
    const domainWidth = boldFont.widthOfTextAtSize(domainText, domainFontSize);
    page.drawText(domainText, {
      x: (width / 2) - (domainWidth / 2),
      y: height - 305,
      size: domainFontSize,
      font: boldFont,
      color: rgb(0.07, 0.09, 0.15),
    });

    // 8. Add Dates
    const dateText = `Duration: ${startDate} to ${endDate}`;
    const dateFontSize = 14;
    const dateWidth = regularFont.widthOfTextAtSize(dateText, dateFontSize);
    page.drawText(dateText, {
      x: (width / 2) - (dateWidth / 2),
      y: height - 335,
      size: dateFontSize,
      font: regularFont,
      color: rgb(0.2, 0.2, 0.2),
    });

    // 9. Add Mentor & ID
    const footerText = `Mentor: ${mentorName || 'TARCIN Team'}  |  Certificate ID: ${certificateId}`;
    const footerFontSize = 10;
    const footerWidth = regularFont.widthOfTextAtSize(footerText, footerFontSize);
    page.drawText(footerText, {
      x: (width / 2) - (footerWidth / 2),
      y: height - 365,
      size: footerFontSize,
      font: regularFont,
      color: rgb(0.4, 0.4, 0.4),
    });

    // 10. Generate & Embed QR Code
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify/${certificateId}`;
    const qrBuffer = await QRCode.toBuffer(verifyUrl, { margin: 1, width: 200 });
    const qrImage = await pdfDoc.embedPng(qrBuffer);
    
    page.drawImage(qrImage, {
      x: width - 110,
      y: 60,
      width: 60,
      height: 60,
    });

    // 11. Save PDF
    const pdfBytes = await pdfDoc.save();
    const pdfFilename = `${certificateId}.pdf`;
    const pdfPath = path.join(certsDir, pdfFilename);
    fs.writeFileSync(pdfPath, pdfBytes);

    // 12. Save to Database
    await prisma.certificate.create({
      data: {
        id: certificateId,
        userId,
        fileUrl: `/certificates/${pdfFilename}`,
      }
    });

    // 13. Notify Intern
    await prisma.notification.create({
      data: {
        userId,
        message: `Award: Your certificate for ${domain} internship has been generated!`,
        type: 'AWARD'
      }
    });

    return NextResponse.json({
      success: true,
      certificateId,
      pdfUrl: `/certificates/${pdfFilename}`
    });

  } catch (error: any) {
    console.error('[GENERATE_CERTIFICATE_CRASH]:', error);
    return NextResponse.json({ 
      error: 'Generation Failed', 
      message: error.message 
    }, { status: 500 });
  }
}
