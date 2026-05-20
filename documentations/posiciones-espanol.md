# Normalizacion de posiciones

## Objetivo

Unificar las posiciones del proyecto para que se muestren en espanol:

```txt
POR
DEF
MED
DEL
```

## Archivo principal

```txt
src/lib/positions.js
```

Se agrego un helper compartido:

```js
normalizePositionCode(position)
```

Ese helper convierte posiciones largas, antiguas o en ingles al formato final.

Ejemplos:

```txt
Portero -> POR
GK -> POR
Defensa -> DEF
Mediocampista -> MED
MID -> MED
Delantero -> DEL
FWD -> DEL
```

## Donde se usa

Se conecto en:

- `src/components/Card.jsx`
- `src/components/Filtros.jsx`
- `src/components/Mercado.jsx`
- `src/components/CanchaEquipo.jsx`
- `src/pages/equipo.astro`
- `src/pages/admin/index.astro`
- `src/pages/api/admin/jugadores.js`
- `src/pages/api/comprar.js`
- `src/pages/api/jugadores.js`
- `src/pages/api/resumen-equipo.js`

## Admin

Al crear o editar jugadores desde admin, la posicion se guarda normalizada.

El selector usa:

```txt
POR - Portero
DEF - Defensa
MED - Mediocampista
DEL - Delantero
```

## Cancha

La cancha ya no usa abreviaturas visibles en ingles.

Tambien se cambiaron los nombres internos de los slots a espanol:

- `izquierda`
- `derecha`
- `centro`
- `centro izquierda`
- `centro derecha`

## Compatibilidad

El proyecto todavia acepta valores antiguos como compatibilidad.

Eso evita romper jugadores ya guardados con valores como:

```txt
FWD
MID
GK
Delantero
Portero
```

Pero al mostrarlos en la interfaz se ven como:

```txt
DEL
MED
POR
```
