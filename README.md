# World Cup Fantasy

Guia rapida para entender el proyecto completo: estructura, herramientas, rutas, APIs, componentes y donde se maneja cada funcion.

## Resumen

World Cup Fantasy es una aplicacion fantasy de futbol hecha con Astro, React, Tailwind CSS y Supabase.

El usuario puede:

- registrarse e iniciar sesion;
- ver el mercado de jugadores;
- buscar, filtrar, ordenar y paginar jugadores;
- comprar y vender jugadores;
- ver su equipo en una cancha;
- revisar perfil, saldo, gasto y jugadores comprados;
- si es admin, crear, editar y eliminar jugadores del mercado.

## Stack

| Parte | Herramienta | Archivo clave |
| --- | --- | --- |
| Framework | Astro | `astro.config.mjs` |
| UI interactiva | React | `src/components/*.jsx` |
| Estilos | Tailwind CSS | `tailwind.config.js`, `src/styles/tailwind.css` |
| Base de datos/auth | Supabase | `src/lib/supabase.js` |
| Busqueda | Fuse.js | `src/components/Mercado.jsx` |
| Deploy adapter | Cloudflare | `astro.config.mjs` |

## Comandos

```bash
npm install
npm run dev
npm run build
npm run preview
```

Nota: en algunos entornos sandbox `npm run build` puede fallar por el plugin de Cloudflare al leer interfaces de red. No es un error del codigo de la app.

## Variables de entorno

El proyecto necesita estas variables:

```bash
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
ADMIN_EMAILS=
```

Tambien se aceptan estas variantes para admin:

```bash
ADMIN_EMAIL=
PUBLIC_ADMIN_EMAILS=
PUBLIC_ADMIN_EMAIL=
```

## Estructura

```text
/
├── README.md
├── documentations/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   ├── layout/
│   ├── lib/
│   ├── pages/
│   │   ├── api/
│   │   └── admin/
│   └── styles/
├── astro.config.mjs
├── package.json
└── tailwind.config.js
```

## Rutas visuales

| Ruta | Archivo | Funcion |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | Pagina de inicio, botones a login/registro y carrusel de jugadores destacados. |
| `/login` | `src/pages/login.astro` | Formulario de inicio de sesion. Llama a `/api/login`. |
| `/registro` | `src/pages/registro.astro` | Formulario de registro. Llama a `/api/registro`. |
| `/dashboard` | `src/pages/dashboard.astro` | Mercado principal. Protegido por sesion. Renderiza `Mercado.jsx`. |
| `/equipo` | `src/pages/equipo.astro` | Cancha del equipo comprado. Protegido por sesion. Renderiza `CanchaEquipo.jsx`. |
| `/perfil` | `src/pages/perfil.astro` | Cuenta del usuario, resumen, jugadores comprados, vender y cerrar sesion. |
| `/admin` | `src/pages/admin/index.astro` | CRUD de jugadores. Solo visible para admins. |

## Layout principal

`src/layout/HomeLayout.astro`

Maneja:

- sidebar de navegacion;
- menu: Mercado, Equipo, Admin si aplica, Perfil;
- iconos Material Symbols;
- favicon;
- estilos globales del scrollbar;
- validacion de admin para mostrar u ocultar el enlace Admin.

El boton Dashboard fue eliminado visualmente como concepto separado. El mercado vive en `/dashboard` pero se muestra como `Mercado`.

## Autenticacion

### Libreria

`src/lib/auth.js`

Funciones importantes:

- `getSessionCookieOptions(maxAge)`: opciones para guardar cookies seguras de Supabase.
- `getLogoutCookieOptions()`: opciones para borrar cookies.
- `getAuthSession(cookies)`: lee `sb-access-token`, valida el usuario con Supabase y devuelve sesion.
- `getAdminSession(cookies)`: valida si el usuario es admin por metadata o email.
- `parseAdminEmails()`: lee emails admin desde variables de entorno.
- `userHasAdminRole(user)`: valida rol admin en metadata.

`src/lib/adminAuth.js`

- reexporta `getAdminSession`.

### APIs

| API | Archivo | Funcion |
| --- | --- | --- |
| `POST /api/login` | `src/pages/api/login.js` | Hace `signInWithPassword`, guarda access/refresh token en cookies. |
| `POST /api/registro` | `src/pages/api/registro.js` | Hace `signUp`, crea metadata de usuario/equipo y guarda cookies si hay sesion. |
| `POST /api/logout` | `src/pages/api/logout.js` | Cierra sesion y borra cookies. |
| `GET /api/user` | `src/pages/api/user.js` | Devuelve datos del usuario autenticado. |

