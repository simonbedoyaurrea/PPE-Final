import { supabase } from "../../lib/supabase";
import { getLogoutCookieOptions } from "../../lib/auth";

export const prerender = false;

export async function POST({ cookies }) {
  await supabase.auth.signOut();

  cookies.set("sb-access-token", "", getLogoutCookieOptions());
  cookies.set("sb-refresh-token", "", getLogoutCookieOptions());

  return new Response(
    JSON.stringify({ message: "Sesión cerrada" }),
    { status: 200 }
  );
}
