const formationSlots = [
  { key: "fwd-left", position: "FWD", left: 20, top: 15 },
  { key: "fwd-center", position: "FWD", left: 50, top: 10 },
  { key: "fwd-right", position: "FWD", left: 80, top: 15 },
  { key: "mid-left", position: "MID", left: 25, top: 40 },
  { key: "mid-center", position: "MID", left: 50, top: 45 },
  { key: "mid-right", position: "MID", left: 75, top: 40 },
  { key: "def-left", position: "DEF", left: 15, top: 70 },
  { key: "def-left-center", position: "DEF", left: 38, top: 75 },
  { key: "def-right-center", position: "DEF", left: 62, top: 75 },
  { key: "def-right", position: "DEF", left: 85, top: 70 },
  { key: "gk", position: "GK", left: 50, top: 90 },
];

const positionBadge = {
  FWD: "bg-inverse-primary text-on-primary",
  MID: "bg-secondary text-on-secondary",
  DEF: "bg-surface-bright text-on-surface border border-outline-variant",
  GK: "bg-tertiary-container text-on-tertiary-container border border-tertiary",
};

const positionAccent = {
  FWD: "border-primary",
  MID: "border-secondary",
  DEF: "border-outline-variant",
  GK: "border-tertiary",
};

const formatMoney = (value) => `$${Number(value).toFixed(1)}M`;

export default function SquadPitch({ ownedPlayers = [], budgetLeft = 15.5 }) {
  const playersByPosition = ownedPlayers.reduce((groups, player) => {
    const position = player.position ?? "MID";
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
    alert(data.error || "Error al vender jugador");
    return;
  }

  window.location.reload();
};

  return (
    <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
      <div className="lg:col-span-8 xl:col-span-9 bg-surface-container/30 border border-outline-variant/20 rounded-3xl p-4 backdrop-blur-xl shadow-2xl relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,78,59,0.15)_0%,transparent_70%)] rounded-3xl pointer-events-none"></div>

        <div className="w-full max-w-[600px] aspect-[4/5] mx-auto relative rounded-2xl overflow-hidden bg-[#0A1A14] border border-primary/20 shadow-inner">
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
                className="absolute -translate-x-1/2 -translate-y-1/2 w-16 md:w-20 flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform z-20"
                key={slot.key}
                style={{ left: `${slot.left}%`, top: `${slot.top}%` }}
              >
                <div
                  className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full border-[3px] ${
                    player
                      ? positionAccent[slot.position]
                      : "border-dashed border-outline-variant"
                  } z-10 -mb-3 overflow-hidden transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.5)]`}
                >
                  {player?.image ? (
                    <img
                      alt={player.name}
                      className="w-full h-full object-cover"
                      src={player.image}
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-variant/80 flex items-center justify-center text-on-surface-variant">
                      <span className="material-symbols-outlined">add</span>
                    </div>
                  )}
                </div>

                <div
                  className={`${
                    player
                      ? "bg-surface-container-highest/90 border-outline-variant/40"
                      : "bg-surface-container/80 border-dashed border-outline-variant/60"
                  } backdrop-blur-md w-full pt-4 pb-1 rounded-md border flex flex-col items-center shadow-xl`}
                >
                  <span
                    className={`font-label-bold text-[11px] md:text-label-bold ${
                      player ? "text-on-surface" : "text-on-surface-variant"
                    } truncate w-full text-center px-1`}
                  >
                    {player?.name ?? "Sin compra"}
                  </span>
                  {player && (
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
                        hover:bg-red-400
                      "
                    >
                      Vender
                    </button>
                  )}
                </div>

                <div
                  className={`absolute -top-2 -right-2 ${
                    positionBadge[slot.position]
                  } text-[9px] font-bold px-1.5 rounded-sm z-30`}
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
        <div className="bg-surface-container/40 backdrop-blur-lg rounded-2xl p-6 border border-outline-variant/20 shadow-xl relative overflow-hidden group hover:border-primary/50 transition-colors">
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

        <div className="bg-surface-container/40 backdrop-blur-lg rounded-2xl p-5 border border-outline-variant/20 shadow-xl">
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

        <div className="bg-surface-container/40 backdrop-blur-lg rounded-2xl p-5 border border-outline-variant/20 shadow-xl">
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
