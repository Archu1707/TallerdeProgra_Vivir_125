import type { FranjaInfo, Taller } from "@/data/talleres";
import { contarEspera, type EsperaEntry, type ResultadoAnotar } from "@/lib/espera";

import { TarjetaTaller } from "./TarjetaTaller";

interface Props {
  franja: FranjaInfo;
  talleres: Taller[];
  /** null mientras se lee localStorage (primer render / SSR). */
  espera: EsperaEntry[] | null;
  onAnotar: (tallerId: string, correo: string) => ResultadoAnotar;
}

export function SeccionFranja({ franja, talleres, espera, onAnotar }: Props) {
  const idTitulo = `titulo-${franja.id}`;
  return (
    <section
      id={`franja-${franja.id}`}
      tabIndex={-1}
      aria-labelledby={idTitulo}
      className="scroll-mt-20 focus:outline-none"
    >
      <div
        className="bloque-titulo relative rounded-2xl px-5 py-5 sm:px-7"
        style={{ backgroundColor: franja.color, color: franja.tinta }}
      >
        <h2 id={idTitulo} className="text-2xl font-extrabold sm:text-3xl">
          {franja.titulo}
        </h2>
        <p className="mt-1 max-w-lg font-semibold">{franja.lema}</p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {talleres.map((taller) => (
          <TarjetaTaller
            key={taller.id}
            taller={taller}
            color={franja.color}
            enEspera={espera ? contarEspera(espera, taller.id) : 0}
            listo={espera !== null}
            onAnotar={onAnotar}
          />
        ))}
      </div>
    </section>
  );
}
