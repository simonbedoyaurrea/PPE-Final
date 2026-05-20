# Ajuste del menu lateral

## Cambio realizado

Se elimino el boton **Dashboard** del menu lateral.

El menu ahora conserva **Mercado** como la opcion principal para entrar a la pagina `/dashboard`.

## Motivo

Antes existian dos botones diferentes:

- **Dashboard**
- **Mercado**

Los dos enviaban al mismo lugar: `/dashboard`.

Como la pagina `/dashboard` muestra el componente de mercado de jugadores, tener los dos botones era repetido y podia confundir al usuario.

## Archivo modificado

El cambio se hizo en:

```txt
src/layout/HomeLayout.astro
```

Ese archivo contiene el menu lateral compartido por las paginas principales.

## Como quedo

Antes:

```js
const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard", key: "dashboard" },
  { href: "/dashboard", icon: "storefront", label: "Mercado", key: "mercado" },
  { href: "/equipo", icon: "groups", label: "Equipo", key: "equipo" },
];
```

Ahora:

```js
const navItems = [
  { href: "/dashboard", icon: "storefront", label: "Mercado", key: "mercado" },
  { href: "/equipo", icon: "groups", label: "Equipo", key: "equipo" },
];
```

## Resultado esperado

El menu lateral queda mas claro:

- Mercado
- Equipo
- Admin, solo si el usuario es administrador
- Perfil

El usuario ya no ve dos opciones que hacen lo mismo.
