import { NextResponse } from 'next/server';
import {
  authenticate,
  homeForUser,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from '@/app/lib/auth';

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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Informe usuário e senha.' }, { status: 400 });
  }

  if (
    !body ||
    typeof body !== 'object' ||
    !('username' in body) ||
    !('password' in body) ||
    typeof body.username !== 'string' ||
    typeof body.password !== 'string'
  ) {
    return NextResponse.json({ error: 'Informe usuário e senha.' }, { status: 400 });
  }

  try {
    const result = await authenticate(body.username, body.password);
    if (!result) {
      return NextResponse.json({ error: 'Usuário ou senha inválidos.' }, { status: 401 });
    }

    const response = NextResponse.json({ redirectTo: homeForUser(result.user) });
    response.headers.set('Cache-Control', 'no-store');
    response.cookies.set(SESSION_COOKIE_NAME, result.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: new URL(request.url).protocol === 'https:',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
    return response;
  } catch {
    return NextResponse.json(
      { error: 'Não foi possível entrar agora. Tente novamente.' },
      { status: 503 },
    );
  }
}
