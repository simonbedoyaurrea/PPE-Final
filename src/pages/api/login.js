import { supabase } from "../../lib/supabase";
import { getSessionCookieOptions } from "../../lib/auth";

export const prerender = false;

export async function POST({ request, cookies }) {
  try {
    const { email, password } = await request.json();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    }

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

    return new Response(
      JSON.stringify({
        user: data.user,
        session: data.session,
      }),
      { status: 200 },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error en el servidor" }), {
      status: 500,
    });
  }
}
