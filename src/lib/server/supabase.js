
import { createClient } from '@supabase/supabase-js';

// server only version using private service role key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// You cannot use the same client for DB queries and auth, since anything 
// that might change the tokens invalidates the service role key. 
// So we provide two clients, one for auth and one for DB
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
export const auth = createClient(supabaseUrl, supabaseAnonKey).auth;
