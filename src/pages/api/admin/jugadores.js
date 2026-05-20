import { createClient } from "@supabase/supabase-js";
import { getAdminSession } from "../../../lib/adminAuth";
import { normalizeCountryCode } from "../../../lib/countries";
import { normalizePositionCode } from "../../../lib/positions";

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

function buildPlayerPayload(body) {
  return {
    nombre: body.nombre?.trim(),
    posicion: normalizePositionCode(body.posicion),
    club: body.club?.trim() || null,
    nacionalidad: normalizeCountryCode(body.nacionalidad),
    edad: toNumber(body.edad),
    precio: toNumber(body.precio),
    imagen_url: body.imagen_url?.trim() || null,
    goles: toNumber(body.goles),
    asistencias: toNumber(body.asistencias),
  };
}

function validatePlayer(jugador) {
  if (!jugador.nombre || !jugador.posicion || !jugador.nacionalidad) {
    return "Nombre, posicion y nacionalidad son obligatorios";
  }

  return null;
}

async function requireAdmin(cookies) {
  const admin = await getAdminSession(cookies);

  if (!admin.isAuthenticated) {
    return { response: json({ error: "No autenticado" }, 401) };
  }

  if (!admin.isAdmin) {
    return { response: json({ error: "No autorizado" }, 403) };
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
    global: {
      headers: {
        Authorization: `Bearer ${admin.token}`,
      },
    },
  });

  return { admin, supabaseAdmin };
}

export async function POST({ request, cookies }) {
  const { response, supabaseAdmin } = await requireAdmin(cookies);

  if (response) {
    return response;
  }

  try {
    const body = await request.json();
    const jugador = buildPlayerPayload(body);
    const validationError = validatePlayer(jugador);

    if (validationError) {
      return json({ error: validationError }, 400);
    }

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

export async function PATCH({ request, cookies }) {
  const { response, supabaseAdmin } = await requireAdmin(cookies);

  if (response) {
    return response;
  }

  try {
    const body = await request.json();
    const id = body.id;

    if (!id) {
      return json({ error: "Falta el ID del jugador" }, 400);
    }

    const jugador = buildPlayerPayload(body);
    const validationError = validatePlayer(jugador);

    if (validationError) {
      return json({ error: validationError }, 400);
    }

    const { data, error } = await supabaseAdmin
      .from("jugadores")
      .update(jugador)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return json({ error: error.message }, 400);
    }

    return json({ jugador: data }, 200);
  } catch (error) {
    return json({ error: error.message || "Error en el servidor" }, 500);
  }
}

export async function DELETE({ request, cookies }) {
  const { response, supabaseAdmin } = await requireAdmin(cookies);

  if (response) {
    return response;
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return json({ error: "Falta el ID del jugador" }, 400);
    }

    const { error } = await supabaseAdmin
      .from("jugadores")
      .delete()
      .eq("id", id);

    if (error) {
      return json({ error: error.message }, 400);
    }

    return json({ message: "Jugador eliminado" }, 200);
  } catch (error) {
    return json({ error: error.message || "Error en el servidor" }, 500);
  }
}
