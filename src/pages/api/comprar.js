import { supabase } from "../lib/supabase";

export const prerender = false;

export async function POST({ request, cookies }) {
  try {
    const { jugadorId } = await request.json();

    // obtener token
    const token = cookies.get("sb-access-token")?.value;

    if (!token) {
      return new Response(
        JSON.stringify({
          error: "No autenticado",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    // obtener usuario autenticado
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({
          error: "Usuario inválido",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    // obtener perfil
    const { data: perfil, error: perfilError } = await supabase
      .from("perfil")
      .select("saldo")
      .eq("id", user.id)
      .single();

    if (perfilError || !perfil) {
      return new Response(
        JSON.stringify({
          error: "Perfil no encontrado",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    // obtener jugador
    const { data: jugador, error: jugadorError } = await supabase
      .from("jugadores")
      .select("*")
      .eq("id", jugadorId)
      .single();

    if (jugadorError || !jugador) {
      return new Response(
        JSON.stringify({
          error: "Jugador no encontrado",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    // validar saldo
    if (perfil.saldo < jugador.precio) {
      return new Response(
        JSON.stringify({
          error: "Saldo insuficiente",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // validar si ya existe
    const { data: existe } = await supabase
      .from("usuario_jugadores")
      .select("id")
      .eq("id_usuario", user.id)
      .eq("id_jugador", jugadorId)
      .maybeSingle();

    if (existe) {
      return new Response(
        JSON.stringify({
          error: "Ya tienes este jugador",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // insertar
    const { error: insertError } = await supabase
      .from("usuario_jugadores")
      .insert({
        id_usuario: user.id,
        id_jugador: jugadorId,
      });

    if (insertError) {
      return new Response(
        JSON.stringify({
          error: insertError.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    // actualizar saldo
    const nuevoBalance = perfil.saldo - jugador.precio;

    const { error: updateError } = await supabase
      .from("perfil")
      .update({
        saldo: nuevoBalance,
      })
      .eq("id", user.id);

    if (updateError) {
      return new Response(
        JSON.stringify({
          error: updateError.message,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        nuevoBalance,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
