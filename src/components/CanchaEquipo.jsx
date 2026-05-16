const slots = [
  { id: "fwd-left", position: "DEL", left: 24, top: 17 },
  { id: "fwd-center", position: "DEL", left: 50, top: 10 },
  { id: "fwd-right", position: "DEL", left: 76, top: 17 },
  { id: "mid-left", position: "MED", left: 26, top: 42 },
  { id: "mid-center", position: "MED", left: 50, top: 47 },
  { id: "mid-right", position: "MED", left: 74, top: 42 },
  { id: "def-left", position: "DEF", left: 15, top: 70 },
  { id: "def-center-left", position: "DEF", left: 38, top: 76 },
  { id: "def-center-right", position: "DEF", left: 62, top: 76 },
  { id: "def-right", position: "DEF", left: 85, top: 70 },
  { id: "gk", position: "POR", left: 50, top: 91 },
];

const badgeClass = {
  DEL: "bg-inverse-primary text-on-primary",
  MED: "bg-secondary text-on-secondary",
  DEF: "bg-surface-bright text-on-surface border border-outline-variant",
  POR: "bg-tertiary-container text-on-tertiary-container border border-tertiary",
};

const borderClass = {
  DEL: "border-primary",
  MED: "border-secondary",
  DEF: "border-outline-variant",
  POR: "border-tertiary",
};

const formatMoney = (value) => `$${Number(value || 0).toFixed(1)}M`;

export default function CanchaEquipo({ jugadores = [], presupuesto = 100 }) {
  const jugadoresPorPosicion = jugadores.reduce((grupos, jugador) => {
    const posicion = jugador.posicion || jugador.position || "MED";
    grupos[posicion] = grupos[posicion] || [];
    grupos[posicion].push(jugador);
    return grupos;
  }, {});

  const plantilla = slots.map((slot) => ({
    ...slot,
    jugador: jugadoresPorPosicion[slot.position]?.shift(),
  }));

  const titulares = plantilla.filter((slot) => slot.jugador);
  const valorEquipo = titulares.reduce(
    (total, slot) => total + Number(slot.jugador?.precio || slot.jugador?.value || 0),
    0,
  );
  const presupuestoLibre = presupuesto - valorEquipo;
  const progreso = `${Math.round((titulares.length / slots.length) * 100)}%`;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      <div className="lg:col-span-8 xl:col-span-9 rounded-2xl border border-outline-variant/20 bg-surface-container/30 p-4 shadow-2xl backdrop-blur-xl">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[640px] overflow-hidden rounded-2xl border border-primary/20 bg-[#0A1A14] shadow-inner">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 10%, rgba(255,255,255,0.06) 10%, rgba(255,255,255,0.06) 20%)",
            }}
          />
          <div className="absolute left-1/2 top-1/2 h-px w-[120%] -translate-x-1/2 -translate-y-1/2 border border-primary/15" />
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/15" />
          <div className="absolute left-1/2 top-0 h-[15%] w-[40%] -translate-x-1/2 border-x-2 border-b-2 border-primary/15" />
          <div className="absolute bottom-0 left-1/2 h-[15%] w-[40%] -translate-x-1/2 border-x-2 border-t-2 border-primary/15" />

          {plantilla.map((slot) => {
            const jugador = slot.jugador;
            const nombre = jugador?.nombre || jugador?.name || "Vacante";
            const imagen = jugador?.imagen_url || jugador?.image;

            return (
              <div
                className="absolute z-20 flex w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-transform hover:scale-105 md:w-20"
                key={slot.id}
                style={{ left: `${slot.left}%`, top: `${slot.top}%` }}
              >
                <div
                  className={`relative z-10 -mb-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-[3px] shadow-[0_4px_20px_rgba(0,0,0,0.5)] md:h-14 md:w-14 ${
                    jugador ? borderClass[slot.position] : "border-dashed border-outline-variant"
                  } bg-surface-variant`}
                >
                  {imagen ? (
                    <img className="h-full w-full object-cover" src={imagen} alt={nombre} />
                  ) : (
                    <span className="material-symbols-outlined text-on-surface-variant">add</span>
                  )}
                </div>

                <div
                  className={`flex w-full flex-col items-center rounded-md border px-1 pb-1 pt-4 shadow-xl backdrop-blur-md ${
                    jugador
                      ? "border-outline-variant/40 bg-surface-container-highest/90"
                      : "border-dashed border-outline-variant/60 bg-surface-container/80"
                  }`}
                >
                  <span className="w-full truncate text-center text-[11px] font-bold text-on-surface">
                    {nombre}
                  </span>
                </div>

                <span
                  className={`absolute -right-2 -top-2 z-30 rounded-sm px-1.5 text-[9px] font-bold ${
                    badgeClass[slot.position]
                  }`}
                >
                  {slot.position}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <aside className="flex flex-col gap-gutter lg:col-span-4 xl:col-span-3">
        <div className="rounded-2xl border border-outline-variant/20 bg-surface-container/40 p-6 shadow-xl backdrop-blur-lg">
          <h2 className="mb-4 font-label-bold text-label-bold uppercase tracking-wider text-on-surface-variant">
            Plantilla
          </h2>
          <div className="mb-4 flex items-baseline gap-2">
            <span className="font-headline-xl text-headline-xl text-on-surface">
              {titulares.length}
            </span>
            <span className="font-headline-md text-headline-md text-primary">/ 11</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-variant">
            <div
              className="h-full rounded-full bg-primary shadow-[0_0_10px_rgba(149,211,186,0.5)]"
              style={{ width: progreso }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-outline-variant/20 bg-surface-container/40 p-6 shadow-xl backdrop-blur-lg">
          <h2 className="mb-4 font-label-bold text-label-bold uppercase tracking-wider text-on-surface-variant">
            Presupuesto
          </h2>
          <div className="space-y-3 font-body-md text-body-md">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant">Usado</span>
              <strong className="text-on-surface">{formatMoney(valorEquipo)}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant">Libre</span>
              <strong className="text-primary">{formatMoney(presupuestoLibre)}</strong>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-outline-variant/20 bg-surface-container/40 p-5 shadow-xl backdrop-blur-lg">
          <h2 className="mb-4 font-label-bold text-label-bold uppercase tracking-wider text-on-surface-variant">
            Plantilla activa
          </h2>

          <div className="space-y-2">
            {titulares.map((slot) => {
              const nombre =
                slot.jugador?.nombre || slot.jugador?.name || "Vacante";

              return (
                <div
                  className="flex min-h-7 items-center justify-between gap-3 font-body-md text-sm"
                  key={`active-${slot.id}`}
                >
                  <span className="min-w-0 truncate font-semibold text-on-surface">
                    {nombre}
                  </span>
                  <span
                    className={`shrink-0 rounded px-2 py-1 text-[9px] font-bold leading-none ${
                      badgeClass[slot.position]
                    }`}
                  >
                    {slot.position}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </section>
  );
}
