import type { Estado } from "@/data/talleres";

const ESTADOS: Record<Estado, { texto: string; color: string }> = {
  "con-lugar": { texto: "Con lugar", color: "#2FB47C" },
  ultimos: { texto: "Últimos lugares", color: "#F59A23" },
  completo: { texto: "Completo", color: "#E5487B" },
};

export function BadgeEstado({ estado }: { estado: Estado }) {
  const { texto, color } = ESTADOS[estado];
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 bg-white px-2.5 py-0.5 text-xs font-bold"
      style={{ borderColor: color }}
    >
      <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {texto}
    </span>
  );
}
