export function formatearFechaHora(fecha: Date): string {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(fecha);
}

export function formatearFechaWhatsApp(fecha: Date): string {
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();

  return `${dia}/${mes}/${anio}`;
}

export function formatearClaveArchivo(fecha: Date): string {
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();
  const horas = String(fecha.getHours()).padStart(2, "0");
  const minutos = String(fecha.getMinutes()).padStart(2, "0");

  return `${anio}-${mes}-${dia}_${horas}-${minutos}`;
}

export function formatearPiezas(cantidad: number): string {
  return `${cantidad} ${cantidad === 1 ? "pza" : "pzas"}`;
}
