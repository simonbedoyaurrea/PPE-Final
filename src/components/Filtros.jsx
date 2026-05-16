export default function Filtros({
  filtroPrecio,
  filtroPosicion,
  filtroNacionalidad,
  setFiltroNacionalidad,
  setFiltroPosicion,
  setFiltroPrecio,
  nacionalidades,
}) {
  const nacionalidadesUnicas = [
    ...new Set(nacionalidades.map((j) => j.nacionalidad)),
  ];
  return (
    <aside class="w-full lg:w-72 shrink-0 self-start sticky top-24">
      <div class="bg-surface-variant/30 backdrop-blur-xl border border-outline-variant/20 rounded-2xl p-margin shadow-[0_8px_32px_rgba(0,0,0,0.3)] max-h-[calc(100vh-7rem)] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">tune</span>
            Filtros
          </h3>

          <button class="font-label-bold text-label-bold text-on-surface-variant hover:text-primary transition-colors">
            RESET
          </button>
        </div>

        <div class="mb-8">
          <label class="font-label-bold text-label-bold text-on-surface-variant block mb-3 uppercase tracking-widest">
            Posicion
          </label>

          <div class="grid grid-cols-2 gap-2">
            <button
              onClick={() => setFiltroPosicion("")}
              class="bg-surface-container-highest border border-outline-variant/40 hover:border-primary text-on-surface py-2 rounded-lg skew-x-[-5deg] hover:skew-x-[0deg] transition-all flex justify-center items-center group"
            >
              <span class="skew-x-[5deg] font-label-bold text-label-bold group-hover:text-primary">
                TODAS
              </span>
            </button>
            <button
              onClick={() => setFiltroPosicion("Portero")}
              class="bg-surface-container-highest border border-outline-variant/40 hover:border-primary text-on-surface py-2 rounded-lg skew-x-[-5deg] hover:skew-x-[0deg] transition-all flex justify-center items-center group"
            >
              <span class="skew-x-[5deg] font-label-bold text-label-bold group-hover:text-primary">
                POR
              </span>
            </button>

            <button
              onClick={() => setFiltroPosicion("Defensa")}
              class="bg-primary/20 border border-primary text-primary py-2 rounded-lg skew-x-[-5deg] hover:skew-x-0 transition-all flex justify-center items-center shadow-[inset_0_0_10px_rgba(149,211,186,0.2)]"
            >
              <span class="skew-x-[5deg] font-label-bold text-label-bold">
                DEF
              </span>
            </button>

            <button
              onClick={() => setFiltroPosicion("Mediocampista")}
              class="bg-surface-container-highest border border-outline-variant/40 hover:border-primary text-on-surface py-2 rounded-lg skew-x-[-5deg] hover:skew-x-[0deg] transition-all flex justify-center items-center group"
            >
              <span class="skew-x-[5deg] font-label-bold text-label-bold group-hover:text-primary">
                MED
              </span>
            </button>

            <button
              onClick={() => setFiltroPosicion("Delantero")}
              class="bg-surface-container-highest border border-outline-variant/40 hover:border-primary text-on-surface py-2 rounded-lg skew-x-[-5deg] hover:skew-x-[0deg] transition-all flex justify-center items-center group"
            >
              <span class="skew-x-[5deg] font-label-bold text-label-bold group-hover:text-primary">
                DEL
              </span>
            </button>
          </div>
        </div>

        <div>
          <label class="font-label-bold text-label-bold text-on-surface-variant block mb-3 uppercase tracking-widest">
            Nacionalidad
          </label>

          <div class="relative">
            <select
              value={filtroNacionalidad || ""}
              onChange={(e) => setFiltroNacionalidad(e.target.value || null)}
            >
              <option className="text-black" value="">
                Todas
              </option>

              {nacionalidadesUnicas.map((n) => (
                <option className="text-black" key={n} value={n}>
                  {n.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
}
