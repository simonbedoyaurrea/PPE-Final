import { useRef, useState } from "react";
import { POSITION_LABELS, normalizePositionCode } from "../lib/positions";

const formationSlots = [
  { key: "del-izquierda", position: "DEL", side: "Izquierda", left: 20, top: 15 },
  { key: "del-centro", position: "DEL", side: "Centro", left: 50, top: 10 },
  { key: "del-derecha", position: "DEL", side: "Derecha", left: 80, top: 15 },
  { key: "med-izquierda", position: "MED", side: "Izquierda", left: 25, top: 40 },
  { key: "med-centro", position: "MED", side: "Centro", left: 50, top: 45 },
  { key: "med-derecha", position: "MED", side: "Derecha", left: 75, top: 40 },
  { key: "def-izquierda", position: "DEF", side: "Izquierda", left: 15, top: 70 },
  { key: "def-centro-izquierda", position: "DEF", side: "Centro izquierda", left: 38, top: 75 },
  { key: "def-centro-derecha", position: "DEF", side: "Centro derecha", left: 62, top: 75 },
  { key: "def-derecha", position: "DEF", side: "Derecha", left: 85, top: 70 },
  { key: "por", position: "POR", side: "Centro", left: 50, top: 90 },
];

const positionBadge = {
  DEL: "bg-tertiary-container text-tertiary-fixed-dim border border-tertiary/70",
  MED: "bg-[#172b44] text-[#9ed2ff] border border-[#5fa8e8]/70",
  DEF: "bg-error-container/25 text-error border border-error/50",
  POR: "bg-[#2d2546] text-[#c7b7ff] border border-[#8f7cff]/70",
};

const positionAccent = {
  DEL: "border-tertiary shadow-[0_0_18px_rgba(249,189,34,0.25)]",
  MED: "border-[#5fa8e8] shadow-[0_0_18px_rgba(95,168,232,0.25)]",
  DEF: "border-error shadow-[0_0_18px_rgba(255,180,171,0.22)]",
  POR: "border-[#8f7cff] shadow-[0_0_18px_rgba(143,124,255,0.25)]",
};

const formatMoney = (value) => `$${Number(value).toFixed(1)}M`;

