export default function Card({
  image,
  price,
  name,
  position,
  club,
  flag,
  age,
}) {
  return (
    <article className="group relative overflow-hidden rounded-[2.2rem_2.2rem_1rem_1rem] border border-outline-variant/20 bg-surface-container-highest/40 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-transparent opacity-80 pointer-events-none" />

      {/* Top Decoration */}
      <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="relative px-5 pt-5 flex items-start justify-between z-20">
        {/* Rating */}
        <div className="flex flex-col">
          <span className="text-3xl font-black leading-none tracking-tight text-on-surface drop-shadow-md">
            83
          </span>

          <span className="text-xs font-bold tracking-[0.2em] text-primary mt-1">
            {position}
          </span>
        </div>

        {/* Flag + Age */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-6 overflow-hidden rounded-md border border-outline-variant/20 shadow-md">
            <img
              src={`https://flagcdn.com/w80/${flag.toLowerCase()}.png`}
              alt={flag}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="px-2 py-1 rounded-full bg-surface-container-lowest/80 border border-outline-variant/20 text-[11px] font-semibold text-on-surface-variant">
            {age}
          </div>
        </div>
      </div>

      {/* Player Image */}
      <div className="relative mt-2 flex justify-center z-10">
        <div className="relative">
          {/* Background Circle */}
          <div className="absolute inset-0 scale-110 rounded-full bg-primary/10 blur-2xl opacity-60 group-hover:scale-125 transition-transform duration-500" />

          <div className="relative w-32 h-32 rounded-full overflow-hidden border-[3px] border-primary/70 shadow-[0_0_30px_rgba(149,211,186,0.2)] bg-surface-container-lowest transition-transform duration-300 group-hover:-translate-y-1">
            <img
              alt={name}
              src={image}
              className="w-full h-full object-cover object-top bg-gradient-to-b from-green-900 to-green-400"
            />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="relative px-5 mt-5 z-20">
        <h3 className="text-xl font-extrabold uppercase tracking-wide text-on-surface text-center truncate">
          {name}
        </h3>

        <p className="text-sm text-on-surface-variant text-center mt-1 font-medium truncate">
          {club}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 mt-5 overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest/40">
          <div className="flex flex-col items-center py-3">
            <span className="text-[10px] tracking-widest text-on-surface-variant">
              PAC
            </span>

            <span className="mt-1 text-lg font-bold text-on-surface">72</span>
          </div>

          <div className="flex flex-col items-center py-3 border-x border-outline-variant/20">
            <span className="text-[10px] tracking-widest text-on-surface-variant">
              DEF
            </span>

            <span className="mt-1 text-lg font-bold text-on-surface">84</span>
          </div>

          <div className="flex flex-col items-center py-3">
            <span className="text-[10px] tracking-widest text-on-surface-variant">
              PHY
            </span>

            <span className="mt-1 text-lg font-bold text-on-surface">81</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative flex items-center justify-between px-5 py-5 mt-2 z-20">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-on-surface-variant">
            Market Value
          </span>

          <span className="text-2xl font-black text-tertiary-fixed-dim tracking-tight">
            {price}
          </span>
        </div>

        <button className="group/button relative overflow-hidden rounded-xl bg-primary px-5 py-3 font-bold text-on-primary-fixed transition-all duration-300 hover:scale-105 hover:bg-primary-fixed hover:shadow-[0_0_20px_rgba(149,211,186,0.35)] active:scale-95">
          <div className="absolute inset-0 translate-x-[-120%] bg-white/20 transition-transform duration-500 group-hover/button:translate-x-[120%]" />

          <span className="relative z-10 tracking-wide">COMPRAR</span>
        </button>
      </div>
    </article>
  );
}
