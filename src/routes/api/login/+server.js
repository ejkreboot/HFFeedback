import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const jwtSecret = import.meta.env.VITE_JWT_SECRET;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST({ request, cookies }) {
  let payload, status;

  const { code } = await request.json();

  const { data, error } = await supabase
    .from('Organizations')
    .select('name')
    .eq('access_code', code)
    .single();

  if (data) {
    const token = jwt.sign({ organizationName: data.name }, jwtSecret, { expiresIn: '10h' });
    cookies.set('session', token, { 
      httpOnly: true, 
      secure: true, 
      sameSite: 'strict', 
      path: '/' 
  });
    payload = JSON.stringify({ user: { organizationName: data.name } });
    status = 200;
  } else {
    payload = JSON.stringify({ error: 'Invalid code' });
    status = 404;
  }

  return new Response(payload, {
    status: status,
    headers: { 'Content-Type': 'application/json' }
  });
}

