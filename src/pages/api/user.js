import { supabase } from "../lib/supabase";

export const prerender = false;

export async function GET({ cookies }) {
  try {
    const token = cookies.get("sb-access-token")?.value;

    if (!token) {
      return new Response(
        JSON.stringify({ user: null }),
        { status: 401 }
      );
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return new Response(
        JSON.stringify({ user: null }),
        { status: 401 }
      );
    }

    return new Response(
      JSON.stringify({ user }),
      { status: 200 }
    );
  } catch {
    return new Response(
      JSON.stringify({ user: null }),
      { status: 500 }
    );
  }
}