## Supabase

`src/lib/supabase.js`

Crea el cliente:

```js
createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)
```

Tablas usadas por el codigo:

| Tabla | Uso |
| --- | --- |
| `jugadores` | Catalogo del mercado. |
| `usuario_jugadores` | Relacion entre usuario y jugadores comprados. |
| `perfil` | Saldo disponible del usuario. |

Campos esperados en `jugadores`:

```text
id
nombre
posicion
club
nacionalidad
edad
precio
imagen_url
goles
asistencias
```

Campos esperados en `perfil`:

```text
id
saldo
```

Campos esperados en `usuario_jugadores`:

```text
id
id_usuario
id_jugador
```

## Mercado

### Entrada de datos

`src/pages/dashboard.astro`

Hace:

- valida sesion con `getAuthSession`;
- si no hay sesion redirige a `/login`;
- lee `jugadores` desde Supabase;
- lee nacionalidades desde Supabase;
- renderiza `<Mercado client:load />`.

### Componente principal

`src/components/Mercado.jsx`

Maneja:

- estado de filtros;
- busqueda con Fuse.js;
- ordenamiento;
- paginacion de 12 jugadores por pagina;
- jugadores comprados;
- compra y venta;
- avisos visuales tipo toast.

Estados principales:

```js
filtroPosicion
filtroPrecio
filtroNacionalidad
busqueda
orden
paginaActual
jugadoresComprados
aviso
```

Funciones principales:

- `cargarJugadoresComprados()`: llama a `/api/mis_jugadores`.
- `mostrarAviso(tipo, titulo, mensaje)`: muestra notificacion estilizada.
- `comprarJugador(jugadorId)`: valida cupo de posicion y llama a `/api/comprar`.
- `venderJugador(jugadorId)`: llama a `/api/vender`.
- `contarPorPosicion(jugadoresComprados)`: calcula cupos usados.
- `jugadoresFiltrados`: aplica busqueda, filtros y orden.
- paginacion: `jugadoresPaginados`, `paginaActual`, `totalPaginas`.

### Carta de jugador

`src/components/Card.jsx`

Maneja:

- imagen del jugador;
- posicion en formato espanol (`POR`, `DEF`, `MED`, `DEL`);
- icono limpio de escudo para club;
- bandera por codigo de pais;
- edad con icono;
- precio;
- boton `COMPRAR`, `VENDER` o `CUPO LLENO`;
- hover visual de carta, imagen y boton.

### Filtros

`src/components/Filtros.jsx`

Maneja:

- filtro por posicion;
- filtro por nacionalidad;
- boton reset;
- hover del panel y controles;
- usa `POSITION_CODES` y `normalizeCountryCode`.

### Busqueda

`src/components/BarraBusqueda.jsx`

Maneja:

- input de busqueda;
- icono Material Symbols `search`;
- hover/focus del input.

## Compra y venta

### Comprar

`src/pages/api/comprar.js`

Proceso:

1. Lee `jugadorId`.
2. Valida cookie `sb-access-token`.
3. Obtiene usuario con Supabase Auth.
4. Lee perfil y saldo.
5. Lee jugador.
6. Valida saldo suficiente.
7. Valida que el jugador no este comprado.
8. Valida limite por posicion.
9. Inserta en `usuario_jugadores`.
10. Descuenta saldo en `perfil`.

Usa:

- `POSITION_LIMITS`
- `normalizePositionCode`

Limites actuales:

```js
POR: 1
DEF: 4
MED: 3
DEL: 3
```

### Vender

`src/pages/api/vender.js`

Proceso:

1. Valida usuario autenticado.
2. Busca la compra del usuario.
3. Lee precio del jugador.
4. Lee saldo del perfil.
5. Borra registro en `usuario_jugadores`.
6. Suma el precio al saldo.

## Equipo

### Pagina

`src/pages/equipo.astro`

Hace:

- valida cookie `sb-access-token`;
- obtiene usuario de Supabase;
- lee compras del usuario;
- normaliza jugadores para el componente;
- lee saldo desde `perfil`;
- renderiza `<CanchaEquipo client:load />`.

### Cancha

`src/components/CanchaEquipo.jsx`

Maneja:

- formacion fija de 11 espacios;
- distribucion por posicion;
- nombres de espacios vacios como `Disponible`;
- boton visual `Agregar` en espacios vacios;
- venta de jugadores desde la cancha;
- resumen de plantilla;
- presupuesto usado/libre;
- lista de plantilla activa;
- toasts visuales;
- colores diferenciados por posicion.

