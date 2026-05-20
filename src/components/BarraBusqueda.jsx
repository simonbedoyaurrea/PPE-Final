export default function BarraBusqueda({ busqueda, setBusqueda }) {
  return (
    <div className="group relative hidden w-full max-w-xs sm:block">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors duration-200 group-hover:text-primary">
        search
      </span>

      <input
        type="text"
        placeholder="Buscar jugadores..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="
          w-full
          bg-surface-container/50
          border
          border-outline-variant/50
          hover:border-primary/60
          hover:bg-surface-container-high
          hover:shadow-glow
          focus:border-primary
          focus:ring-1
          focus:ring-primary
          rounded-full
          pl-10
          pr-4
          py-2
          text-on-surface
          font-body-md
          placeholder:text-on-surface-variant
          transition-all
          duration-300
          outline-none
        "
      />
    </div>
  );
}
