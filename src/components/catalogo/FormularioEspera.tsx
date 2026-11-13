import { useId, useState, type FormEvent } from "react";

import type { MotivoRechazo, ResultadoAnotar } from "@/lib/espera";

const MENSAJES: Record<MotivoRechazo, string> = {
  "correo-invalido": "Revisá el correo: parece que le falta algo (por ejemplo, la @).",
  repetido: "Ese correo ya está en la lista de espera de este taller.",
  "sin-guardar": "No pudimos guardar tu lugar en la lista. Probá de nuevo: tu correo sigue escrito.",
};

interface Props {
  tallerId: string;
  enEspera: number;
  listo: boolean;
  onAnotar: (tallerId: string, correo: string) => ResultadoAnotar;
}

export function FormularioEspera({ tallerId, enEspera, listo, onAnotar }: Props) {
  const id = useId();
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!listo) return;
    // onAnotar guarda primero; solo devuelve ok si el guardado funcionó.
    const resultado = onAnotar(tallerId, correo);
    if (resultado.ok) {
      setCorreo("");
      setMensaje({ tipo: "ok", texto: "¡Listo! Quedaste en la lista. Te escribimos si se libera un lugar." });
    } else {
      // Se conserva lo escrito para que puedan corregir o reintentar.
      setMensaje({ tipo: "error", texto: MENSAJES[resultado.motivo] });
    }
  }

  const contador = enEspera === 1 ? "1 familia en espera" : `${enEspera} familias en espera`;
  const idMensaje = `${id}-mensaje`;

  return (
    <form onSubmit={enviar} noValidate className="rounded-xl bg-[#FAFAF5] p-4">
      <p className="text-sm font-extrabold">Anotarme en lista de espera</p>
      <p className="mt-0.5 text-xs font-semibold text-[#24263A]/70" aria-live="polite">
        {listo ? contador : "Cargando lista…"}
      </p>

      <label htmlFor={id} className="mt-3 block text-xs font-semibold">
        Correo
      </label>
      <input
        id={id}
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="tu@correo.com"
        value={correo}
        onChange={(e) => {
          setCorreo(e.target.value);
          if (mensaje) setMensaje(null);
        }}
        aria-invalid={mensaje?.tipo === "error" ? true : undefined}
        aria-describedby={mensaje ? idMensaje : undefined}
        className="mt-1 w-full rounded-lg border-2 border-[#24263A]/20 bg-white px-3 py-2 text-base focus:border-[#4C5FD5] focus:outline-none"
      />

      <button
        type="submit"
        disabled={!listo}
        className="mt-3 w-full rounded-lg bg-[#24263A] px-4 py-2.5 text-sm font-bold text-white shadow-[0_3px_0_0_#E5487B] transition-transform hover:-translate-y-0.5 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4C5FD5]"
      >
        Avisarme si se libera un lugar
      </button>

      {mensaje && (
        <p
          id={idMensaje}
          role={mensaje.tipo === "error" ? "alert" : "status"}
          className={`mt-3 text-sm font-semibold ${mensaje.tipo === "error" ? "text-[#B3204F]" : "text-[#1E7A54]"}`}
        >
          {mensaje.texto}
        </p>
      )}
    </form>
  );
}
