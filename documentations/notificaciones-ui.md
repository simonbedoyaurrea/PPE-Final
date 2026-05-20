# Notificaciones estilizadas

## Objetivo

Quitar las notificaciones nativas del navegador:

```js
alert()
confirm()
prompt()
```

Estas ventanas no se pueden estilizar bien porque las controla el navegador.

## Estado final

Se reviso todo `src` y ya no quedan usos de:

- `alert(`
- `confirm(`
- `prompt(`

## Login

Archivo:

```txt
src/pages/login.astro
```

El error de login ahora se muestra dentro del formulario con un mensaje estilizado.

## Registro

Archivo:

```txt
src/pages/registro.astro
```

El error de registro ahora se muestra dentro del formulario con un mensaje estilizado.

## Perfil

Archivo:

```txt
src/pages/perfil.astro
```

El error al vender un jugador desde el perfil ahora usa un aviso flotante.

## Mercado

Archivo:

```txt
src/components/Mercado.jsx
```

Las compras y ventas del mercado usan avisos flotantes para:

- Compra realizada.
- Venta realizada.
- Cupo lleno.
- Error de conexion.
- Error devuelto por la API.

## Mi Equipo

Archivo:

```txt
src/components/CanchaEquipo.jsx
```

El error al vender un jugador desde la cancha usa un aviso flotante.

## Admin

Archivo:

```txt
src/pages/admin/index.astro
```

La eliminacion de jugadores ya no usa `window.confirm()`.

Ahora se usa un dialog propio:

```txt
data-delete-dialog
```

Los errores al eliminar se muestran dentro del dialog con el mismo sistema de mensajes del formulario admin.

## Verificacion usada

Comando:

```bash
rg -n "\\balert\\(|\\bconfirm\\(|\\bprompt\\(" src
```

Resultado esperado:

```txt
sin resultados
```
