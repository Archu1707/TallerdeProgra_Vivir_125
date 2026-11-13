import { describe, expect, it } from "vitest";

import { FRANJAS, TALLERES, estadoDe } from "@/data/talleres";
import {
  CLAVE_ESPERA,
  ESPERA_SEMILLA,
  anotarEnEspera,
  cargarEspera,
  contarEspera,
  restaurarEspera,
  type StorageLike,
} from "@/lib/espera";
import { enlaceWhatsApp } from "@/lib/whatsapp";

class StorageDePrueba implements StorageLike {
  datos = new Map<string, string>();
  falla = false;

  getItem(clave: string): string | null {
    return this.datos.get(clave) ?? null;
  }

  setItem(clave: string, valor: string): void {
    if (this.falla) throw new Error("QuotaExceededError");
    this.datos.set(clave, valor);
  }
}

describe("catálogo", () => {
  it("tiene los 8 talleres en su franja y con sus lugares libres", () => {
    expect(TALLERES).toHaveLength(8);
    const resumen = Object.fromEntries(TALLERES.map((t) => [t.nombre, [t.franja, t.lugaresLibres]]));
    expect(resumen).toEqual({
      "Primeros Bloques": ["5-7", 3],
      "Robots de Piso": ["5-7", 0],
      "Mi Primer Videojuego": ["8-11", 4],
      "Robótica micro:bit": ["8-11", 0],
      "Historias Animadas": ["8-11", 2],
      "Mi Primera Web": ["12-15", 5],
      "Python para Curiosos": ["12-15", 1],
      "Videojuegos en 2D": ["12-15", 3],
    });
    for (const taller of TALLERES) {
      expect(FRANJAS.some((f) => f.id === taller.franja)).toBe(true);
    }
  });

  it("calcula el estado según lugares libres", () => {
    expect(estadoDe(0)).toBe("completo");
    expect(estadoDe(1)).toBe("ultimos");
    expect(estadoDe(2)).toBe("ultimos");
    expect(estadoDe(3)).toBe("con-lugar");
    expect(estadoDe(5)).toBe("con-lugar");
  });

  it("arma el enlace de WhatsApp con el nombre del taller", () => {
    for (const taller of TALLERES.filter((t) => t.lugaresLibres > 0)) {
      const url = enlaceWhatsApp(taller);
      expect(url.startsWith("https://wa.me/")).toBe(true);
      const texto = decodeURIComponent(url.split("?text=")[1] ?? "");
      expect(texto).toContain(taller.nombre);
    }
  });
});

describe("lista de espera", () => {
  it("siembra solo en la primera visita", () => {
    const storage = new StorageDePrueba();
    const entradas = cargarEspera(storage);
    expect(entradas).toEqual(ESPERA_SEMILLA);
    expect(storage.getItem(CLAVE_ESPERA)).not.toBeNull();
    expect(entradas.every((e) => e.correo.endsWith("@example.com"))).toBe(true);
  });

  it("una lista vacía guardada no se vuelve a sembrar", () => {
    const storage = new StorageDePrueba();
    storage.setItem(CLAVE_ESPERA, "[]");
    expect(cargarEspera(storage)).toEqual([]);
    expect(storage.getItem(CLAVE_ESPERA)).toBe("[]");
  });

  it("anotarse suma 1 y queda guardado (persiste al recargar)", () => {
    const storage = new StorageDePrueba();
    const antes = cargarEspera(storage);
    const r = anotarEnEspera(storage, antes, "robots-de-piso", "nueva@example.com");
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(contarEspera(r.entradas, "robots-de-piso")).toBe(contarEspera(antes, "robots-de-piso") + 1);
    expect(contarEspera(cargarEspera(storage), "robots-de-piso")).toBe(
      contarEspera(antes, "robots-de-piso") + 1,
    );
  });

  it("rechaza el mismo correo en el mismo taller (trim + minúsculas)", () => {
    const storage = new StorageDePrueba();
    const antes = cargarEspera(storage);
    const r = anotarEnEspera(storage, antes, "robotica-microbit", "  Ana.Silva@EXAMPLE.com ");
    expect(r).toEqual({ ok: false, motivo: "repetido" });
  });

  it("permite el mismo correo en otro taller", () => {
    const storage = new StorageDePrueba();
    const antes = cargarEspera(storage);
    const r = anotarEnEspera(storage, antes, "robots-de-piso", "ana.silva@example.com");
    expect(r.ok).toBe(true);
  });

  it("rechaza correos inválidos", () => {
    const storage = new StorageDePrueba();
    const r = anotarEnEspera(storage, cargarEspera(storage), "robots-de-piso", "sin-arroba");
    expect(r).toEqual({ ok: false, motivo: "correo-invalido" });
  });

  it("anotarse no cambia los lugares libres", () => {
    const storage = new StorageDePrueba();
    const lugaresAntes = TALLERES.map((t) => t.lugaresLibres);
    anotarEnEspera(storage, cargarEspera(storage), "robots-de-piso", "otra@example.com");
    expect(TALLERES.map((t) => t.lugaresLibres)).toEqual(lugaresAntes);
  });

  it("si guardar falla, no cambia nada", () => {
    const storage = new StorageDePrueba();
    const antes = cargarEspera(storage);
    const guardado = storage.getItem(CLAVE_ESPERA);
    storage.falla = true;
    const r = anotarEnEspera(storage, antes, "robots-de-piso", "falla@example.com");
    expect(r).toEqual({ ok: false, motivo: "sin-guardar" });
    expect(storage.getItem(CLAVE_ESPERA)).toBe(guardado);
    expect(antes).toEqual(ESPERA_SEMILLA);
  });

  it("restaurar vuelve a la semilla", () => {
    const storage = new StorageDePrueba();
    storage.setItem(CLAVE_ESPERA, "[]");
    const r = restaurarEspera(storage);
    expect(r.ok).toBe(true);
    expect(cargarEspera(storage)).toEqual(ESPERA_SEMILLA);
  });
});
