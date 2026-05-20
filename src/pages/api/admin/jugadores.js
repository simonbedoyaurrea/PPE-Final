import { createClient } from "@supabase/supabase-js";
import { getAdminSession } from "../../lib/adminAuth";

export const prerender = false;

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function toNumber(value, fallback = 0) {
  if (value === "" || value === null || value === undefined) {
    return fallback;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export async function POST({ request, cookies }) {
  const admin = await getAdminSession(cookies);

  if (!admin.isAuthenticated) {
    return json({ error: "No autenticado" }, 401);
  }

  if (!admin.isAdmin) {
    return json({ error: "No autorizado" }, 403);
  }

  try {
    const body = await request.json();

    const jugador = {
      nombre: body.nombre?.trim(),
      posicion: body.posicion?.trim(),
      club: body.club?.trim(),
      nacionalidad: body.nacionalidad?.trim(),
      edad: toNumber(body.edad),
      precio: toNumber(body.precio),
      imagen_url: body.imagen_url?.trim() || null,
      goles: toNumber(body.goles),
      asistencias: toNumber(body.asistencias),
    };

    if (!jugador.nombre || !jugador.posicion || !jugador.nacionalidad) {
      return json(
        { error: "Nombre, posicion y nacionalidad son obligatorios" },
        400,
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      },
    });

    const { data, error } = await supabaseAdmin
      .from("jugadores")
      .insert(jugador)
      .select("*")
      .single();

    if (error) {
      return json({ error: error.message }, 400);
    }

    return json({ jugador: data }, 201);
  } catch (error) {
    return json({ error: error.message || "Error en el servidor" }, 500);
  }
}
