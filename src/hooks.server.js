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
console.log(event.url, event.locals);
  if (!event.locals.user && 
      (event.url.pathname.startsWith('/protected') ||
      event.url.pathname.startsWith('/api/protected'))) {
    return new Response(null, {
      status: 302,
      headers: { Location: '/' }
    });
  }

  if (!event.locals.user?.isAdmin && 
    (event.url.pathname.startsWith('/protected/admin') || 
     event.url.pathname.startsWith('/api/protected/admin'))) {
    return new Response(null, {
      status: 302,
      headers: { Location: '/' }
    });
  }

  return resolve(event);
}
