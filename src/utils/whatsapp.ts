import type { ProductoFaltante } from "@/types/inventario";
import { formatearFechaWhatsApp, formatearPiezas } from "@/utils/formato";

export function construirMensajeWhatsApp(
  productos: ProductoFaltante[],
  fecha = new Date(),
): string {
  const lineas: string[] = [
    "📦 *TINTES CON BAJO STOCK*",
    `Fecha: ${formatearFechaWhatsApp(fecha)}`,
    "",
  ];

  if (productos.length === 0) {
    lineas.push("No hay tintes por debajo del límite de inventario.");
    return lineas.join("\n");
  }

  for (const producto of productos) {
    lineas.push(`*${producto.marca} — ${producto.tono}*`);

    for (const sucursal of producto.sucursales) {
      lineas.push(
        `• ${sucursal.sucursal}: ${formatearPiezas(sucursal.stockActual)} (Mín: ${sucursal.stockMinimo})`,
      );
    }

    lineas.push("");
  }

  return lineas.join("\n").trim();
}

export function crearEnlaceWhatsApp(mensaje: string): string {
  return `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
}
