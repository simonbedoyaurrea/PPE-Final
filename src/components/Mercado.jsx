import { useEffect, useMemo, useState } from "react";
import Card from "./Card";
import Filtros from "./Filtros";
import BarraBusqueda from "./BarraBusqueda";
import Fuse from "fuse.js";

export default function Mercado({ jugadores, nacionalidades }) {
  const [filtroPosicion, setFiltroPosicion] = useState(null);
  const [filtroPrecio, setFiltroPrecio] = useState(null);
  const [filtroNacionalidad, setFiltroNacionalidad] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [cantidadVisible, setCantidadVisible] = useState(12);

  const [jugadoresComprados, setJugadoresComprados] = useState([]);
  const [loadingComprados, setLoadingComprados] = useState(true);

  useEffect(() => {
    async function cargarJugadoresComprados() {
      try {
        const response = await fetch("/api/mis_jugadores", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Error cargando jugadores comprados:", data.error);
          return;
        }

        setJugadoresComprados(data.jugadoresComprados || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoadingComprados(false);
      }
    }

    cargarJugadoresComprados();
  }, []);

  useEffect(() => {
  setCantidadVisible(12);
  }, [
    busqueda,
    filtroPosicion,
    filtroNacionalidad,
    filtroPrecio,
  ]);

  const idsComprados = useMemo(() => {
    return jugadoresComprados.map((item) => item.id_jugador);
  }, [jugadoresComprados]);

  const comprarJugador = async (jugadorId) => {
    const response = await fetch("/api/comprar", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jugadorId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Error al comprar jugador");
      return;
    }

    alert("Jugador comprado correctamente");

    const jugadorComprado = jugadores.find((j) => j.id === jugadorId);

    if (jugadorComprado) {
      setJugadoresComprados((prev) => [
        ...prev,
        {
          id_jugador: jugadorId,
          jugadores: jugadorComprado,
        },
      ]);
    }
  };

  const venderJugador = async (jugadorId) => {
  const response = await fetch("/api/vender", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jugadorId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    alert(data.error || "Error al vender jugador");
    return;
  }

  alert("Jugador vendido correctamente");

  setJugadoresComprados((prev) =>
    prev.filter((item) => item.id_jugador !== jugadorId)
  );
};

  const fuse = useMemo(() => {
    return new Fuse(jugadores, {
      keys: ["nombre", "club", "nacionalidad"],
      threshold: 0.3,
    });
  }, [jugadores]);

  const jugadoresFiltrados = useMemo(() => {
    let resultado = jugadores;

    if (busqueda.trim()) {
      resultado = fuse.search(busqueda).map((r) => r.item);
    }

    if (filtroPosicion) {
      resultado = resultado.filter((j) => j.posicion === filtroPosicion);
    }

    if (filtroNacionalidad) {
      resultado = resultado.filter(
        (j) => j.nacionalidad === filtroNacionalidad
      );
    }

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

  const jugadoresVisibles = jugadoresFiltrados.slice(0, cantidadVisible);

  return (
    <>
      <div className="flex-1 px-4 md:px-margin py-margin pb-32 md:pb-margin">
        <div className="max-w-container-max mx-auto flex flex-col lg:flex-row gap-margin">
          <Filtros
            filtroPosicion={filtroPosicion}
            setFiltroPosicion={setFiltroPosicion}
            filtroNacionalidad={filtroNacionalidad}
            setFiltroNacionalidad={setFiltroNacionalidad}
            filtroPrecio={filtroPrecio}
            setFiltroPrecio={setFiltroPrecio}
            nacionalidades={nacionalidades}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-outline-variant/20">
              <span className="font-body-md text-body-md text-on-surface-variant">
                Showing{" "}
                <strong className="text-on-surface">
                  {jugadoresFiltrados.length}
                </strong>{" "}
                players
              </span>

              <BarraBusqueda busqueda={busqueda} setBusqueda={setBusqueda} />
            </div>

            {loadingComprados && (
              <p className="mb-6 text-on-surface-variant">
                Cargando tus jugadores comprados...
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-gutter gap-y-12 mt-8">
              {jugadoresVisibles.map((j) => {
                const comprado = idsComprados.includes(j.id);

                return (
                  <Card
                    key={j.id}
                    onCompra={comprarJugador}
                    onVenta={venderJugador}
                    comprado={comprado}
                    price={j.precio}
                    age={j.edad}
                    name={j.nombre}
                    position={j.posicion}
                    club={j.club}
                    flag={j.nacionalidad}
                    image={j.imagen_url}
                    id={j.id}
                  />
                );
              })}
            </div>

            {cantidadVisible < jugadoresFiltrados.length && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setCantidadVisible((prev) => prev + 12)}
                  className="rounded-2xl bg-primary px-8 py-4 font-display text-lg font-bold uppercase text-black transition hover:scale-[1.02] hover:shadow-glow"
                >
                  Cargar más jugadores
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}