Formacion actual:

```text
3 DEL
3 MED
4 DEF
1 POR
```

Los lados estan en espanol:

```text
Izquierda
Centro
Derecha
Centro izquierda
Centro derecha
```

## Perfil

`src/pages/perfil.astro`

Maneja:

- datos del manager;
- nombre del equipo;
- email;
- total de jugadores;
- gasto total;
- saldo;
- lista de jugadores comprados;
- vender desde perfil;
- cerrar sesion.

Funciones principales:

- `showNotice(type, title, message)`: notificacion estilizada.
- `loadProfile()`: llama a `/api/user`.
- `loadResumen()`: llama a `/api/resumen-equipo`.
- `venderJugador(jugadorId)`: llama a `/api/vender`.
- listener de `logoutBtn`: llama a `/api/logout` y redirige a `/login`.

## Resumen de equipo

`src/pages/api/resumen-equipo.js`

Devuelve:

- perfil;
- jugadores comprados;
- gasto total;
- saldo;
- posiciones normalizadas.

Lo consume principalmente `src/pages/perfil.astro`.

## Admin CRUD

### Pagina

`src/pages/admin/index.astro`

Proteccion:

- valida sesion con `getAdminSession`;
- si no hay login, redirige a `/login`;
- si no es admin, redirige a `/dashboard`.

Funciones visuales:

- estadisticas del mercado;
- buscador;
- filtros por posicion/nacionalidad;
- crear jugador;
- tabla de jugadores;
- modal centrado para editar;
- dialog estilizado para eliminar;
- mensajes visuales sin `alert`, `confirm` ni `prompt`.

Funciones JS principales:

- `setMessage(element, message, type)`: pinta mensajes de exito/error.
- `getPayload(form)`: arma payload desde formulario.
- `sendPlayerRequest(method, payload)`: llama a `/api/admin/jugadores`.
- `filtrarJugadores()`: filtra filas visibles de la tabla.
- listeners de crear, editar y eliminar.

### API admin

`src/pages/api/admin/jugadores.js`

Metodos:

| Metodo | Funcion |
| --- | --- |
| `POST` | Crear jugador. |
| `PATCH` | Editar jugador. |
| `DELETE` | Eliminar jugador. |

Funciones internas:

- `buildPlayerPayload(body)`: normaliza y prepara datos.
- `validatePlayer(jugador)`: valida campos obligatorios.
- `requireAdmin(cookies)`: valida admin y crea cliente Supabase autenticado.

Normaliza:

- `posicion` con `normalizePositionCode`;
- `nacionalidad` con `normalizeCountryCode`;
- numeros con `toNumber`.

### Debug admin

`src/pages/api/admin/debug.js`

Devuelve informacion de sesion/admin para depuracion.

## Normalizacion de posiciones

`src/lib/positions.js`

Formato oficial visible del proyecto:

```text
POR
DEF
MED
DEL
```

Exports:

- `POSITION_CODES`
- `POSITION_LABELS`
- `POSITION_LIMITS`
- `normalizePositionCode(position)`

La funcion acepta valores antiguos o en ingles para compatibilidad:

```text
GK -> POR
MID -> MED
FWD -> DEL
Portero -> POR
Defensa -> DEF
Mediocampista -> MED
Delantero -> DEL
```

## Normalizacion de paises

`src/lib/countries.js`

Funcion principal:

```js
normalizeCountryCode(value)
```

Convierte:

- codigos de 2 letras a mayuscula;
- nombres de pais en espanol/ingles a codigo ISO de 2 letras;
- alias comunes como `Brasil`, `Brazil`, `Puerto Rico`, `Estados Unidos`.

Se usa en:

- cartas de mercado;
- filtros;
- admin CRUD;
- API de jugadores.

Las banderas se muestran con:

```text
https://flagcdn.com/w40/{codigo}.png
```

## APIs publicas internas

| API | Metodo | Archivo | Uso |
| --- | --- | --- | --- |
| `/api/jugadores` | GET | `src/pages/api/jugadores.js` | Lista jugadores normalizando posiciones. |
| `/api/mis_jugadores` | GET | `src/pages/api/mis_jugadores.js` | Lista compras del usuario autenticado. |
| `/api/comprar` | POST | `src/pages/api/comprar.js` | Compra jugador y resta saldo. |
| `/api/vender` | POST | `src/pages/api/vender.js` | Vende jugador y devuelve saldo. |
| `/api/resumen-equipo` | GET | `src/pages/api/resumen-equipo.js` | Perfil, saldo, gasto y jugadores. |
| `/api/user` | GET | `src/pages/api/user.js` | Usuario autenticado. |
| `/api/login` | POST | `src/pages/api/login.js` | Login. |
| `/api/registro` | POST | `src/pages/api/registro.js` | Registro. |
| `/api/logout` | POST | `src/pages/api/logout.js` | Logout. |
| `/api/admin/jugadores` | POST/PATCH/DELETE | `src/pages/api/admin/jugadores.js` | CRUD admin. |
| `/api/admin/debug` | GET | `src/pages/api/admin/debug.js` | Debug admin. |

