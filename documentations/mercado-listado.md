# Ajustes del mercado de jugadores

## Objetivo

Mejorar la pantalla del mercado sin hacer codigo complicado.

Se corrigieron tres partes:

- La barra de busqueda.
- El contador y el ordenamiento.
- El diseno de cada carta de jugador.

## Barra de busqueda

Archivo:

```txt
src/components/BarraBusqueda.jsx
```

Antes la lupa era un emoji:

```jsx
🔍
```

Eso se veia diferente al resto de iconos de la aplicacion.

Ahora se usa el icono de Material Symbols:

```jsx
search
```

Esto mantiene el mismo estilo visual que el menu y los botones.

## Filtros

Archivo:

```txt
src/components/Filtros.jsx
```

El icono de filtros tambien se cambio a Material Symbols:

```jsx
filter_list
```

Ademas, los botones de posicion ahora usan valores cortos:

```js
POR
DEF
MED
DEL
```

Esto ayuda porque algunos jugadores antiguos tienen posiciones como `DEF` y otros pueden tener posiciones como `Defensa`.

## Contador de jugadores

Archivo:

```txt
src/components/Mercado.jsx
```

Antes el texto decia:

```txt
Showing 99 players
```

Ahora dice:

```txt
Mostrando 99 de 100 jugadores
```

El numero cambia cuando se usa la busqueda o los filtros.

## Ordenamiento

Archivo:

```txt
src/components/Mercado.jsx
```

Antes el selector de ordenamiento solo mostraba opciones, pero no tenia logica.

Ahora tiene un estado:

```js
const [orden, setOrden] = useState("precio-desc");
```

Y el listado se ordena segun la opcion elegida:

- Mayor precio.
- Menor precio.
- Nombre.
- Menor edad.

## Posiciones normalizadas

Archivo:

```txt
src/lib/positions.js
```

Se agrego una funcion compartida para tratar igual las posiciones largas, cortas y valores antiguos:

```js
normalizePositionCode(posicion)
```

Asi el filtro de defensa funciona tanto con `DEF` como con `Defensa`.

El formato visible final siempre queda en espanol:

```txt
POR
DEF
MED
DEL
```

## Cartas de jugadores

Archivo:

```txt
src/components/Card.jsx
```

La carta mantiene la idea original:

- Fondo oscuro.
- Posicion del jugador.
- Foto del jugador.
- Nombre en mayusculas.
- Club, nacionalidad y edad.
- Precio destacado.
- Boton para comprar.

Pero se ajusto el diseno para que se vea mas ordenado:

- La imagen ya no queda flotando fuera de la carta.
- El texto tiene mejor separacion.
- El precio tiene una etiqueta clara.
- El boton ahora dice `COMPRAR` en vez de `BUY`.
- La carta tiene un efecto suave al pasar el mouse.

## Hover visual

Archivos:

```txt
src/components/Card.jsx
src/components/Filtros.jsx
src/components/BarraBusqueda.jsx
src/components/Mercado.jsx
```

Se mejoro el hover de varias partes del mercado:

- Las cartas suben un poco y resaltan el borde.
- La imagen del jugador crece suavemente.
- Los botones de filtro resaltan con el color principal.
- La barra de busqueda cambia borde, fondo y sombra.
- El selector de ordenamiento tiene un contenedor con hover.

La idea fue mantener el mismo estilo oscuro con verde principal que ya usa el proyecto.

### Correccion del hover de filtros

Archivo:

```txt
src/components/Filtros.jsx
```

El panel de filtros tenia una clase `group` en el contenedor principal.

Eso hacia que algunos textos internos cambiaran de color cuando el mouse estaba sobre cualquier parte del bloque.

Se quito ese `group` del contenedor y se dejo el hover solo en cada boton de posicion.

Tambien se quito del panel:

```txt
max-h-[calc(100vh-7rem)] overflow-y-auto
```

El contenido del filtro no necesita scroll interno, y ese `overflow-y-auto` podia activar el estilo global del scrollbar dentro del panel.

Eso producia una franja oscura en el lado derecho del bloque de filtros.

Resultado:

