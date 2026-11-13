import type { MouseEvent } from "react";

import { FRANJAS, NOMBRE_ESPACIO } from "@/data/talleres";

function irASeccion(evento: MouseEvent<HTMLAnchorElement>, id: string) {
  const destino = document.getElementById(id);
  if (!destino) return;
  evento.preventDefault();
  const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  destino.scrollIntoView({ behavior: reducirMovimiento ? "auto" : "smooth", block: "start" });
  window.history.replaceState(null, "", `#${id}`);
  destino.focus({ preventScroll: true });
}

function FormasDecorativas() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 200"
      className="pointer-events-none absolute -right-8 top-2 h-36 w-36 opacity-40 sm:right-6 sm:top-6 sm:h-52 sm:w-52 sm:opacity-90"
    >
      <circle cx="150" cy="48" r="32" fill="#E5487B" />
      <rect x="36" y="28" width="58" height="58" rx="12" fill="#F59A23" transform="rotate(12 65 57)" />
      <polygon points="60,176 102,104 144,176" fill="#2FB47C" />
      <rect x="118" y="124" width="64" height="24" rx="8" fill="#4C5FD5" />
    </svg>
  );
}

export function Cabecera() {
  return (
    <>
      <header className="relative overflow-hidden px-4 pb-8 pt-10 sm:pt-14">
        <FormasDecorativas />
        <div className="relative mx-auto max-w-5xl">
          <p aria-hidden="true" className="font-mono text-sm font-semibold text-[#4C5FD5]">
            {"repetir siempre { aprender() }"}
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">{NOMBRE_ESPACIO}</h1>
          <p className="mt-3 max-w-xl text-lg">
            Talleres de programación para chicas y chicos de 5 a 15 años. Elegí la edad y encontrá
            su taller.
          </p>
        </div>
      </header>

      <nav
        aria-label="Edades"
        className="sticky top-0 z-20 border-b border-[#24263A]/10 bg-[#FAFAF5]/95 backdrop-blur"
      >
        <ul className="mx-auto flex max-w-5xl flex-wrap gap-2 px-4 py-3">
          {FRANJAS.map((franja) => {
            const id = `franja-${franja.id}`;
            return (
              <li key={franja.id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => irASeccion(e, id)}
                  className="inline-block rounded-lg px-3 py-2 text-sm font-bold shadow-[0_3px_0_0_rgba(36,38,58,0.25)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24263A]"
                  style={{ backgroundColor: franja.color, color: franja.tinta }}
                >
                  {franja.titulo}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
