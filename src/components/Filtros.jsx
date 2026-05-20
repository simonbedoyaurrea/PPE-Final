import { normalizeCountryCode } from "../lib/countries";
import { POSITION_CODES } from "../lib/positions";

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
    ...new Set(
      nacionalidades
        .map((j) => normalizeCountryCode(j.nacionalidad))
        .filter(Boolean),
    ),
  ];

  const posiciones = [
    { label: "TODAS", value: "" },
    ...POSITION_CODES.map((position) => ({ label: position, value: position })),
  ];

  const resetFiltros = () => {
    setFiltroPosicion("");
    setFiltroNacionalidad(null);
    setFiltroPrecio(null);
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 self-start sticky top-24">
      <div className="bg-surface-variant/30 backdrop-blur-xl border border-outline-variant/20 rounded-2xl p-margin shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-surface-variant/40 hover:shadow-[0_18px_42px_rgba(0,0,0,0.38),0_0_0_1px_rgba(149,211,186,0.08)]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">filter_list</span>
            Filtros
          </h3>

          <button
            type="button"
            onClick={resetFiltros}
            className="rounded-lg border border-transparent px-2 py-1 font-label-bold text-label-bold text-on-surface-variant transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
          >
            RESET
          </button>
        </div>

        <div className="mb-8">
          <label className="font-label-bold text-label-bold text-on-surface-variant block mb-3 uppercase tracking-widest">
            Posición
          </label>

          <div className="grid grid-cols-2 gap-2">
            {posiciones.map((posicion) => {
              const activo = (filtroPosicion || "") === posicion.value;
              const buttonClass = activo
                ? "border-primary bg-primary/20 text-primary shadow-[inset_0_0_10px_rgba(149,211,186,0.2)] hover:-translate-y-0.5 hover:bg-primary/25 hover:shadow-glow"
                : "border-outline-variant/40 bg-surface-container-highest text-on-surface hover:-translate-y-0.5 hover:border-primary hover:bg-surface-container-high hover:text-primary hover:shadow-glow";

              return (
                <button
                  key={posicion.label}
                  type="button"
                  onClick={() => setFiltroPosicion(posicion.value)}
                  className={`flex items-center justify-center rounded-lg border py-2 skew-x-[-5deg] transition-all duration-200 ${buttonClass}`}
                >
                  <span className="skew-x-[5deg] font-label-bold text-label-bold">
                    {posicion.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="font-label-bold text-label-bold text-on-surface-variant block mb-3 uppercase tracking-widest">
            Nacionalidad
          </label>

          <div className="relative">
            <select
              value={filtroNacionalidad || ""}
              onChange={(e) => setFiltroNacionalidad(e.target.value || null)}
              className="w-full cursor-pointer rounded-lg bg-surface-container-highest border border-outline-variant/40 px-4 py-3 text-on-surface outline-none transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-surface-container-high hover:shadow-glow focus:border-primary"
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
