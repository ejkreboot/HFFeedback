import jwt from 'jsonwebtoken';
import { supabase, auth } from "$lib/server/supabase.js"

const jwtSecret = import.meta.env.VITE_JWT_SECRET;

export async function POST({ request, cookies }) {
  const { token: otpToken, phoneOrEmail } = await request.json();
  let payload, status;

  const otpType = phoneOrEmail.includes('@') ? 'email' : 'sms';

  const { data, error } = await auth.verifyOtp({
    [otpType]: phoneOrEmail,
    token: otpToken,
    type: otpType
  });

  if (data) {
    const { data: userInfo, error: userError } = await supabase
      .from('Users')
      .select('name, institution, roles, isadmin')
      .eq("email", phoneOrEmail)
      .single();
    if (userError || !userInfo) {
      payload = JSON.stringify({ error: 'User information could not be retrieved' });
      status = 500;
    } else {
      const userWithInfo = {
        name: userInfo.name,
        email: phoneOrEmail,
        institution: userInfo.institution,
        roles: userInfo.roles,
        isadmin: userInfo.isadmin
      };

      const sessionToken = jwt.sign({ user: userWithInfo }, jwtSecret, { expiresIn: '10h' });
      cookies.set('session', sessionToken, { 
        httpOnly: true, 
        secure: true, 
        sameSite: 'strict', 
        path: '/' 
      });

      payload = JSON.stringify({ ...userWithInfo });
      status = 200;
    }
  } else {
    payload = JSON.stringify({ error: 'Invalid code' });
    status = 404;
  }

  return new Response(payload, {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

