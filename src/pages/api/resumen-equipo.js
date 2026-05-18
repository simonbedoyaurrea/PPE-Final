import { supabase } from "../lib/supabase";

export const prerender = false;

export async function GET({ cookies }) {
  try {
    const token = cookies.get("sb-access-token")?.value;

    if (!token) {
      return new Response(
        JSON.stringify({ error: "No autenticado" }),
        { status: 401 }
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    const { data: perfil } = await supabase
      .from("perfil")
      .select("*")
      .eq("id", user.id)
      .single();

    const { data: compras } = await supabase
      .from("usuario_jugadores")
      .select(`
        jugadores (*)
      `)
      .eq("id_usuario", user.id);

    const jugadores = compras.map((c) =>
      Array.isArray(c.jugadores)
        ? c.jugadores[0]
        : c.jugadores
    );

    const gastado = jugadores.reduce(
      (total, j) => total + Number(j.precio || 0),
      0
    );

    return new Response(
      JSON.stringify({
        saldo: perfil?.saldo || 0,
        gastado,
        jugadores,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}