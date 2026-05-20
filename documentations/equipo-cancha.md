# Ajustes de la pagina Mi Equipo

## Objetivo

Mejorar la vista de la cancha sin cambiar la logica principal de la pagina.

La interaccion de vender jugadores se mantiene igual:

```txt
/api/vender
```

## Archivo modificado

```txt
src/components/CanchaEquipo.jsx
```

## Espacios vacios

Antes los espacios vacios mostraban:

```txt
Sin compra
```

Como el espacio del jugador es pequeno, ese texto se cortaba y se veia como:

```txt
Sin com...
```

Ahora los espacios vacios muestran:

```txt
Disponible
Agregar
```

Esto se entiende mejor y se ve mas ordenado dentro de cada slot de la cancha.

## Colores de posicion

Las posiciones ya no dependen solo del verde principal.

Se usan colores distintos para contrastar mejor con el fondo de la cancha:

- `FWD`: amarillo/dorado.
- `MID`: azul.
- `DEF`: rojo suave.
- `GK`: violeta.

Esto hace que las etiquetas se lean mejor sobre el campo verde oscuro.

## Hovers de jugadores

Cada slot de jugador ahora tiene un hover mas claro:

- El slot sube un poco.
- La foto crece suavemente.
- El borde gana brillo.
- Los espacios vacios resaltan el icono de agregar.
- El boton `Vender` tiene hover propio.

La venta sigue usando la misma funcion:

```js
venderJugador(player.id)
```

## Hovers de paneles

Tambien se mejoraron los hovers de:

- Contenedor de la cancha.
- Panel de plantilla.
- Panel de presupuesto.
- Panel de plantilla activa.

El efecto es suave:

- Sube un poco.
- Cambia el borde.
- Agrega una sombra ligera.

## Resultado esperado

La pagina `Mi Equipo` queda mas clara:

- Los espacios vacios ya no muestran texto cortado.
- Las posiciones contrastan mejor con la cancha.
- Los jugadores se sienten mas interactivos.
- La accion de vender no cambia ni se rompe.