## Estilos y UI

### Tema

`tailwind.config.js`

Define:

- colores principales;
- paleta de superficies oscuras;
- `primary` menta;
- `accent` dorado;
- sombras `shadow-glow`;
- fuente `Inter`;
- fuente display `Lexend`;
- fondo `bg-stadium`.

### CSS global

`src/styles/tailwind.css`

Importa Tailwind y estilos globales del proyecto.

### Iconos

Se usan Material Symbols por CDN en `HomeLayout.astro`.

El favicon esta en:

```text
public/favicon.svg
```

## Notificaciones

No se usan alertas nativas de JavaScript.

Revisado:

```text
alert()
confirm()
prompt()
```

Todas fueron reemplazadas por mensajes o dialogs estilizados.

Ubicaciones:

- mercado: `src/components/Mercado.jsx`;
- equipo: `src/components/CanchaEquipo.jsx`;
- perfil: `src/pages/perfil.astro`;
- login: `src/pages/login.astro`;
- registro: `src/pages/registro.astro`;
- admin: `src/pages/admin/index.astro`.

## Documentacion extra

La carpeta `documentations/` contiene notas por cambio o area:

| Archivo | Tema |
| --- | --- |
| `documentations/admin-crud.md` | CRUD admin. |
| `documentations/menu-mercado.md` | Menu y mercado. |
| `documentations/mercado-listado.md` | Listado del mercado. |
| `documentations/equipo-cancha.md` | Pagina Mi Equipo. |
| `documentations/notificaciones-ui.md` | Alertas estilizadas. |
| `documentations/nacionalidades-codigos.md` | Normalizacion de paises. |
| `documentations/posiciones-espanol.md` | Posiciones en espanol. |
| `documentations/hovers-generales.md` | Hovers generales y formularios. |

## Flujo rapido por funcionalidad

### Quiero cambiar el mercado

Tocar:

```text
src/pages/dashboard.astro
src/components/Mercado.jsx
src/components/Card.jsx
src/components/Filtros.jsx
src/components/BarraBusqueda.jsx
```

### Quiero cambiar compra/venta

Tocar:

```text
src/components/Mercado.jsx
src/components/Card.jsx
src/pages/api/comprar.js
src/pages/api/vender.js
src/pages/api/mis_jugadores.js
```

### Quiero cambiar la cancha

Tocar:

```text
src/pages/equipo.astro
src/components/CanchaEquipo.jsx
src/lib/positions.js
```

### Quiero cambiar perfil

Tocar:

```text
src/pages/perfil.astro
src/pages/api/user.js
src/pages/api/resumen-equipo.js
src/pages/api/vender.js
src/pages/api/logout.js
```

### Quiero cambiar login/registro

Tocar:

```text
src/pages/login.astro
src/pages/registro.astro
src/pages/api/login.js
src/pages/api/registro.js
src/lib/auth.js
```

### Quiero cambiar admin

Tocar:

```text
src/pages/admin/index.astro
src/pages/api/admin/jugadores.js
src/lib/auth.js
src/lib/countries.js
src/lib/positions.js
```

### Quiero cambiar estilos globales

Tocar:

```text
tailwind.config.js
src/styles/tailwind.css
src/layout/HomeLayout.astro
```

## Reglas importantes del proyecto

- Posiciones visibles siempre en espanol: `POR`, `DEF`, `MED`, `DEL`.
- Nacionalidades se guardan y muestran como codigo ISO de 2 letras en mayuscula cuando se normalizan.
- Las rutas protegidas deben validar sesion antes de leer datos privados.
- Admin se habilita por metadata de Supabase o email configurado en env.
- El mercado pagina 12 jugadores por pagina para rendimiento.
- Las alertas nativas de JS no se usan.
- La UI sigue un estilo oscuro, menta y dorado, con hovers suaves.

## Checklist antes de entregar cambios

```bash
npm run build
```

Revisar tambien:

```bash
git status
```

Si se cambio una funcion importante, actualizar este README o el documento puntual dentro de `documentations/`.
