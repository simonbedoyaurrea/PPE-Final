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
src/components/Mercado.jsx
```

Se agrego una funcion simple para tratar igual las posiciones largas y cortas:

```js
const posicionCorta = (posicion) => {
  if (posicion === "Portero" || posicion === "POR") return "POR";
  if (posicion === "Defensa" || posicion === "DEF") return "DEF";
  if (posicion === "Mediocampista" || posicion === "MED") return "MED";
  if (posicion === "Delantero" || posicion === "DEL") return "DEL";
  return posicion;
};
```

Asi el filtro de defensa funciona tanto con `DEF` como con `Defensa`.

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

## Resultado esperado

La pantalla del mercado queda mas consistente:

- Sin emoji de lupa.
- Ordenamiento funcional.
- Contador mas claro.
- Filtros compatibles con posiciones antiguas y nuevas.
- Cartas mas limpias y faciles de leer.
