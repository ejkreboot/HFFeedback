import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const jwtSecret = import.meta.env.VITE_JWT_SECRET;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST({ request }) {
  const { code } = await request.json();

  const { data, error } = await supabase
    .from('Organizations')
    .select('name')
    .eq('access_code', code)
    .single();

  if (error || !data) {
    return new Response('Invalid code', { status: 401 });
  }

  // If the code is valid, create a JWT token
  const token = jwt.sign({ organizationName: data.name }, jwtSecret, { expiresIn: '10h' });

  return new Response(null, {
    headers: {
      'Set-Cookie': serialize('session', token, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 10,
        path: '/',
        sameSite: "strict"
      })
    }
  });
}
