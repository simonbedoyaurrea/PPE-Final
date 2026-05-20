import { supabase } from "../../lib/supabase";
import { normalizePositionCode } from "../../lib/positions";

export const prerender = false;

export async function GET() {
  try {
    const { data: jugadores, error } = await supabase
      .from("jugadores")
      .select("*");

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    }

    return new Response(
      JSON.stringify({
        data: jugadores.map((jugador) => ({
          ...jugador,
          posicion: normalizePositionCode(jugador.posicion),
        })),
      }),
      { status: 200 },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error en el servidor" }), {
      status: 500,
    });
  }
}