export default function SquadPitch({ ownedPlayers = [], budgetLeft = 15.5 }) {
  const [aviso, setAviso] = useState(null);
  const avisoTimeout = useRef(null);

  const mostrarAviso = (tipo, titulo, mensaje) => {
    if (avisoTimeout.current) {
      window.clearTimeout(avisoTimeout.current);
    }

    setAviso({ tipo, titulo, mensaje });
    avisoTimeout.current = window.setTimeout(() => setAviso(null), 3500);
  };

  const playersByPosition = ownedPlayers.reduce((groups, player) => {
    const position = normalizePositionCode(player.position ?? "MED");
    groups[position] = groups[position] ?? [];
    groups[position].push(player);
    return groups;
  }, {});

  const squadSlots = formationSlots.map((slot) => ({
    ...slot,
    player: playersByPosition[slot.position]?.shift(),
  }));

  const activePlayers = squadSlots.filter((slot) => slot.player).length;
  const missingPlayers = formationSlots.length - activePlayers;
  const squadValue = squadSlots.reduce(
    (total, slot) => total + Number(slot.player?.value ?? 0),
    0
  );
  const progressWidth = `${Math.round(
    (activePlayers / formationSlots.length) * 100
  )}%`;

  const venderJugador = async (jugadorId) => {
  const response = await fetch("/api/vender", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jugadorId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    mostrarAviso("error", "No se pudo vender", data.error || "Error al vender jugador");
    return;
  }

  window.location.reload();
};

  return (
    <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
      {aviso && (
        <div className="fixed right-4 top-4 z-50 w-[min(360px,calc(100vw-32px))] rounded-2xl border border-outline-variant/30 bg-surface-container-high p-4 text-on-surface shadow-[0_18px_42px_rgba(0,0,0,0.45)]">
          <div className="flex gap-3">
            <span
              className={`material-symbols-outlined mt-0.5 text-[22px] ${
                aviso.tipo === "error" ? "text-error" : "text-primary"
              }`}
            >
              {aviso.tipo === "error" ? "error" : "check_circle"}
            </span>

            <div>
              <p className="font-label-bold text-label-bold">{aviso.titulo}</p>
              <p className="mt-1 text-sm text-on-surface-variant">
                {aviso.mensaje}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="lg:col-span-8 xl:col-span-9 bg-surface-container/30 border border-outline-variant/20 rounded-3xl p-4 backdrop-blur-xl shadow-2xl relative transition-all duration-300 hover:border-primary/35 hover:shadow-[0_24px_54px_rgba(0,0,0,0.38)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,78,59,0.15)_0%,transparent_70%)] rounded-3xl pointer-events-none"></div>

        <div className="w-full max-w-[600px] aspect-[4/5] mx-auto relative rounded-2xl overflow-hidden bg-[#0A1A14] border border-primary/20 shadow-inner transition-all duration-300 hover:border-primary/45">
          <div
            className="absolute inset-0 opacity-20 mix-blend-overlay"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 10%, rgba(255,255,255,0.05) 10%, rgba(255,255,255,0.05) 20%)",
            }}
          ></div>

          <div className="pitch-line w-[120%] h-[1px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="pitch-line w-24 h-24 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="pitch-line w-[40%] h-[15%] top-0 left-1/2 -translate-x-1/2 border-t-0"></div>
          <div className="pitch-line w-[40%] h-[15%] bottom-0 left-1/2 -translate-x-1/2 border-b-0"></div>

          {squadSlots.map((slot) => {
            const player = slot.player;

            return (
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 w-[76px] md:w-24 flex flex-col items-center group cursor-pointer transition-all duration-300 hover:-translate-y-[54%] hover:scale-105 z-20"
                key={slot.key}
                style={{ left: `${slot.left}%`, top: `${slot.top}%` }}
              >
                <div
                  className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full border-[3px] ${
                    player
                      ? positionAccent[slot.position]
                      : "border-dashed border-outline-variant group-hover:border-primary"
                  } z-10 -mb-3 overflow-hidden transition-all duration-300 bg-surface-container-lowest shadow-[0_4px_20px_rgba(0,0,0,0.5)] group-hover:shadow-glow`}
                >
                  {player?.image ? (
                    <img
                      alt={player.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      src={player.image}
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-variant/80 flex items-center justify-center text-on-surface-variant transition-colors duration-300 group-hover:bg-primary/15 group-hover:text-primary">
                      <span className="material-symbols-outlined text-[22px]">add</span>
                    </div>
                  )}
                </div>

                <div
                  className={`${
                    player
                      ? "bg-surface-container-highest/90 border-outline-variant/40 group-hover:border-primary/40"
                      : "bg-surface-container/85 border-dashed border-outline-variant/60 group-hover:border-primary/60 group-hover:bg-surface-container-high"
                  } backdrop-blur-md w-full pt-4 pb-2 rounded-lg border flex flex-col items-center shadow-xl transition-all duration-300`}
                >
                  <span
                    className={`font-label-bold text-[11px] md:text-label-bold ${
                      player ? "text-on-surface" : "text-on-surface-variant"
                    } truncate w-full text-center px-1`}
                  >
                    {player?.name ?? "Disponible"}
                  </span>

                  {player ? (
                    <button
                      onClick={() => venderJugador(player.id)}
                      className="
                        mt-1
                        rounded-md
                        bg-red-500
                        px-2
                        py-1
                        text-[9px]
                        font-bold
                        uppercase
                        text-white
                        transition
                        hover:-translate-y-0.5
                        hover:bg-red-400
                        hover:shadow-[0_8px_18px_rgba(239,68,68,0.28)]
                      "
                    >
                      Vender
                    </button>
                  ) : (
                    <span className="mt-1 rounded-md border border-outline-variant/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-on-surface-variant transition-colors duration-300 group-hover:border-primary/60 group-hover:text-primary">
                      Agregar
                    </span>
                  )}
                </div>

                <div
                  className={`absolute -top-2 -right-2 ${
                    positionBadge[slot.position]
                  } text-[9px] font-bold px-1.5 rounded-md z-30 shadow-md`}
                  title={`${POSITION_LABELS[slot.position]} ${slot.side}`}
                >
                  {slot.position}
                </div>

                {player?.captain && (
                  <div className="absolute -bottom-3 bg-tertiary text-on-tertiary font-bold text-[8px] px-2 py-0.5 rounded-full z-30 uppercase tracking-widest shadow-md">
                    Capt
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-gutter">
        <div className="bg-surface-container/40 backdrop-blur-lg rounded-2xl p-6 border border-outline-variant/20 shadow-xl relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow">
          <h3 className="text-label-bold font-label-bold text-on-surface-variant uppercase tracking-widest mb-4">
            Plantilla
          </h3>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-headline-xl font-headline-xl text-on-surface">
              {activePlayers}
            </span>
            <span className="text-headline-md font-headline-md text-primary">
              / 11
            </span>
          </div>

          <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-tertiary-fixed-dim rounded-full shadow-[0_0_10px_rgba(149,211,186,0.5)]"
              style={{ width: progressWidth }}
            ></div>
          </div>
        </div>

        <div className="bg-surface-container/40 backdrop-blur-lg rounded-2xl p-5 border border-outline-variant/20 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow">
          <h3 className="text-label-bold font-label-bold text-on-surface-variant uppercase tracking-widest mb-4">
            Presupuesto
          </h3>

          <div className="space-y-3 text-body-md font-body-md">
            <div className="flex items-center justify-between gap-3">
              <span className="text-on-surface-variant">Usado</span>
              <span className="font-label-bold text-label-bold text-on-surface">
                {formatMoney(squadValue)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-on-surface-variant">Libre</span>
              <span className="font-label-bold text-label-bold text-primary">
                {formatMoney(budgetLeft)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container/40 backdrop-blur-lg rounded-2xl p-5 border border-outline-variant/20 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow">
          <h3 className="text-label-bold font-label-bold text-on-surface-variant uppercase tracking-widest mb-4">
            Plantilla activa
          </h3>

          <div className="space-y-3">
            {squadSlots
              .filter((slot) => slot.player)
              .map((slot) => (
                <div
                  className="flex items-center justify-between gap-3 text-body-md font-body-md"
                  key={slot.key}
                >
                  <span className="truncate text-on-surface">
                    {slot.player.name}
                  </span>
                  <span
                    className={`shrink-0 ${
                      positionBadge[slot.position]
                    } text-[10px] font-bold px-2 py-1 rounded-sm`}
                  >
                    {slot.position}
                  </span>
                </div>
              ))}
          </div>

          {missingPlayers > 0 && (
            <div className="mt-4 border-t border-outline-variant/30 pt-4 text-body-md font-body-md text-on-surface-variant">
              Faltan {missingPlayers} espacios por completar con compras.
            </div>
          )}
        </div>

        <style>{`
          .pitch-line {
            position: absolute;
            border: 2px solid rgba(149, 211, 186, 0.15);
          }
        `}</style>
      </div>
    </div>
  );

}
