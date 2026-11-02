import { getSupabaseBrowserClient } from "@/lib/supabase";
import type { FaltanteInventario } from "@/types/inventario";

const COLUMNAS =
  "sucursal,sucursal_prioridad,marca,tono,stock_actual,stock_minimo" as const;

const PRIORIDADES: Record<string, number> = {
  lluvia: 1,
  "santa rosa": 2,
  "5 de mayo": 3,
};

function aNumero(valor: unknown, respaldo = 0): number {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : respaldo;
}

function aTexto(valor: unknown, respaldo: string): string {
  return typeof valor === "string" && valor.trim() ? valor.trim() : respaldo;
}

function calcularPrioridad(sucursal: string, valor: unknown): number {
  const prioridad = aNumero(valor, 0);
  if (prioridad > 0) return prioridad;

  return PRIORIDADES[sucursal.toLocaleLowerCase("es-MX")] ?? 99;
}

function normalizarFila(fila: Partial<FaltanteInventario>): FaltanteInventario {
  const sucursal = aTexto(fila.sucursal, "Sucursal sin nombre");

  return {
    sucursal,
    sucursal_prioridad: calcularPrioridad(sucursal, fila.sucursal_prioridad),
    marca: aTexto(fila.marca, "Sin marca"),
    tono: aTexto(fila.tono, "Sin tono"),
    stock_actual: aNumero(fila.stock_actual),
    stock_minimo: aNumero(fila.stock_minimo),
  };
}

export async function obtenerTintesBajoMinimo(
  signal?: AbortSignal,
): Promise<FaltanteInventario[]> {
  const supabase = getSupabaseBrowserClient();

  let consulta = supabase
    .from("vw_reporte_resurtido")
    .select(COLUMNAS)
    .order("sucursal_prioridad", { ascending: true })
    .order("marca", { ascending: true })
    .order("tono", { ascending: true });

  if (signal) {
    consulta = consulta.abortSignal(signal);
  }

  const { data, error } = await consulta;

  if (error) {
    throw new Error(
      error.code === "42501"
        ? "No tienes permiso para consultar el inventario."
        : `No fue posible consultar el inventario: ${error.message}`,
    );
  }

  return ((data ?? []) as unknown as Partial<FaltanteInventario>[])
    .map(normalizarFila)
    .filter((fila) => fila.stock_actual <= fila.stock_minimo);
}
