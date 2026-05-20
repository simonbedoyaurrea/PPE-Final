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
  const [orden, setOrden] = useState("precio-desc");

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

  const idsComprados = useMemo(() => {
    return jugadoresComprados.map((item) => item.id_jugador);
  }, [jugadoresComprados]);

  const posicionCorta = (posicion) => {
    if (posicion === "Portero" || posicion === "POR") return "POR";
    if (posicion === "Defensa" || posicion === "DEF") return "DEF";
    if (posicion === "Mediocampista" || posicion === "MED") return "MED";
    if (posicion === "Delantero" || posicion === "DEL") return "DEL";
    return posicion;
  };

  const comprarJugador = async (jugadorId) => {

  const jugador = jugadores.find((j) => j.id === jugadorId);

  if (!jugador) {
    alert("Jugador no encontrado");
    return;
  }

  const posicion = posicionCorta(jugador.posicion);
  const cantidadActual = conteoPosiciones[posicion] || 0;
  const limite = limitesPorPosicion[posicion];

  if (limite && cantidadActual >= limite) {
    alert(`Ya tienes cubiertos todos los cupos de ${posicion}`);
    return;
  }
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

  const limitesPorPosicion = {
  DEL: 3,
  MED: 3,
  DEF: 4,
  POR: 1,
};

function contarPorPosicion(jugadoresComprados) {
  return jugadoresComprados.reduce((contador, compra) => {
    const posicion = posicionCorta(compra.jugadores?.posicion || compra.posicion);

    contador[posicion] = (contador[posicion] || 0) + 1;

    return contador;
  }, {});
}
const conteoPosiciones = contarPorPosicion(jugadoresComprados);

  const fuse = useMemo(() => {
    return new Fuse(jugadores, {
      keys: ["nombre", "club", "nacionalidad", "posicion"],
      threshold: 0.3,
    });
  }, [jugadores]);

  const jugadoresFiltrados = useMemo(() => {
    let resultado = jugadores;

    if (busqueda.trim()) {
      resultado = fuse.search(busqueda).map((r) => r.item);
    }

    if (filtroPosicion) {
      resultado = resultado.filter((j) => posicionCorta(j.posicion) === filtroPosicion);
    }

    if (filtroNacionalidad) {
      resultado = resultado.filter(
        (j) => j.nacionalidad === filtroNacionalidad
      );
    }

    if (filtroPrecio) {
      resultado = resultado.filter((j) => j.precio <= filtroPrecio);
    }

    const ordenado = [...resultado];

    if (orden === "precio-desc") {
      ordenado.sort((a, b) => Number(b.precio || 0) - Number(a.precio || 0));
    }

    if (orden === "precio-asc") {
      ordenado.sort((a, b) => Number(a.precio || 0) - Number(b.precio || 0));
    }

    if (orden === "nombre-asc") {
      ordenado.sort((a, b) => String(a.nombre || "").localeCompare(String(b.nombre || "")));
    }

    if (orden === "edad-asc") {
      ordenado.sort((a, b) => Number(a.edad || 0) - Number(b.edad || 0));
    }

    return ordenado;
  }, [
    jugadores,
    busqueda,
    filtroPosicion,
    filtroNacionalidad,
    filtroPrecio,
    fuse,
    orden,
  ]);

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
                Mostrando{" "}
                <strong className="text-on-surface">
                  {jugadoresFiltrados.length}
                </strong>{" "}
                de {jugadores.length} jugadores
              </span>

              <BarraBusqueda busqueda={busqueda} setBusqueda={setBusqueda} />

              <div className="flex items-center gap-2">
                <span className="font-body-md text-body-md text-on-surface-variant hidden sm:inline">
                  Ordenar:
                </span>

                <select
                  value={orden}
                  onChange={(event) => setOrden(event.target.value)}
                  className="bg-transparent border-none text-primary font-label-bold text-label-bold focus:ring-0 cursor-pointer"
                >
                  <option className="text-black" value="precio-desc">Mayor precio</option>
                  <option className="text-black" value="precio-asc">Menor precio</option>
                  <option className="text-black" value="nombre-asc">Nombre</option>
                  <option className="text-black" value="edad-asc">Menor edad</option>
                </select>
              </div>
            </div>

            {loadingComprados && (
              <p className="mb-6 text-on-surface-variant">
                Cargando tus jugadores comprados...
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-gutter gap-y-6 mt-8">
              {jugadoresFiltrados.map((j) => {
                const comprado = idsComprados.includes(j.id);

                return (
                  <Card
                    key={j.id}
                    onCompra={comprarJugador}
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
          </div>
        </div>
      </div>
    </>
  );
}
