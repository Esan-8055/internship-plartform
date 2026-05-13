import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/jwt';

export async function POST(req: Request) {
  try {
    // 1. Verify admin session
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, phone, college, department, linkedin, preferredDomain } = body;

    // 2. Basic validation
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    // 3. Check for duplicate
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    // 4. Create user + profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          role: 'INTERN',
          status: 'APPROVED', // Admin-created interns are pre-approved
        },
      });

      await tx.internProfile.create({
        data: {
          userId: newUser.id,
          phone: phone || null,
          college: college || null,
          department: department || null,
          linkedin: linkedin || null,
          preferredDomain: preferredDomain || null,
          skills: [],
        },
      });

      return newUser;
    });

    return NextResponse.json({
      success: true,
      message: `Intern account created for ${name}`,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error('Error creating intern:', error);
    return NextResponse.json({ error: 'Failed to create intern account.' }, { status: 500 });
  }
}
