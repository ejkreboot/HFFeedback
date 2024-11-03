import { serialize } from 'cookie';

export async function POST() {
  return new Response(null, {
    headers: {
      'Set-Cookie': serialize('session', '', {
        httpOnly: true,
        secure: true,
        maxAge: 0, // Expires immediately
        path: '/',
        sameSite: 'Lax'
      })
    }
  });
}
