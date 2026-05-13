import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/jwt';
import path from 'path';
import fs from 'fs';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // 1. Find the certificate
    const certificate = await prisma.certificate.findUnique({
      where: { id }
    });

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    // 2. Delete the physical file if it exists
    if (certificate.fileUrl) {
      const filePath = path.join(process.cwd(), 'public', certificate.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // 3. Delete from database
    await prisma.certificate.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Certificate deleted' });

  } catch (error: any) {
    console.error('[DELETE_CERTIFICATE_ERROR]:', error);
    return NextResponse.json({ error: 'Failed to delete certificate' }, { status: 500 });
  }
}
