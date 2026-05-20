import { supabase } from "../../lib/supabase";



export const prerender = false;

const limitesPorPosicion = {
  DEL: 3,
  MED: 3,
  DEF: 4,
  POR: 1,

  // Por si en tu base tienes posiciones en texto completo
  Delantero: 3,
  Mediocampista: 3,
  Defensa: 4,
  Portero: 1,
  Arquero: 1,

  // Por si usas nombres en inglés en algún componente
  FWD: 3,
  MID: 3,
  GK: 1,
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function normalizarPosicion(posicion) {
  const mapa = {
    Delantero: "DEL",
    FWD: "DEL",
    DEL: "DEL",

    Mediocampista: "MED",
    MID: "MED",
    MED: "MED",

    Defensa: "DEF",
    DEF: "DEF",

    Portero: "POR",
    Arquero: "POR",
    GK: "POR",
    POR: "POR",
  };

  return mapa[posicion] ?? posicion;
}

function obtenerLimite(posicion) {
  const posicionNormalizada = normalizarPosicion(posicion);

  const limites = {
    DEL: 3,
    MED: 3,
    DEF: 4,
    POR: 1,
  };

  return limites[posicionNormalizada];
}

export async function POST({ request, cookies }) {
  try {
    const { jugadorId } = await request.json();

    if (!jugadorId) {
      return jsonResponse(
        {
          error: "Falta el ID del jugador",
        },
        400
      );
    }

    const token = cookies.get("sb-access-token")?.value;

    if (!token) {
      return jsonResponse(
        {
          error: "No autenticado",
        },
        401
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return jsonResponse(
        {
          error: "Usuario inválido",
        },
        401
      );
    }

    const { data: perfil, error: perfilError } = await supabase
      .from("perfil")
      .select("saldo")
      .eq("id", user.id)
      .single();

    if (perfilError || !perfil) {
      return jsonResponse(
        {
          error: "Perfil no encontrado",
        },
        404
      );
    }

    const { data: jugador, error: jugadorError } = await supabase
      .from("jugadores")
      .select("*")
      .eq("id", jugadorId)
      .single();

    if (jugadorError || !jugador) {
      return jsonResponse(
        {
          error: "Jugador no encontrado",
        },
        404
      );
    }

    const posicionJugador = normalizarPosicion(jugador.posicion);
    const limitePosicion = obtenerLimite(jugador.posicion);

    if (!limitePosicion) {
      return jsonResponse(
        {
          error: `La posición ${jugador.posicion} no es válida`,
        },
        400
      );
    }

    if (Number(perfil.saldo) < Number(jugador.precio)) {
      return jsonResponse(
        {
          error: "Saldo insuficiente",
        },
        400
      );
    }

    const { data: existe, error: existeError } = await supabase
      .from("usuario_jugadores")
      .select("id")
      .eq("id_usuario", user.id)
      .eq("id_jugador", jugadorId)
      .maybeSingle();

    if (existeError) {
      return jsonResponse(
        {
          error: existeError.message,
        },
        500
      );
    }

    if (existe) {
      return jsonResponse(
        {
          error: "Ya tienes este jugador",
        },
        400
      );
    }

    const { data: comprasUsuario, error: comprasError } = await supabase
      .from("usuario_jugadores")
      .select(`
        id,
        jugadores (
          id,
          posicion
        )
      `)
      .eq("id_usuario", user.id);

    if (comprasError) {
      return jsonResponse(
        {
          error: comprasError.message,
        },
        500
      );
    }

    const comprasMismaPosicion = (comprasUsuario ?? []).filter((compra) => {
      const jugadorComprado = Array.isArray(compra.jugadores)
        ? compra.jugadores[0]
        : compra.jugadores;

      if (!jugadorComprado) {
        return false;
      }

      return normalizarPosicion(jugadorComprado.posicion) === posicionJugador;
    });

    if (comprasMismaPosicion.length >= limitePosicion) {
      return jsonResponse(
        {
          error: `Ya tienes el máximo de jugadores para la posición ${posicionJugador}`,
        },
        400
      );
    }

    const { error: insertError } = await supabase
      .from("usuario_jugadores")
      .insert({
        id_usuario: user.id,
        id_jugador: jugadorId,
      });

    if (insertError) {
      return jsonResponse(
        {
          error: insertError.message,
        },
        500
      );
    }

    const nuevoBalance = Number(perfil.saldo) - Number(jugador.precio);

    const { error: updateError } = await supabase
      .from("perfil")
      .update({
        saldo: nuevoBalance,
      })
      .eq("id", user.id);

    if (updateError) {
      return jsonResponse(
        {
          error: updateError.message,
        },
        500
      );
    }

    return jsonResponse(
      {
        success: true,
        mensaje: "Jugador comprado correctamente",
        jugador: {
          id: jugador.id,
          nombre: jugador.nombre,
          posicion: posicionJugador,
          precio: jugador.precio,
        },
        nuevoBalance,
      },
      200
    );
  } catch (error) {
    return jsonResponse(
      {
        error: error.message || "Error interno del servidor",
      },
      500
    );
  }
}
