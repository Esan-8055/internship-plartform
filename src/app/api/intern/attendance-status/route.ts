import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/jwt';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findFirst({
      where: {
        userId: session.id,
        date: {
          gte: today,
        }
      }
    });

    if (!attendance) {
      return NextResponse.json({ status: 'NONE' });
    }

    if (attendance.checkout) {
      return NextResponse.json({ 
        status: 'COMPLETED',
        lastAction: attendance.checkout
      });
    }

    return NextResponse.json({ 
      status: 'CHECKED_IN',
      lastAction: attendance.checkin
    });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
