import { createClient } from '@supabase/supabase-js';

const supabase_url = import.meta.env.VITE_SUPABASE_URL
const supabase_service_role_key = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabase_url, supabase_service_role_key);

export async function GET(event) {
  const institution = event.locals.user?.institution;
  if (!institution) {
    return new Response(JSON.stringify({ message: 'Unauthorized: Missing institution name' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const url = new URL(event.request.url);
  const evaluator = url.searchParams.get('evaluator');
  const resident_name = url.searchParams.get('resident_name');

  if (!evaluator || !resident_name) {
    return new Response(JSON.stringify({ message: 'Invalid request: Missing evaluator or resident name' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  const { data, error } = await supabase
    .from('Evaluations')
    .select('*')
    .eq('institution', institution)
    .eq('evaluator', evaluator)
    .eq('resident_name', resident_name);

  if (error) {
    return new Response(JSON.stringify({ message: 'Error retrieving evaluation', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ evaluation: data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(event) {
  const institution = event.locals.user?.institution;

  if (!institution) {
    return new Response(JSON.stringify({ message: 'Unauthorized: Missing organization name' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const body = await event.request.json();

  const evaluationData = {
    ...body,
    institution: institution
  };

  const { data, error } = await supabase
    .from('Evaluations')
    .upsert(evaluationData, { onConflict: ['evaluator', 'resident_name', 'rotation', 'block'] });

  if (error) {
    return new Response(JSON.stringify({ message: 'Error saving evaluation', error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ message: 'Evaluation saved successfully', evaluation: data }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
}