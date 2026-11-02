import type {
  EstadisticasInventario,
  FaltanteInventario,
  ProductoFaltante,
} from "@/types/inventario";

export function normalizarTexto(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-MX")
    .trim();
}

export function agruparFaltantes(
  filas: FaltanteInventario[],
): ProductoFaltante[] {
  const productos = new Map<string, ProductoFaltante>();
  const sucursalesPorProducto = new Map<string, Set<string>>();

  for (const fila of filas) {
    const marca = fila.marca.trim();
    const tono = fila.tono.trim();
    const id = `${normalizarTexto(marca)}::${normalizarTexto(tono)}`;

    let producto = productos.get(id);

    if (!producto) {
      producto = { id, marca, tono, sucursales: [] };
      productos.set(id, producto);
      sucursalesPorProducto.set(id, new Set<string>());
    }

    const claveSucursal = normalizarTexto(fila.sucursal);
    const sucursalesRegistradas = sucursalesPorProducto.get(id);

    if (sucursalesRegistradas?.has(claveSucursal)) continue;

    sucursalesRegistradas?.add(claveSucursal);
    producto.sucursales.push({
      sucursal: fila.sucursal,
      sucursalPrioridad: fila.sucursal_prioridad,
      stockActual: fila.stock_actual,
      stockMinimo: fila.stock_minimo,
    });
  }

  return Array.from(productos.values())
    .map((producto) => ({
      ...producto,
      sucursales: [...producto.sucursales].sort(
        (a, b) =>
          a.sucursalPrioridad - b.sucursalPrioridad ||
          a.sucursal.localeCompare(b.sucursal, "es-MX"),
      ),
    }))
    .sort(
      (a, b) =>
        a.marca.localeCompare(b.marca, "es-MX") ||
        a.tono.localeCompare(b.tono, "es-MX"),
    );
}

export function filtrarProductos(
  productos: ProductoFaltante[],
  busqueda: string,
): ProductoFaltante[] {
  const termino = normalizarTexto(busqueda);

  if (!termino) return productos;

  return productos.filter((producto) =>
    normalizarTexto(`${producto.marca} ${producto.tono}`).includes(termino),
  );
}

export function calcularEstadisticas(
  productos: ProductoFaltante[],
): EstadisticasInventario {
  const sucursales = new Set<string>();
  let totalSucursalesSinStock = 0;

  for (const producto of productos) {
    for (const sucursal of producto.sucursales) {
      sucursales.add(normalizarTexto(sucursal.sucursal));
      if (sucursal.stockActual === 0) totalSucursalesSinStock += 1;
    }
  }

  return {
    totalProductos: productos.length,
    totalSucursalesAfectadas: sucursales.size,
    totalSucursalesSinStock,
  };
}
