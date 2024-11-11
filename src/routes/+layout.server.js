// src/routes/+layout.server.js
import { supabase } from "$lib/supabase.js"

export async function load({ locals}) {
    return {
      user: locals.user,
      isLoggedIn: locals.user?.institution ? true : false,
      isadmin: locals.user?.isadmin ? true : false 
    };
  }
  