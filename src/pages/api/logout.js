import { supabase } from "../lib/supabase";

export const prerender = false;

export async function POST() {
  await supabase.auth.signOut();

  return new Response(
    JSON.stringify({ message: "Sesión cerrada" }),
    { status: 200 }
  );
}