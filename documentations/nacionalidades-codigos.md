# Normalizacion de nacionalidades

## Objetivo

Permitir que un administrador escriba la nacionalidad como nombre completo y guardarla como codigo de 2 letras.

Ejemplos:

```txt
España -> ES
Argentina -> AR
Puerto Rico -> PR
Francia -> FR
gb -> GB
```

## Archivo principal

```txt
src/lib/countries.js
```

Se agrego una funcion compartida:

```js
normalizeCountryCode(value)
```

Esta funcion:

- Recibe un texto.
- Quita espacios extra.
- Acepta codigos de 2 letras.
- Convierte codigos a mayuscula.
- Intenta detectar nombres de pais en espanol e ingles.
- Usa alias manuales para casos comunes.

## Admin API

Archivo:

```txt
src/pages/api/admin/jugadores.js
```

Cuando se crea o edita un jugador, la nacionalidad pasa por:

```js
normalizeCountryCode(body.nacionalidad)
```

Asi se guarda en Supabase como codigo de 2 letras cuando el pais es reconocido.

## Vista admin

Archivo:

```txt
src/pages/admin/index.astro
```

La tabla admin muestra la nacionalidad normalizada y en mayuscula.

Los filtros tambien usan el codigo normalizado.

Esto ayuda con jugadores antiguos que ya estaban guardados como:

```txt
Puerto Rico
```

La vista los muestra como:

```txt
PR
```

## Mercado

Archivos:

```txt
src/components/Mercado.jsx
src/components/Filtros.jsx
src/components/Card.jsx
```

El mercado tambien normaliza nacionalidades para:

- Filtrar.
- Mostrar el codigo en mayuscula.
- Cargar la bandera correcta cuando sea posible.

## Nota

Si el texto no coincide con ningun pais conocido, se mantiene el texto en mayuscula.

Ejemplo:

```txt
Atlantis -> ATLANTIS
```

Esto evita borrar informacion escrita por el administrador.
