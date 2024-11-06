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

export async function GET() {
  return new Response(null, {
    status: 303,
    headers: {
      'Set-Cookie': serialize('session', '', {
        httpOnly: true,
        secure: true,
        maxAge: 0, 
        path: '/',
        sameSite: 'Lax'
      }),
      'Location': '/'
    }
  });
}