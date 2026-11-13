export type Franja = "5-7" | "8-11" | "12-15";

export interface Taller {
  id: string;
  nombre: string;
  franja: Franja;
  herramienta: string;
  dia: string;
  hora: string;
  duracionMin: number;
  precioUYU: number;
  entregable: string;
  lugaresTotales: number;
  lugaresLibres: number;
}

export interface FranjaInfo {
  id: Franja;
  titulo: string;
  /** Color fijo de la franja (fondo de su título y borde de sus tarjetas). */
  color: string;
  /** Color del texto que va sobre `color`, elegido por contraste. */
  tinta: string;
  lema: string;
}

export type Estado = "con-lugar" | "ultimos" | "completo";

export const NOMBRE_ESPACIO = "Taller de Programación";

// Número de WhatsApp del espacio en formato internacional, sin "+" ni espacios.
// TEMPORAL: número personal solo para pruebas. Quitar antes de la entrega.
export const WHATSAPP_NUMERO = "34675410429";

export const FRANJAS: FranjaInfo[] = [
  {
    id: "5-7",
    titulo: "5 a 7 años",
    color: "#F59A23",
    tinta: "#24263A",
    lema: "Primeros pasos: bloques de colores, robots y mucha imaginación.",
  },
  {
    id: "8-11",
    titulo: "8 a 11 años",
    color: "#2FB47C",
    tinta: "#24263A",
    lema: "Crear juegos, animaciones y robots que responden.",
  },
  {
    id: "12-15",
    titulo: "12 a 15 años",
    color: "#4C5FD5",
    tinta: "#FFFFFF",
    lema: "Escribir código de verdad y mostrar lo que hacen.",
  },
];

// Datos sintéticos. Lugares libres según el briefing; el resto son valores de ejemplo.
export const TALLERES: Taller[] = [
  {
    id: "primeros-bloques",
    nombre: "Primeros Bloques",
    franja: "5-7",
    herramienta: "ScratchJr en tablet",
    dia: "Sábado",
    hora: "10:00",
    duracionMin: 60,
    precioUYU: 1900,
    entregable: "Un cuento animado creado por ellos",
    lugaresTotales: 8,
    lugaresLibres: 3,
  },
  {
    id: "robots-de-piso",
    nombre: "Robots de Piso",
    franja: "5-7",
    herramienta: "Bee-Bot",
    dia: "Miércoles",
    hora: "17:30",
    duracionMin: 60,
    precioUYU: 2100,
    entregable: "Un mapa con el recorrido que programó su robot",
    lugaresTotales: 6,
    lugaresLibres: 0,
  },
  {
    id: "mi-primer-videojuego",
    nombre: "Mi Primer Videojuego",
    franja: "8-11",
    herramienta: "Scratch",
    dia: "Martes",
    hora: "18:00",
    duracionMin: 90,
    precioUYU: 2400,
    entregable: "Su propio videojuego para jugar en casa",
    lugaresTotales: 10,
    lugaresLibres: 4,
  },
  {
    id: "robotica-microbit",
    nombre: "Robótica micro:bit",
    franja: "8-11",
    herramienta: "micro:bit",
    dia: "Jueves",
    hora: "18:00",
    duracionMin: 90,
    precioUYU: 2700,
    entregable: "Un invento con luces y sensores",
    lugaresTotales: 8,
    lugaresLibres: 0,
  },
  {
    id: "historias-animadas",
    nombre: "Historias Animadas",
    franja: "8-11",
    herramienta: "Scratch",
    dia: "Sábado",
    hora: "11:30",
    duracionMin: 90,
    precioUYU: 2400,
    entregable: "Un corto animado con su propia historia",
    lugaresTotales: 10,
    lugaresLibres: 2,
  },
  {
    id: "mi-primera-web",
    nombre: "Mi Primera Web",
    franja: "12-15",
    herramienta: "HTML y CSS",
    dia: "Lunes",
    hora: "18:30",
    duracionMin: 90,
    precioUYU: 2600,
    entregable: "Su página web publicada en internet",
    lugaresTotales: 12,
    lugaresLibres: 5,
  },
  {
    id: "python-para-curiosos",
    nombre: "Python para Curiosos",
    franja: "12-15",
    herramienta: "Python",
    dia: "Miércoles",
    hora: "19:00",
    duracionMin: 90,
    precioUYU: 2800,
    entregable: "Un juego de preguntas hecho por ellos",
    lugaresTotales: 10,
    lugaresLibres: 1,
  },
  {
    id: "videojuegos-2d",
    nombre: "Videojuegos en 2D",
    franja: "12-15",
    herramienta: "Godot",
    dia: "Viernes",
    hora: "18:00",
    duracionMin: 120,
    precioUYU: 3100,
    entregable: "Un videojuego 2D con niveles diseñados por ellos",
    lugaresTotales: 10,
    lugaresLibres: 3,
  },
];

/** ≥3 «Con lugar», 1–2 «Últimos lugares», 0 «Completo». */
export function estadoDe(lugaresLibres: number): Estado {
  if (lugaresLibres <= 0) return "completo";
  if (lugaresLibres <= 2) return "ultimos";
  return "con-lugar";
}

/** 2400 → "2.400" (sin depender del locale del servidor). */
export function formatearPesos(valor: number): string {
  return Math.round(valor)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
