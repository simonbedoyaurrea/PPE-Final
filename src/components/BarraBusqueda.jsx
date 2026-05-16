export default function BarraBusqueda({ busqueda, setBusqueda }) {
  return (
    <div className="relative w-full max-w-xs hidden sm:block">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
        search
      </span>

      <input
        type="text"
        placeholder="Search players..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="
          w-full
          bg-surface-container/50
          border
          border-outline-variant/50
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
