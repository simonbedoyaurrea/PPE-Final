import { supabase } from "../lib/supabase";

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

    // Guardar tokens en cookies
    cookies.set("sb-access-token", data.session.access_token, {
      httpOnly: false,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: data.session.expires_in,
    });

    cookies.set("sb-refresh-token", data.session.refresh_token, {
      httpOnly: false,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 604800,
    });

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
