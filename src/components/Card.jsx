export default function Card({
  id,
  name,
  position,
  club,
  flag,
  image,
  price,
  age,
  onCompra,
  onVenta,
  comprado,
  posicionLlena,
}) {
  const botonDesactivado = posicionLlena && !comprado;

  const posicionCorta =
    position === "Portero" || position === "POR"
      ? "POR"
      : position === "Defensa" || position === "DEF"
      ? "DEF"
      : position === "Mediocampista" || position === "MED"
      ? "MED"
      : position === "Delantero" || position === "DEL"
      ? "DEL"
      : position;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-highest/50 p-4 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="rounded-lg border border-primary/40 bg-primary-container/20 px-3 py-1 font-label-bold text-label-bold text-primary">
          {posicionCorta}
        </div>

        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-primary bg-surface-container-lowest shadow-lg">
          {image ? (
            <img
              alt={name}
              src={image}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-variant text-on-surface-variant">
              <span className="material-symbols-outlined">person</span>
            </div>
          )}
        </div>
      </div>

      <h3 className="min-h-[56px] font-headline-md text-2xl font-extrabold uppercase leading-tight text-on-surface">
        {name}
      </h3>

      <div className="mt-2 space-y-1 text-sm text-on-surface-variant">
        <p className="truncate">{club || "Sin club"}</p>
        <p className="uppercase">{flag || "N/A"}</p>
        <p>{age ? `${age} años` : "Edad no registrada"}</p>
      </div>

      <div className="mt-7 flex items-center justify-between gap-4 border-t border-outline-variant/20 pt-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-on-surface-variant">
            Precio
          </p>
          <p className="font-headline-md text-2xl font-extrabold text-tertiary-fixed-dim">
            ${price}M
          </p>
        </div>

        <button
          type="button"
          disabled={botonDesactivado}
          onClick={() => {
            if (comprado) {
              onVenta(id);
            } else {
              onCompra(id);
            }
          }}
          className={`font-label-bold text-label-bold px-5 py-2 skew-x-[-5deg] transition-all ${
            comprado
              ? "bg-accent text-black hover:opacity-80"
              : botonDesactivado
              ? "bg-surface-variant text-on-surface-variant cursor-not-allowed"
              : "bg-primary text-on-primary-fixed hover:bg-primary-fixed"
          }`}
        >
          <span className="skew-x-[5deg] block">
            {comprado ? "VENDER" : posicionLlena ? "CUPO LLENO" : "COMPRAR"}
          </span>
        </button>
      </div>
    </article>
  );
}
