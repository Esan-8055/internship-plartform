import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'super-secret-tarcin-key-replace-in-prod';
const key = new TextEncoder().encode(secretKey);

async function getSessionPayload(req: NextRequest) {
  const token = req.cookies.get('session')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
    return payload as { id: string; email: string; role: string; status: string };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ─── Public paths: always allowed ───────────────────────────────────────
  const publicPaths = ['/', '/login', '/under-review', '/onboarding'];
  const isPublic =
    publicPaths.includes(pathname) ||
    pathname.startsWith('/api/auth') ||  // OTP routes
    pathname.startsWith('/api/onboarding') || // Public application submission
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon');

  if (isPublic) return NextResponse.next();

  const session = await getSessionPayload(req);

  // ─── Not logged in → redirect to login ──────────────────────────────────
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const role = session.role?.toLowerCase(); // 'admin' | 'mentor' | 'intern'
  const status = session.status;            // 'PENDING' | 'APPROVED' | 'REJECTED'

  // ─── Admin API routes: only ADMIN may call ───────────────────────────────
  if (pathname.startsWith('/api/admin')) {
    if (session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.next();
  }

  // ─── Onboarding: only pending/unapproved interns ────────────────────────
  if (pathname.startsWith('/onboarding')) {
    if (status === 'APPROVED') {
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }
    return NextResponse.next();
  }

  // ─── Role-based dashboard protection ────────────────────────────────────
  const dashboardRoles = ['admin', 'mentor', 'intern'];
  const matchedRole = dashboardRoles.find((r) => pathname.startsWith(`/${r}`));

  if (matchedRole) {
    // Not approved → go to under-review
    if (status !== 'APPROVED') {
      return NextResponse.redirect(new URL('/under-review', req.url));
    }
    // Wrong role → redirect to their own dashboard
    if (role !== matchedRole) {
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
