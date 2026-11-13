# Taller de Progra · Catálogo de talleres por edades

Catálogo de talleres de programación para que las familias encuentren rápido la actividad de su hijo o hija, consulten por WhatsApp o se anoten en lista de espera cuando el taller está lleno.

- **Editor (Lovable):** https://lovable.dev/projects/f1a29f44-1de4-49f6-8174-12979b4f4099
- **Previsualización:** https://id-preview--f1a29f44-1de4-49f6-8174-12979b4f4099.lovable.app
- **Repositorio:** https://github.com/Archu1707/blank-canvas

## Qué hace

Una sola página, sin login, sin filtros y sin buscador.

- **Cabecera** con el nombre del espacio y tres botones: «5 a 7 años», «8 a 11 años» y «12 a 15 años». Cada uno hace scroll suave hasta su sección sin recargar (respeta «reducir movimiento» del sistema).
- **Tres secciones por edad**, cada una con su color fijo:
  | Franja | Color |
  | --- | --- |
  | 5 a 7 años | `#F59A23` |
  | 8 a 11 años | `#2FB47C` |
  | 12 a 15 años | `#4C5FD5` |
- **Tarjeta de taller:** nombre, herramienta, día y horario, duración en minutos, precio ($U por mes, una clase semanal), qué se llevan, lugares libres y badge de estado.
- **Estado según lugares libres:** 3 o más «Con lugar», 1 o 2 «Últimos lugares», 0 «Completo».
- **Con lugar / Últimos lugares:** botón «Consultar por WhatsApp» que abre un mensaje ya escrito con el nombre del taller.
- **Completo:** formulario «Anotarme en lista de espera» (correo + «Avisarme si se libera un lugar») y contador «X familias en espera».
- **Pie de página:** «Restaurar datos sintéticos» devuelve la lista de espera a su estado inicial.

## Datos

### Talleres (`src/data/talleres.ts`)

`Taller = { id, nombre, franja (5-7 | 8-11 | 12-15), herramienta, dia, hora, duracionMin, precioUYU, entregable, lugaresTotales, lugaresLibres }`

| Taller | Franja | Lugares libres | Estado |
| --- | --- | --- | --- |
| Primeros Bloques | 5-7 | 3 | Con lugar |
| Robots de Piso | 5-7 | 0 | Completo |
| Mi Primer Videojuego | 8-11 | 4 | Con lugar |
| Robótica micro:bit | 8-11 | 0 | Completo |
| Historias Animadas | 8-11 | 2 | Últimos lugares |
| Mi Primera Web | 12-15 | 5 | Con lugar |
| Python para Curiosos | 12-15 | 1 | Últimos lugares |
| Videojuegos en 2D | 12-15 | 3 | Con lugar |

Herramienta, día, hora, duración, precio, entregable y lugares totales son **valores de ejemplo**: ajustalos en ese archivo si el briefing trae otros.

El número de WhatsApp está en `WHATSAPP_NUMERO` (mismo archivo), en formato internacional sin `+` (por ejemplo `59899123456`). **Hay que reemplazarlo por el número real.**

### Lista de espera (`src/lib/espera.ts`)

`EsperaEntry = { taller, correo, fecha }`, guardada en `localStorage` con la clave `taller-progra:lista-espera:v1`.

- **Semilla:** se escribe solo si esa clave no existe (primera visita). Una lista vacía guardada (`[]`) se respeta y no se vuelve a sembrar. Los correos de prueba son `@example.com`.
- **Sin repetidos:** el correo se normaliza (espacios fuera + minúsculas) y no se puede repetir en el mismo taller. Sí puede anotarse en otro taller.
- **Guardar primero, mostrar éxito después:** el mensaje de «¡Listo!» y el contador nuevo aparecen solo si el guardado funcionó.
- **Si `localStorage` falla** (modo privado, bloqueado, lleno): se muestra un error, el correo escrito queda en el campo y no se cambia ningún dato.
- **Espera ≠ disponibilidad:** anotarse nunca cambia `lugaresLibres`.
- **Persistencia:** la lista sigue igual al recargar la página.

## Diseño

- Fondo claro `#FAFAF5`, texto `#24263A`, paleta `#4C5FD5`, `#F59A23`, `#2FB47C`, `#E5487B`.
- Tarjetas como **bloques encastrables** (pestaña arriba, base abajo, en el color de la franja), formas geométricas y código decorativo. Inspirado en la programación por bloques sin copiar ningún diseño existente.
- Tipografía Nunito. Tono curioso y simple, sin jerga técnica.
- Una columna en móvil (probado para 360 px de ancho), dos en tablet y tres en escritorio.

## Criterios de aceptación

| Criterio | Dónde se cumple |
| --- | --- |
| Los 8 talleres aparecen en su sección de edad correcta | `TALLERES` + `SeccionFranja`; test «tiene los 8 talleres en su franja» |
| Los 3 botones hacen scroll a su sección sin recargar | `Cabecera` (`scrollIntoView`, sin navegación) |
| Con lugar → botón WhatsApp con el nombre del taller | `TarjetaTaller` + `lib/whatsapp.ts`; test del enlace |
| 0 lugares → «Completo» y formulario en vez del botón | `TarjetaTaller` |
| Anotarse sube el contador en 1; rechaza repetidos (trim + minúsculas) | `anotarEnEspera`; tests |
| Anotar no altera `lugaresLibres` | `anotarEnEspera`; test |
| Guardar primero, éxito después; si falla, conserva lo escrito | `anotarEnEspera` + `FormularioEspera`; test |
| Persiste al recargar; usable a 360 px | `localStorage` + layout responsive |
| README y URL de previsualización | Este archivo |

## Stack

- **Lovable:** editor y previsualización. Los cambios hechos en Lovable se suben a este repo y los de `main` vuelven a Lovable.
- **GitHub:** este repositorio.
- **Supabase:** cliente listo en `src/integrations/supabase/client.ts` (proyecto `wtboeqyvoxoiwzuyzwuf`). Esta versión no lo usa: la lista de espera vive en `localStorage`, como pide el briefing.
- **Vercel:** publicación (ver abajo).
- TanStack Start + React 19 + TypeScript + Tailwind CSS v4 + Vite.

## Correr en local

```sh
git clone https://github.com/Archu1707/blank-canvas.git
cd blank-canvas
bun install   # o npm install
bun run dev   # o npm run dev
```

Tests:

```sh
bun run test  # o npm test
```

## Publicar en Vercel

1. En Vercel: **Add New → Project** e importar `Archu1707/blank-canvas`.
2. Build command `npm run build` (Vercel lo detecta). Variables opcionales: `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`.
3. Cada push a `main` genera un deploy nuevo.

## Estructura

```
src/
  data/talleres.ts                 # talleres, franjas, estado, número de WhatsApp
  lib/espera.ts                    # lista de espera (localStorage)
  lib/whatsapp.ts                  # mensaje y enlace de WhatsApp
  components/catalogo/
    Cabecera.tsx                   # nombre + botones ancla
    SeccionFranja.tsx              # sección por edad
    TarjetaTaller.tsx              # tarjeta de taller
    BadgeEstado.tsx                # Con lugar / Últimos lugares / Completo
    FormularioEspera.tsx           # anotarse en lista de espera
  routes/index.tsx                 # la página
  test/espera.test.ts              # tests de datos y lista de espera
```
