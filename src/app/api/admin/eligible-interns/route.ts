import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/jwt';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Interns who are APPROVED and don't have a certificate yet
    const interns = await prisma.user.findMany({
      where: { 
        role: 'INTERN', 
        status: 'APPROVED',
        certificates: { none: {} }
      },
      select: {
        id: true,
        name: true,
        internProfile: {
          select: {
            preferredDomain: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(interns);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