- El bloque completo ya no se ilumina de forma exagerada.
- El panel ya no muestra una franja oscura lateral por scrollbar interno.
- Cada boton responde solo cuando el mouse esta encima de ese boton.
- El filtro activo sigue marcado con el color principal.

## Bandera del jugador

Archivo:

```txt
src/components/Card.jsx
```

La carta ahora intenta mostrar la bandera segun el codigo de nacionalidad.

Ejemplo:

```txt
FR -> https://flagcdn.com/w40/fr.png
BR -> https://flagcdn.com/w40/br.png
```

Si no se puede cargar la bandera, se muestra un icono local de bandera.

## Escudo del equipo

Archivo:

```txt
src/components/Card.jsx
```

Se dejo un icono limpio para todos los equipos:

```txt
shield
```

Antes se habia probado cargar escudos externos de clubes, pero el resultado mezclaba iconos reales con estilos muy diferentes.

Para mantener la interfaz uniforme, todos los clubes usan el mismo icono de escudo con el color principal del proyecto.

Esto tambien evita depender de una API externa para una parte decorativa de la carta.

## Icono de edad

Archivo:

```txt
src/components/Card.jsx
```

La edad ahora tiene un icono de Material Symbols:

```txt
cake
```

Asi la informacion de club, pais y edad queda con la misma estructura visual.

## Avisos visuales

Archivo:

```txt
src/components/Mercado.jsx
```

Se reemplazaron los `alert()` del navegador por un aviso flotante dentro de la pagina.

Ahora las acciones muestran mensajes con el estilo del proyecto:

- Compra realizada.
- Venta realizada.
- Cupo lleno.
- Error de conexion.
- Error devuelto por la API.

Esto mejora la experiencia porque el aviso no bloquea la pagina.

## Venta desde mercado

Archivo:

```txt
src/components/Mercado.jsx
```

La carta ya tenia el boton `VENDER` cuando un jugador estaba comprado, pero faltaba pasarle la funcion de venta.

Ahora `Mercado.jsx` tiene una funcion:

```js
venderJugador
```

Esa funcion llama a:

```txt
/api/vender
```

Cuando la venta sale bien, el jugador se quita de la lista de comprados y el boton vuelve a mostrar `COMPRAR`.

## Paginacion del mercado

Archivo:

```txt
src/components/Mercado.jsx
```

Se reactivo una paginacion simple para no renderizar todas las cartas al mismo tiempo.

Ahora se muestran:

```txt
12 jugadores por pagina
```

La cantidad se guarda en una constante:

```js
const jugadoresPorPagina = 12;
```

La pagina actual se maneja con un estado:

```js
const [paginaActual, setPaginaActual] = useState(1);
```

El listado visible se obtiene cortando el arreglo filtrado:

```js
const inicioPagina = (paginaActual - 1) * jugadoresPorPagina;
const finPagina = inicioPagina + jugadoresPorPagina;
const jugadoresPaginados = jugadoresFiltrados.slice(inicioPagina, finPagina);
```

Cuando cambia la busqueda, un filtro o el ordenamiento, la pagina vuelve a 1:

```js
useEffect(() => {
  setPaginaActual(1);
}, [busqueda, filtroPosicion, filtroNacionalidad, filtroPrecio, orden]);
```

Esto evita quedarse en una pagina vacia despues de filtrar.

La interfaz tiene:

- Boton `Anterior`.
- Boton `Siguiente`.
- Numeros de pagina cercanos a la pagina actual.
- Puntos suspensivos cuando hay paginas intermedias.

El contador superior tambien cambio.

Antes mostraba el total completo.

Ahora muestra el rango visible:

```txt
Mostrando 1-12 de 99 jugadores
```

Si se filtra o busca, ese total se actualiza segun el resultado filtrado.

## Resultado esperado

La pantalla del mercado queda mas consistente:

- Sin emoji de lupa.
- Ordenamiento funcional.
- Contador mas claro.
- Filtros compatibles con posiciones antiguas y nuevas.
- Cartas mas limpias y faciles de leer.
- Banderas cuando el codigo de pais es valido.
- Icono de escudo uniforme para todos los clubes.
- Avisos visuales en vez de alertas nativas del navegador.
- Paginacion para renderizar menos cartas al mismo tiempo.
