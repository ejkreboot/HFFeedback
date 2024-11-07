import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

const secret = import.meta.env.VITE_JWT_SECRET;

export async function handle({ event, resolve }) {
  const cookies = parse(event.request.headers.get('cookie') || '');
  const token = cookies.session;
  if (token) {
    try {
      const user = jwt.verify(token, secret);
      event.locals.user = user; 
    } catch (err) {
      event.locals.user = null;
    }
  } else {
    event.locals.user = null;
  }

  if (!event.locals.user && event.url.pathname.startsWith('/protected')) {
    return new Response(null, {
      status: 302,
      headers: { Location: '/' }
    });
  }

  if (!event.locals.user?.isAdmin && event.url.pathname.startsWith('/protected/admin')) {
    return new Response(null, {
      status: 302,
      headers: { Location: '/' }
    });
  }

  return resolve(event);
}
