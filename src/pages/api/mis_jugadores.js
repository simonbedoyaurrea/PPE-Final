import { createClient } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export const prerender = false;

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET({ cookies }) {
  const token = cookies.get("sb-access-token")?.value;

  if (!token) {
    return json({ error: "No autenticado" }, 401);
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return json({ error: "Usuario inválido" }, 401);
  }

  const supabaseAutenticado = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const { data: jugadoresComprados, error } = await supabaseAutenticado
    .from("usuario_jugadores")
    .select(`
      id,
      id_jugador,
      jugadores (
        id,
        nombre,
        posicion,
        club,
        nacionalidad,
        edad,
        precio,
        imagen_url
      )
    `)
    .eq("id_usuario", user.id);

  if (error) {
    return json({ error: error.message }, 400);
  }

  return json({ jugadoresComprados: jugadoresComprados ?? [] });
}
