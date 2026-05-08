import { supabase } from "../lib/supabase";

export const prerender = false;

export async function POST({ request }) {
  const { email, password, name, teamName } = await request.json();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        team_name: teamName,
      },
    },
  });

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    );
  }

  return new Response(
    JSON.stringify({ user: data.user }),
    { status: 200 }
  );
}