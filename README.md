# Proyecto Final — E-commerce con Astro, Cloudflare y Supabase

Este proyecto consiste en construir un e-commerce completo usando una arquitectura híbrida con Astro y Cloudflare.

## Tecnologías

- Astro
- Cloudflare Pages
- Cloudflare Workers
- Supabase
  - Base de datos
  - Auth
  - Storage

## Objetivo

Crear una tienda online con catálogo público dinámico y un portal administrativo para gestionar productos.

## Funcionalidades principales

### E-commerce público

- Listado de productos
- Página de detalle de producto
- Búsqueda y filtrado por nombre o categoría
- Paginación

### Portal administrativo

- Login y logout con Supabase Auth
- Crear productos
- Editar productos
- Eliminar productos
- Subir imágenes con Supabase Storage
- Rutas protegidas para usuarios autenticados

## Arquitectura híbrida

El proyecto usa dos enfoques:

### SSR — Contenido dinámico

Se usa para el catálogo público y el detalle de producto, ya que los datos se consultan desde Supabase en cada request.

### SSG — Contenido estático

Se usa para el portal administrativo, donde la lógica de autenticación y CRUD ocurre desde el cliente.

## Instalación

```bash
npm install
