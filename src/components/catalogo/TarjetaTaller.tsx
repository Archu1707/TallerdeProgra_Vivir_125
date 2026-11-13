import type { CSSProperties } from "react";
import { MessageCircle } from "lucide-react";

import { estadoDe, formatearPesos, type Taller } from "@/data/talleres";
import type { ResultadoAnotar } from "@/lib/espera";
import { enlaceWhatsApp } from "@/lib/whatsapp";

import { BadgeEstado } from "./BadgeEstado";
import { FormularioEspera } from "./FormularioEspera";

interface Props {
  taller: Taller;
  color: string;
  enEspera: number;
  listo: boolean;
  onAnotar: (tallerId: string, correo: string) => ResultadoAnotar;
}

export function TarjetaTaller({ taller, color, enEspera, listo, onAnotar }: Props) {
  const estado = estadoDe(taller.lugaresLibres);
  const libres =
    taller.lugaresLibres === 1 ? "1 lugar libre" : `${taller.lugaresLibres} lugares libres`;
  const idTitulo = `taller-${taller.id}`;

  return (
    <article
      aria-labelledby={idTitulo}
      className="bloque flex flex-col p-5 pt-6"
      style={{ "--bloque": color } as CSSProperties}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 id={idTitulo} className="text-xl font-extrabold leading-tight">
          {taller.nombre}
        </h3>
        <BadgeEstado estado={estado} />
      </div>

      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm">
        <dt className="font-semibold text-[#24263A]/65">Herramienta</dt>
        <dd>{taller.herramienta}</dd>

        <dt className="font-semibold text-[#24263A]/65">Cuándo</dt>
        <dd>
          {taller.dia} · {taller.hora} hs
        </dd>

        <dt className="font-semibold text-[#24263A]/65">Duración</dt>
        <dd>{taller.duracionMin} minutos</dd>

        <dt className="font-semibold text-[#24263A]/65">Precio</dt>
        <dd>
          <span className="font-bold">$U {formatearPesos(taller.precioUYU)} por mes</span>
          <span className="block text-xs text-[#24263A]/70">una clase semanal</span>
        </dd>

        <dt className="font-semibold text-[#24263A]/65">Se llevan</dt>
        <dd>{taller.entregable}</dd>

        <dt className="font-semibold text-[#24263A]/65">Lugares</dt>
        <dd>
          {libres} de {taller.lugaresTotales}
        </dd>
      </dl>

      <div className="mt-auto pt-5">
        {estado === "completo" ? (
          <FormularioEspera
            tallerId={taller.id}
            enEspera={enEspera}
            listo={listo}
            onAnotar={onAnotar}
          />
        ) : (
          <a
            href={enlaceWhatsApp(taller)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#24263A] px-4 py-2.5 text-sm font-bold text-white shadow-[0_3px_0_0_#2FB47C] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4C5FD5]"
          >
            <MessageCircle aria-hidden="true" className="h-4 w-4 text-[#2FB47C]" />
            Consultar por WhatsApp
          </a>
        )}
      </div>
    </article>
  );
}
