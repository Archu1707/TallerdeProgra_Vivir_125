export interface EsperaEntry {
  /** id del taller */
  taller: string;
  /** correo normalizado (trim + minúsculas) */
  correo: string;
  /** fecha ISO de alta */
  fecha: string;
}

export type StorageLike = Pick<Storage, "getItem" | "setItem">;

export const CLAVE_ESPERA = "taller-progra:lista-espera:v1";

export const ESPERA_SEMILLA: readonly EsperaEntry[] = [
  { taller: "robots-de-piso", correo: "familia.perez@example.com", fecha: "2026-10-02T14:10:00.000Z" },
  { taller: "robots-de-piso", correo: "lucia.gomez@example.com", fecha: "2026-10-05T19:32:00.000Z" },
  { taller: "robots-de-piso", correo: "martin.rodriguez@example.com", fecha: "2026-10-11T12:05:00.000Z" },
  { taller: "robotica-microbit", correo: "ana.silva@example.com", fecha: "2026-10-08T21:40:00.000Z" },
  { taller: "robotica-microbit", correo: "familia.fernandez@example.com", fecha: "2026-10-20T16:15:00.000Z" },
];

export type MotivoRechazo = "correo-invalido" | "repetido" | "sin-guardar";

export type ResultadoAnotar =
  | { ok: true; entradas: EsperaEntry[] }
  | { ok: false; motivo: MotivoRechazo };

export type ResultadoRestaurar = { ok: true; entradas: EsperaEntry[] } | { ok: false };

const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizarCorreo(correo: string): string {
  return correo.trim().toLowerCase();
}

export function correoValido(correo: string): boolean {
  return PATRON_CORREO.test(normalizarCorreo(correo));
}

function copiaSemilla(): EsperaEntry[] {
  return ESPERA_SEMILLA.map((e) => ({ ...e }));
}

function esEntrada(valor: unknown): valor is EsperaEntry {
  if (typeof valor !== "object" || valor === null) return false;
  const v = valor as Record<string, unknown>;
  return typeof v.taller === "string" && typeof v.correo === "string" && typeof v.fecha === "string";
}

/** localStorage si existe y deja escribir; si no, null (modo privado, SSR, bloqueado). */
export function obtenerStorage(): StorageLike | null {
  if (typeof window === "undefined") return null;
  try {
    const storage = window.localStorage;
    const prueba = "__taller-progra-prueba__";
    storage.setItem(prueba, prueba);
    storage.removeItem(prueba);
    return storage;
  } catch {
    return null;
  }
}

/**
 * Lee la lista de espera.
 * - La semilla se escribe solo si la clave propia NO existe (primera visita).
 * - Una lista vacía guardada ("[]") es válida y no se vuelve a sembrar.
 */
export function cargarEspera(storage: StorageLike | null): EsperaEntry[] {
  if (!storage) return copiaSemilla();

  let crudo: string | null;
  try {
    crudo = storage.getItem(CLAVE_ESPERA);
  } catch {
    return copiaSemilla();
  }

  if (crudo === null) {
    const semilla = copiaSemilla();
    try {
      storage.setItem(CLAVE_ESPERA, JSON.stringify(semilla));
    } catch {
      // No se pudo guardar: se muestra igual, sin romper la página.
    }
    return semilla;
  }

  try {
    const datos: unknown = JSON.parse(crudo);
    if (Array.isArray(datos)) return datos.filter(esEntrada);
  } catch {
    // Dato corrupto: no se pisa, se muestra vacío.
  }
  return [];
}

export function contarEspera(entradas: readonly EsperaEntry[], tallerId: string): number {
  return entradas.filter((e) => e.taller === tallerId).length;
}

/**
 * Anota un correo en la lista de un taller.
 * Guarda primero; solo si el guardado funciona devuelve ok con la lista nueva.
 * Si falla, no cambia nada (ni en memoria ni en el storage).
 * No toca los lugares libres del taller: estar en espera no es disponibilidad.
 */
export function anotarEnEspera(
  storage: StorageLike | null,
  entradas: readonly EsperaEntry[],
  tallerId: string,
  correo: string,
  ahora: Date = new Date(),
): ResultadoAnotar {
  const normalizado = normalizarCorreo(correo);
  if (!correoValido(normalizado)) return { ok: false, motivo: "correo-invalido" };

  const yaEsta = entradas.some(
    (e) => e.taller === tallerId && normalizarCorreo(e.correo) === normalizado,
  );
  if (yaEsta) return { ok: false, motivo: "repetido" };

  if (!storage) return { ok: false, motivo: "sin-guardar" };

  const nuevas: EsperaEntry[] = [
    ...entradas,
    { taller: tallerId, correo: normalizado, fecha: ahora.toISOString() },
  ];
  try {
    storage.setItem(CLAVE_ESPERA, JSON.stringify(nuevas));
  } catch {
    return { ok: false, motivo: "sin-guardar" };
  }
  return { ok: true, entradas: nuevas };
}

/** Devuelve la lista de espera a los datos sintéticos iniciales. */
export function restaurarEspera(storage: StorageLike | null): ResultadoRestaurar {
  if (!storage) return { ok: false };
  const semilla = copiaSemilla();
  try {
    storage.setItem(CLAVE_ESPERA, JSON.stringify(semilla));
  } catch {
    return { ok: false };
  }
  return { ok: true, entradas: semilla };
}
