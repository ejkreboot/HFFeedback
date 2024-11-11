// src/routes/api/add-user/+server.js
import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "$lib/server/supabase.js"

export async function POST({ request }) {
  const { name, email, institution, isadmin, sms, roles } = await request.json();

  try {
    const password = uuidv4(); 
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false 
    });

    if (authError) throw new Error(authError.message);

    const { error: userError } = await supabase.from('Users').insert([
      {
        id: authUser.user.id, 
        name,
        email,
        institution,
        isadmin,
        sms,
        roles: roles.split(',').map(role => role.trim()) 
      }
    ]);

    if (userError) throw new Error(userError.message);

    return json({ message: 'User added successfully' }, { status: 200 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
