import { createClient } from '@supabase/supabase-js';

const supabase_url = import.meta.env.VITE_SUPABASE_URL
const supabase_service_role_key = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

console.log(supabase_url)

const supabase = createClient(supabase_url, supabase_service_role_key);

export async function GET(event) {
    const organizationName = event.locals.user?.organizationName;
  
    if (!organizationName || !event.locals.user.isAdmin) {
      return new Response(JSON.stringify({ message: 'Unauthorized,' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const url = new URL(event.request.url);
    const block = url.searchParams.get('block'); // New query parameter for block
    const resident_name = url.searchParams.get('resident_name');
  
    if (!block || !resident_name) {
      return new Response(JSON.stringify({ message: 'Invalid request: missing block query term' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data, error } = await supabase
      .from('Evaluations')
      .select('*')
      .eq('institution', organizationName)
      .eq('resident_name', resident_name)
      .eq('block', block); // Include block in the query criteria
  
    if (error) {
      return new Response(JSON.stringify({ message: 'Error retrieving evaluations', error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ evaluations: data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }