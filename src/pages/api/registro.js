import { supabase } from "../../lib/supabase";
import { getSessionCookieOptions } from "../../lib/auth";

export const prerender = false;

export async function POST({ request, cookies }) {
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
      JSON.stringify({
        error: error.message,
      }),
      { status: 400 },
    );
  }

  if (data.session) {
    cookies.set(
      "sb-access-token",
      data.session.access_token,
      getSessionCookieOptions(data.session.expires_in),
    );

    cookies.set(
      "sb-refresh-token",
      data.session.refresh_token,
      getSessionCookieOptions(604800),
    );
  }

  return new Response(
    JSON.stringify({
      user: data.user,
    }),
    { status: 200 },
  );
}
