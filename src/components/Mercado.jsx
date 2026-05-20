import { useEffect, useMemo, useRef, useState } from "react";
import Card from "./Card";
import Filtros from "./Filtros";
import BarraBusqueda from "./BarraBusqueda";
import Fuse from "fuse.js";
import { normalizeCountryCode } from "../lib/countries";

export default function Mercado({ jugadores, nacionalidades }) {
  const jugadoresPorPagina = 12;
  const [filtroPosicion, setFiltroPosicion] = useState(null);
  const [filtroPrecio, setFiltroPrecio] = useState(null);
  const [filtroNacionalidad, setFiltroNacionalidad] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("precio-desc");
  const [paginaActual, setPaginaActual] = useState(1);
  const [aviso, setAviso] = useState(null);

  const [jugadoresComprados, setJugadoresComprados] = useState([]);
  const [loadingComprados, setLoadingComprados] = useState(true);
  const avisoTimeout = useRef(null);

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

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroPosicion, filtroNacionalidad, filtroPrecio, orden]);

  const mostrarAviso = (tipo, titulo, mensaje) => {
    if (avisoTimeout.current) {
      window.clearTimeout(avisoTimeout.current);
    }

    setAviso({ tipo, titulo, mensaje });
    avisoTimeout.current = window.setTimeout(() => setAviso(null), 3500);
  };

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
    mostrarAviso("error", "Jugador no encontrado", "No se encontro el jugador seleccionado.");
    return;
  }

  const posicion = posicionCorta(jugador.posicion);
  const cantidadActual = conteoPosiciones[posicion] || 0;
  const limite = limitesPorPosicion[posicion];

  if (limite && cantidadActual >= limite) {
    mostrarAviso(
      "error",
      "Cupo lleno",
      `Ya tienes cubiertos todos los cupos de ${posicion}.`,
    );
    return;
  }

  try {
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
      mostrarAviso("error", "No se pudo comprar", data.error || "Error al comprar jugador.");
      return;
    }

    mostrarAviso("success", "Compra realizada", "Jugador comprado correctamente.");

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
  } catch {
    mostrarAviso("error", "Error de conexion", "No se pudo completar la compra.");
  }
  };

  const venderJugador = async (jugadorId) => {
    try {
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
        mostrarAviso("error", "No se pudo vender", data.error || "Error al vender jugador.");
        return;
      }

      setJugadoresComprados((prev) =>
        prev.filter((compra) => compra.id_jugador !== jugadorId),
      );
      mostrarAviso("success", "Venta realizada", "Jugador vendido correctamente.");
    } catch {
      mostrarAviso("error", "Error de conexion", "No se pudo completar la venta.");
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
        (j) => normalizeCountryCode(j.nacionalidad) === filtroNacionalidad
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

  const totalPaginas = Math.max(
    1,
    Math.ceil(jugadoresFiltrados.length / jugadoresPorPagina),
  );
  const inicioPagina = (paginaActual - 1) * jugadoresPorPagina;
  const finPagina = inicioPagina + jugadoresPorPagina;
  const jugadoresPaginados = jugadoresFiltrados.slice(inicioPagina, finPagina);
  const primerJugadorVisible =
    jugadoresFiltrados.length === 0 ? 0 : inicioPagina + 1;
  const ultimoJugadorVisible = Math.min(finPagina, jugadoresFiltrados.length);
  const paginasVisibles = Array.from({ length: totalPaginas }, (_, index) => index + 1)
    .filter((pagina) => {
      return (
        pagina === 1 ||
        pagina === totalPaginas ||
        Math.abs(pagina - paginaActual) <= 1
      );
    });

  return (
    <>
      <div className="flex-1 px-4 md:px-margin py-margin pb-32 md:pb-margin">
        {aviso && (
          <div className="fixed right-4 top-4 z-50 w-[min(360px,calc(100vw-32px))] rounded-2xl border border-outline-variant/30 bg-surface-container-high p-4 text-on-surface shadow-[0_18px_42px_rgba(0,0,0,0.45)]">
            <div className="flex gap-3">
              <span
                className={`material-symbols-outlined mt-0.5 text-[22px] ${
                  aviso.tipo === "error" ? "text-error" : "text-primary"
                }`}
              >
                {aviso.tipo === "error" ? "error" : "check_circle"}
              </span>

              <div>
                <p className="font-label-bold text-label-bold">
                  {aviso.titulo}
                </p>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {aviso.mensaje}
                </p>
              </div>
            </div>
          </div>
        )}

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
            <div className="flex flex-col gap-4 border-b border-outline-variant/20 pb-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
              <span className="font-body-md text-body-md text-on-surface-variant">
                Mostrando{" "}
                <strong className="text-on-surface">
                  {primerJugadorVisible}-{ultimoJugadorVisible}
                </strong>{" "}
                de {jugadoresFiltrados.length} jugadores
              </span>

              <BarraBusqueda busqueda={busqueda} setBusqueda={setBusqueda} />

              <div className="flex items-center gap-2 rounded-full border border-transparent px-3 py-2 transition-all duration-200 hover:border-primary/40 hover:bg-surface-container/60 hover:shadow-glow">
                <span className="font-body-md text-body-md text-on-surface-variant hidden sm:inline">
                  Ordenar:
                </span>

                <select
                  value={orden}
                  onChange={(event) => setOrden(event.target.value)}
                  className="bg-transparent border-none text-primary font-label-bold text-label-bold outline-none focus:ring-0 cursor-pointer"
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
              {jugadoresPaginados.map((j) => {
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

            {jugadoresFiltrados.length > jugadoresPorPagina && (
              <nav className="mt-8 flex flex-col gap-3 border-t border-outline-variant/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-on-surface-variant">
                  Pagina {paginaActual} de {totalPaginas}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={paginaActual === 1}
                    onClick={() => setPaginaActual((pagina) => Math.max(1, pagina - 1))}
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-outline-variant/40 px-3 font-label-bold text-label-bold text-on-surface-variant transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-outline-variant/40 disabled:hover:text-on-surface-variant"
                  >
                    Anterior
                  </button>

                  {paginasVisibles.map((pagina, index) => {
                    const anterior = paginasVisibles[index - 1];
                    const mostrarSeparador = anterior && pagina - anterior > 1;

                    return (
                      <div className="flex items-center gap-2" key={pagina}>
                        {mostrarSeparador && (
                          <span className="px-1 text-on-surface-variant">...</span>
                        )}

                        <button
                          type="button"
                          onClick={() => setPaginaActual(pagina)}
                          className={`h-10 min-w-10 rounded-lg border px-3 font-label-bold text-label-bold transition-all ${
                            pagina === paginaActual
                              ? "border-primary bg-primary/20 text-primary shadow-glow"
                              : "border-outline-variant/40 text-on-surface-variant hover:border-primary hover:bg-surface-container-high hover:text-primary"
                          }`}
                        >
                          {pagina}
                        </button>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    disabled={paginaActual === totalPaginas}
                    onClick={() =>
                      setPaginaActual((pagina) => Math.min(totalPaginas, pagina + 1))
                    }
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-outline-variant/40 px-3 font-label-bold text-label-bold text-on-surface-variant transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-outline-variant/40 disabled:hover:text-on-surface-variant"
                  >
                    Siguiente
                  </button>
                </div>
              </nav>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
