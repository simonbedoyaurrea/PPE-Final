# Rediseño y CRUD de administración de jugadores

## Objetivo

Convertir la vista `/admin` en un panel completo para administrar jugadores desde Supabase sin salir de las tecnologías actuales del proyecto: Astro, JavaScript, Supabase y Tailwind CSS.

## Problema actual

La zona admin ya permite entrar y crear jugadores, pero no tiene un CRUD completo. Falta:

- Editar jugadores existentes.
- Eliminar jugadores.
- Tener una interfaz más clara para operaciones administrativas.
- Reutilizar la misma validación admin en todas las acciones.
- Mostrar mensajes de estado cuando una acción falla o termina correctamente.

## Solución propuesta

1. Mantener `/admin` como pantalla principal de administración.
2. Rediseñar la vista para que tenga:
   - Resumen superior con total de jugadores, países, posiciones y valor total.
   - Barra de búsqueda y filtros.
   - Formulario de creación.
   - Tabla de jugadores con acciones por fila.
   - Modal simple para edición.
   - Confirmación antes de eliminar.
3. Ampliar el endpoint `/api/admin/jugadores` para soportar:
   - `POST`: crear jugador.
   - `PATCH`: actualizar jugador.
   - `DELETE`: eliminar jugador.
4. Mantener la protección admin en cada método del endpoint usando `getAdminSession`.
5. Usar `fetch` desde el navegador para crear, editar y eliminar, y recargar la página cuando la operación termina correctamente.

## Campos administrados

El CRUD administra estos campos de la tabla `jugadores`:

- `nombre`
- `posicion`
- `club`
- `nacionalidad`
- `edad`
- `precio`
- `imagen_url`
- `goles`
- `asistencias`

## Decisiones de diseño

- La edición se hace en un `<dialog>` nativo para evitar instalar librerías.
- La eliminación usa un `<dialog>` estilizado, sin `confirm()` nativo del navegador.
- El backend convierte campos numéricos con una función común antes de guardar.
- La API no confía en el frontend: cada operación vuelve a validar sesión y permisos admin.
- La tabla se mantiene como fuente visual principal porque es más útil para administración que tarjetas.

## Cómo probar

1. Iniciar sesión con un usuario admin.
2. Entrar a `/admin`.
3. Crear un jugador nuevo.
4. Editarlo desde el botón de edición de su fila.
5. Eliminarlo desde el botón de borrar.
6. Confirmar que cada cambio se refleja en la tabla y en Supabase.
