import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/jwt';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const role = session.role;
    const results: any[] = [];

    // 1. Search Users (Admin can search all, Mentor can search interns)
    if (role === 'ADMIN' || role === 'MENTOR') {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
          ...(role === 'MENTOR' ? { role: 'INTERN' } : {}),
        },
        take: 5,
      });
      results.push(...users.map(u => ({ 
        id: u.id, 
        title: u.name, 
        subtitle: u.role, 
        type: 'user',
        url: role === 'ADMIN' ? `/admin/users` : `/mentor/interns` 
      })));
    }

    // 2. Search Tasks
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
        ...(role === 'INTERN' ? { assignedToId: session.id } : {}),
        ...(role === 'MENTOR' ? { assignedById: session.id } : {}),
      },
      take: 5,
    });
    results.push(...tasks.map(t => ({ 
      id: t.id, 
      title: t.title, 
      subtitle: 'Task', 
      type: 'task',
      url: `/${role.toLowerCase()}/tasks` 
    })));

    // 3. Search Domains (Admin only)
    if (role === 'ADMIN') {
      const domains = await prisma.domain.findMany({
        where: { domainName: { contains: query, mode: 'insensitive' } },
        take: 3,
      });
      results.push(...domains.map(d => ({ 
        id: d.id, 
        title: d.domainName, 
        subtitle: 'Domain', 
        type: 'domain',
        url: `/admin/domains` 
      })));
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
