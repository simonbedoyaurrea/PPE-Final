import { useEffect, useState } from "react";
import { normalizeCountryCode } from "../lib/countries";

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
  const [banderaValida, setBanderaValida] = useState(true);
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

  const codigoPais = normalizeCountryCode(flag);
  const codigoBandera = codigoPais.toLowerCase();
  const codigoBanderaNormalizado =
    codigoBandera === "en" ? "gb-eng" : codigoBandera;
  const banderaUrl =
    codigoBanderaNormalizado.length >= 2
      ? `https://flagcdn.com/w40/${codigoBanderaNormalizado}.png`
      : null;

  useEffect(() => {
    setBanderaValida(true);
  }, [banderaUrl]);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-highest/50 p-4 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/70 hover:bg-surface-container-highest hover:shadow-[0_18px_42px_rgba(0,0,0,0.4),0_0_0_1px_rgba(149,211,186,0.12)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="rounded-lg border border-primary/40 bg-primary-container/20 px-3 py-1 font-label-bold text-label-bold text-primary transition-all duration-300 group-hover:border-primary group-hover:bg-primary/20">
          {posicionCorta}
        </div>

        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-primary bg-surface-container-lowest shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-glow">
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

      <div className="mt-4 space-y-2 text-sm text-on-surface-variant">
        <p className="flex min-w-0 items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-outline-variant/30 bg-surface-container-high">
            <span className="material-symbols-outlined text-[18px] text-primary">
              shield
            </span>
          </span>
          <span className="truncate">{club || "Sin club"}</span>
        </p>

        <p className="flex items-center gap-2 uppercase">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-container-high">
            {banderaUrl && banderaValida ? (
              <img
                alt={`Bandera ${codigoPais}`}
                src={banderaUrl}
                onError={() => setBanderaValida(false)}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-[18px] text-primary">
                flag
              </span>
            )}
          </span>
          {codigoPais || "N/A"}
        </p>

        <p className="flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-outline-variant/30 bg-surface-container-high">
            <span className="material-symbols-outlined text-[18px] text-primary">
              cake
            </span>
          </span>
          {age ? `${age} años` : "Edad no registrada"}
        </p>
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
          className={`font-label-bold text-label-bold px-5 py-2 skew-x-[-5deg] transition-all duration-200 ${
            comprado
              ? "bg-accent text-black hover:-translate-y-0.5 hover:opacity-90"
              : botonDesactivado
              ? "bg-surface-variant text-on-surface-variant cursor-not-allowed"
              : "bg-primary text-on-primary-fixed hover:-translate-y-0.5 hover:bg-primary-fixed hover:shadow-glow"
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
