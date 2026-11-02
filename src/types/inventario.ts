export interface FaltanteInventario {
  sucursal: string;
  sucursal_prioridad: number;
  marca: string;
  tono: string;
  stock_actual: number;
  stock_minimo: number;
}

export interface SucursalFaltante {
  sucursal: string;
  sucursalPrioridad: number;
  stockActual: number;
  stockMinimo: number;
}

export interface ProductoFaltante {
  id: string;
  marca: string;
  tono: string;
  sucursales: SucursalFaltante[];
}

export interface EstadisticasInventario {
  totalProductos: number;
  totalSucursalesAfectadas: number;
  totalSucursalesSinStock: number;
}
