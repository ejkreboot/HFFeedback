import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

const secret = import.meta.env.VITE_JWT_SECRET;

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const cookies = parse(event.request.headers.get('cookie') || '');
  const token = cookies.session;
console.log("token ", token)
  if (token) {
    try {
      const user = jwt.verify(token, secret);
      console.log("!!!!", user)
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

  return resolve(event);
}
