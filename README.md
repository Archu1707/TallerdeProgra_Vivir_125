# Taller de Programación · Catálogo de talleres por edades

Catálogo de talleres de programación para que las familias encuentren rápido la actividad de su hijo o hija, consulten por WhatsApp o se anoten en lista de espera cuando el taller está lleno.

- **App publicada (Vercel):** https://tallerde-progra-vivir-125.vercel.app
- **Editor (Lovable):** https://lovable.dev/projects/f1a29f44-1de4-49f6-8174-12979b4f4099
- **Previsualización de Lovable:** https://id-preview--f1a29f44-1de4-49f6-8174-12979b4f4099.lovable.app
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

Herramienta, día, hora, duración, precio, entregable y lugares totales son **valores de ejemplo**: se ajustan en ese mismo archivo.

El número de WhatsApp está en `WHATSAPP_NUMERO` (mismo archivo), en formato internacional sin `+`.

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
- Tarjetas como **bloques encastrables** (pestaña arriba, base abajo, en el color de la franja), formas geométricas y una línea de código decorativo en la cabecera. Inspirado en la programación por bloques sin copiar ningún diseño existente.
- Favicon propio (`public/favicon.svg`): un bloque con `< >`.
- Tipografía Nunito. Tono curioso y simple, sin jerga técnica.
- Una columna en móvil, dos en tablet y tres en escritorio.

## Criterios de aceptación

Verificados en la app publicada en Vercel el 13/11/2026.

| Criterio | Cómo se comprobó | Resultado |
| --- | --- | --- |
| Los 8 talleres aparecen en su sección de edad correcta | Lectura de las 3 secciones: 2 + 3 + 3 talleres en su franja | ✅ |
| Los 3 botones hacen scroll a su sección sin recargar | Clic en cada botón: la sección queda arriba y la página no se recarga | ✅ |
| Con lugar → botón WhatsApp con el nombre del taller en el mensaje | Los 6 talleres con lugar tienen enlace `wa.me` con su nombre | ✅ |
| 0 lugares → «Completo» y formulario en vez del botón | Robots de Piso y Robótica micro:bit | ✅ |
| Anotarse sube el contador en 1 | 3 → 4 familias en espera | ✅ |
| Rechaza correo repetido en ese taller (trim + minúsculas) | `  PRUEBA.Criterios@Example.COM  ` rechazado | ✅ |
| Anotar no altera `lugaresLibres` | Sigue «0 lugares libres de 6» | ✅ |
| Guardar primero, éxito después; si `localStorage` falla, conserva lo escrito | Guardado forzado a fallar: error, correo conservado, datos intactos | ✅ |
| Lista vacía ≠ primera visita | Con `[]` guardado, los contadores quedan en 0 y no se resiembra | ✅ |
| Lista de espera persiste al recargar | Tras recargar sigue en 4 | ✅ |
| Usable en móvil de 360 px | Sin scroll horizontal ni elementos desbordados; botones de 36 px de alto | ✅ |
| README completo y URL de previsualización funcionando | Este archivo + https://tallerde-progra-vivir-125.vercel.app | ✅ |

También hay tests automáticos de datos y lista de espera en `src/test/espera.test.ts` (`bun run test`).

## Stack

- **Lovable:** editor y previsualización. Los cambios hechos en Lovable se suben a este repo y los de `main` vuelven a Lovable.
- **GitHub:** este repositorio.
- **Supabase:** cliente listo en `src/integrations/supabase/client.ts` (proyecto `wtboeqyvoxoiwzuyzwuf`). Esta versión no lo usa: la lista de espera vive en `localStorage`, como pide el briefing.
- **Vercel:** publicación en https://tallerde-progra-vivir-125.vercel.app. Cada push a `main` despliega solo (Vercel detecta TanStack Start sin configuración extra).
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

## Estructura

```
public/favicon.svg                 # icono de la pestaña
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
