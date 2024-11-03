import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

const secret = import.meta.env.VITE_JWT_SECRET;

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const cookies = parse(event.request.headers.get('cookie') || '');
  const token = cookies.session;

  if (token) {
    try {
      const user = jwt.verify(token, secret);
      event.locals.user = user; 
    } catch (err) {
      console.error('Invalid session token:', err);
      event.locals.user = null;
    }
  } else {
    event.locals.user = null;
  }
  return resolve(event);
}
