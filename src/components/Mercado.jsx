import { useMemo, useState } from "react";
import Card from "./Card";
import Filtros from "./Filtros";
import BarraBusqueda from "./BarraBusqueda";
import Fuse from "fuse.js";

export default function Mercado({ jugadores, nacionalidades }) {
  const [filtroPosicion, setFiltroPosicion] = useState(null);
  const [filtroPrecio, setFiltroPrecio] = useState(null);
  const [filtroNacionalidad, setFiltroNacionalidad] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const fuse = useMemo(() => {
    return new Fuse(jugadores, {
      keys: ["nombre", "club", "nacionalidad"],

      threshold: 0.3,
    });
  }, [jugadores]);

  const jugadoresFiltrados = useMemo(() => {
    let resultado = jugadores;

    // SEARCH
    if (busqueda.trim()) {
      resultado = fuse.search(busqueda).map((r) => r.item);
    }

    // POSITION
    if (filtroPosicion) {
      resultado = resultado.filter((j) => j.posicion === filtroPosicion);
    }

    // NATIONALITY
    if (filtroNacionalidad) {
      resultado = resultado.filter(
        (j) => j.nacionalidad === filtroNacionalidad,
      );
    }

    // PRICE
    if (filtroPrecio) {
      resultado = resultado.filter((j) => j.precio <= filtroPrecio);
    }

    return resultado;
  }, [
    jugadores,
    busqueda,
    filtroPosicion,
    filtroNacionalidad,
    filtroPrecio,
    fuse,
  ]);
  return (
    <>
      <div class="flex-1 px-4 md:px-margin py-margin pb-32 md:pb-margin">
        <div class="max-w-container-max mx-auto flex flex-col lg:flex-row gap-margin">
          <Filtros
            filtroPosicion={filtroPosicion}
            setFiltroPosicion={setFiltroPosicion}
            filtroNacionalidad={filtroNacionalidad}
            setFiltroNacionalidad={setFiltroNacionalidad}
            filtroPrecio={filtroPrecio}
            setFiltroPrecio={setFiltroPrecio}
            nacionalidades={nacionalidades}
          />

          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-6 pb-2 border-b border-outline-variant/20">
              <span class="font-body-md text-body-md text-on-surface-variant">
                Showing
                <strong class="text-on-surface"> 248 </strong>
                players
              </span>

              <BarraBusqueda busqueda={busqueda} setBusqueda={setBusqueda} />
              <div class="flex items-center gap-2">
                <span class="font-body-md text-body-md text-on-surface-variant hidden sm:inline">
                  Sort by:
                </span>

                <select class="bg-transparent border-none text-primary font-label-bold text-label-bold focus:ring-0 cursor-pointer">
                  <option>Highest Price</option>
                  <option>Total Points</option>
                  <option>Form</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-gutter gap-y-12 mt-8">
              {jugadoresFiltrados.map((j) => (
                <Card
                  price={j.precio}
                  age={j.edad}
                  name={j.nombre}
                  position={j.posicion}
                  club={j.club}
                  flag={j.nacionalidad}
                  image={j.imagen_url}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
