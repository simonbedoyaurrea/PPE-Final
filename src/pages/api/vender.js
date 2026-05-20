import { supabase } from "../../lib/supabase";

export const prerender = false;

export async function POST({ request, cookies }) {
  const token = cookies.get("sb-access-token")?.value;

  if (!token) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
    });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
    });
  }

  const { jugadorId } = await request.json();

  const { data: compra, error: compraError } = await supabase
    .from("usuario_jugadores")
    .select("id, id_jugador, jugadores(precio)")
    .eq("id_usuario", user.id)
    .eq("id_jugador", jugadorId)
    .single();

  if (compraError || !compra) {
    return new Response(JSON.stringify({ error: "No tienes este jugador" }), {
      status: 400,
    });
  }

  const precio = Number(compra.jugadores.precio);

  const { data: perfil, error: perfilError } = await supabase
    .from("perfil")
    .select("saldo")
    .eq("id", user.id)
    .single();

  if (perfilError) {
    return new Response(JSON.stringify({ error: perfilError.message }), {
      status: 400,
    });
  }

  const nuevoSaldo = Number(perfil.saldo) + precio;

  const { error: deleteError } = await supabase
    .from("usuario_jugadores")
    .delete()
    .eq("id", compra.id);

  if (deleteError) {
    return new Response(JSON.stringify({ error: deleteError.message }), {
      status: 400,
    });
  }

  const { error: updateError } = await supabase
    .from("perfil")
    .update({ saldo: nuevoSaldo })
    .eq("id", user.id);

  if (updateError) {
    return new Response(JSON.stringify({ error: updateError.message }), {
      status: 400,
    });
  }

  return new Response(
    JSON.stringify({
      message: "Jugador vendido",
      saldo: nuevoSaldo,
    }),
    { status: 200 }
  );
}
