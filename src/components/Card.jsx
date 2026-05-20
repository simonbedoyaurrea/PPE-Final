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
    position === "Portero"
      ? "POR"
      : position === "Defensa"
      ? "DEF"
      : position === "Mediocampista"
      ? "MED"
      : position === "Delantero"
      ? "DEL"
      : position;

  return (
    <div className="relative pt-14 pb-6 px-4 bg-surface-container-highest/40 backdrop-blur-md border border-outline-variant/30 rounded-[2rem_2rem_0.5rem_0.5rem] flex flex-col items-center shadow-xl">
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-28 h-28 z-10">
        <div className="w-full h-full rounded-full border-2 border-primary overflow-hidden bg-surface-container-lowest">
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

      <div className="absolute top-3 left-4 text-center z-20">
        <div className="font-label-bold text-label-bold text-primary mt-1">
          {posicionCorta}
        </div>
      </div>

      <h3 className="font-headline-md text-headline-md text-on-surface mt-2 uppercase tracking-wide text-center w-full truncate px-2">
        {name}
      </h3>

      <p className="text-on-surface-variant text-sm mt-1">{club}</p>
      <p className="text-on-surface-variant text-sm">{flag}</p>
      <p className="text-on-surface-variant text-sm">{age} años</p>

      <div className="flex items-center justify-between w-full mt-6">
        <div className="font-headline-md text-headline-md text-tertiary-fixed-dim">
          ${price}M
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
            {comprado ? "VENDER" : posicionLlena ? "CUPO LLENO" : "BUY"}
          </span>
        </button>
      </div>
    </div>
  );
}