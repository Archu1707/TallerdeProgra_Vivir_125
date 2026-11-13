import { FRANJAS, WHATSAPP_NUMERO, type Taller } from "@/data/talleres";

export function mensajeWhatsApp(taller: Taller): string {
  const franja = FRANJAS.find((f) => f.id === taller.franja);
  const edades = franja ? franja.titulo : `${taller.franja} años`;
  return `¡Hola! Quería consultar por el taller «${taller.nombre}» (${edades}), los ${taller.dia.toLowerCase()} a las ${taller.hora}. ¿Todavía hay lugar?`;
}

export function enlaceWhatsApp(taller: Taller): string {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensajeWhatsApp(taller))}`;
}
