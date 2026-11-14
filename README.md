# App de administración de talleres por edades

Catálogo de talleres de programación para que las familias encuentren rápido la actividad de su hijo o hija, consulten por WhatsApp o se anoten en lista de espera cuando el taller está lleno. La página se presenta al público como **Taller de Programación**.

- **App publicada (Vercel):** https://tallerde-progra-vivir-125.vercel.app
- **Editor (Lovable):** https://lovable.dev/projects/f1a29f44-1de4-49f6-8174-12979b4f4099
- **Previsualización de Lovable:** https://id-preview--f1a29f44-1de4-49f6-8174-12979b4f4099.lovable.app
- **Repositorio:** https://github.com/Archu1707/TallerdeProgra_Vivir_125

> **Todo funciona en el navegador.** No hay backend, base de datos ni servicios de terceros: los talleres están escritos en el código y la lista de espera se guarda en el `localStorage` del navegador de quien la usa.

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

## Qué está simulado

Esta entrega es un catálogo de prueba. Estas partes no son reales:

| Parte | Cómo está simulada | Dónde se cambia |
| --- | --- | --- |
| **Talleres** | Los 8 talleres están escritos en el código. Los nombres, franjas y lugares libres salen del briefing; herramienta, día, hora, duración, precio, entregable y lugares totales son **valores de ejemplo**. Los lugares libres no cambian solos. | `src/data/talleres.ts` |
| **Lista de espera** | Se guarda solo en el `localStorage` de cada navegador. No viaja a ningún servidor: otra persona u otro dispositivo no ven las mismas anotaciones. | `src/lib/espera.ts` |
| **Familias en espera de ejemplo** | La primera visita carga 5 anotaciones sintéticas (3 en Robots de Piso y 2 en Robótica micro:bit) con correos `@example.com`, que no existen. | `ESPERA_SEMILLA` en `src/lib/espera.ts` |
| **«Avisarme si se libera un lugar»** | Solo guarda el correo en la lista. No se envía ningún correo ni aviso. | — |
| **WhatsApp** | El botón abre un enlace `wa.me` con el mensaje ya escrito, pero el número (`59899000000`) es **ficticio**. No hay integración con la API de WhatsApp: el mensaje lo envía la familia desde su propia app. | `WHATSAPP_NUMERO` en `src/data/talleres.ts` |

## Cómo reiniciar los datos de prueba

La lista de espera arranca en su estado inicial (3 familias en Robots de Piso y 2 en Robótica micro:bit). Para volver a ese estado:

1. **Desde la app:** bajar al pie de página y pulsar **«Restaurar datos sintéticos»**. Se borran las anotaciones nuevas, vuelven las de ejemplo y aparece el aviso «Listo: la lista de espera volvió a sus datos de ejemplo.» No hace falta recargar.
2. **Desde el navegador:** abrir las herramientas de desarrollo (F12) → **Application** (Aplicación) → **Local Storage** → la URL de la app, borrar la clave `taller-progra:lista-espera:v1` y recargar. Al no encontrar la clave, la app vuelve a cargar los datos de ejemplo como en una primera visita.

Si la clave existe pero tiene una lista vacía (`[]`), la app la respeta y **no** vuelve a cargar los ejemplos: una lista vacía no es una primera visita.

Los talleres y sus lugares libres no se reinician porque no cambian: están fijos en `src/data/talleres.ts`.

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

### Lista de espera (`src/lib/espera.ts`)

`EsperaEntry = { taller, correo, fecha }`, guardada en `localStorage` con la clave `taller-progra:lista-espera:v1`.

- **Semilla:** se escribe solo si esa clave no existe (primera visita). Una lista vacía guardada (`[]`) se respeta y no se vuelve a sembrar.
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

Verificados en la app publicada en Vercel.

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

- **TanStack Start + React 19 + TypeScript + Tailwind CSS v4 + Vite.** Sin backend, sin base de datos y sin servicios de terceros en la app.
- **Lovable:** proyecto «App de administración de talleres por edades», editor y previsualización. Los cambios hechos en Lovable se suben a este repo y los de `main` vuelven a Lovable.
- **GitHub:** este repositorio.
- **Vercel:** publicación en https://tallerde-progra-vivir-125.vercel.app. Cada push a `main` despliega solo (Vercel detecta TanStack Start sin configuración extra).

## Correr en local

```sh
git clone https://github.com/Archu1707/TallerdeProgra_Vivir_125.git
cd TallerdeProgra_Vivir_125
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
  data/talleres.ts                 # talleres, franjas, estado, número de WhatsApp (ficticio)
  lib/espera.ts                    # lista de espera (localStorage) y datos de ejemplo
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
