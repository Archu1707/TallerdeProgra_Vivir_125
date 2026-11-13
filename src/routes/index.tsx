import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import { Cabecera } from "@/components/catalogo/Cabecera";
import { SeccionFranja } from "@/components/catalogo/SeccionFranja";
import { FRANJAS, NOMBRE_ESPACIO, TALLERES } from "@/data/talleres";
import {
  anotarEnEspera,
  cargarEspera,
  obtenerStorage,
  restaurarEspera,
  type EsperaEntry,
  type ResultadoAnotar,
} from "@/lib/espera";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${NOMBRE_ESPACIO} · Talleres de programación por edades` },
      {
        name: "description",
        content:
          "Talleres de programación para chicas y chicos de 5 a 15 años. Consultá por WhatsApp o anotate en la lista de espera.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  // null = todavía no se leyó localStorage (el servidor no lo tiene).
  const [espera, setEspera] = useState<EsperaEntry[] | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    setEspera(cargarEspera(obtenerStorage()));
  }, []);

  const anotar = useCallback(
    (tallerId: string, correo: string): ResultadoAnotar => {
      const resultado = anotarEnEspera(obtenerStorage(), espera ?? [], tallerId, correo);
      // Solo se actualiza la pantalla si ya quedó guardado.
      if (resultado.ok) setEspera(resultado.entradas);
      return resultado;
    },
    [espera],
  );

  function restaurar() {
    const resultado = restaurarEspera(obtenerStorage());
    if (resultado.ok) {
      setEspera(resultado.entradas);
      setVersion((v) => v + 1); // limpia formularios y mensajes
      setAviso("Listo: la lista de espera volvió a sus datos de ejemplo.");
    } else {
      setAviso("No pudimos restaurar los datos en este navegador.");
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF5] text-[#24263A]">
      <Cabecera />

      <main key={version} className="mx-auto max-w-5xl space-y-14 px-4 py-10">
        {FRANJAS.map((franja) => (
          <SeccionFranja
            key={franja.id}
            franja={franja}
            talleres={TALLERES.filter((t) => t.franja === franja.id)}
            espera={espera}
            onAnotar={anotar}
          />
        ))}
      </main>

      <footer className="mx-auto max-w-5xl border-t border-[#24263A]/10 px-4 pb-12 pt-6 text-sm">
        <p className="text-[#24263A]/70">
          La lista de espera se guarda solo en este navegador. Los datos son de ejemplo.
        </p>
        <button
          type="button"
          onClick={restaurar}
          className="mt-2 font-semibold text-[#4C5FD5] underline underline-offset-4 hover:text-[#24263A]"
        >
          Restaurar datos sintéticos
        </button>
        {aviso && (
          <p role="status" className="mt-2 font-semibold">
            {aviso}
          </p>
        )}
      </footer>
    </div>
  );
}
