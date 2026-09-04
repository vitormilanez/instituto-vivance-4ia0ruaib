import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { destroySession, SESSION_COOKIE_NAME } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: 'Solicitação inválida.' }, { status: 403 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  try {
    await destroySession(token);
  } catch {
    // The browser session is still cleared if the backing store is unavailable.
  }

  const response = NextResponse.json({ redirectTo: '/' });
  response.headers.set('Cache-Control', 'no-store');
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: new URL(request.url).protocol === 'https:',
    path: '/',
    maxAge: 0,
  });
  return response;
}
