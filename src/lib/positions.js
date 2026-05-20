export const POSITION_CODES = ["POR", "DEF", "MED", "DEL"];

export const POSITION_LABELS = {
  POR: "Portero",
  DEF: "Defensa",
  MED: "Mediocampista",
  DEL: "Delantero",
};

export const POSITION_LIMITS = {
  POR: 1,
  DEF: 4,
  MED: 3,
  DEL: 3,
};

export function normalizePositionCode(position) {
  const value = String(position || "").trim();

  const map = {
    Portero: "POR",
    Arquero: "POR",
    POR: "POR",
    GK: "POR",

    Defensa: "DEF",
    DEF: "DEF",

    Mediocampista: "MED",
    Medio: "MED",
    MED: "MED",
    MID: "MED",

    Delantero: "DEL",
    DEL: "DEL",
    FWD: "DEL",
  };

  return map[value] ?? value.toUpperCase();
}
