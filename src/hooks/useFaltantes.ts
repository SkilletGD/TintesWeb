"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { obtenerTintesBajoMinimo } from "@/services/inventarioService";
import type { FaltanteInventario } from "@/types/inventario";
import {
  agruparFaltantes,
  calcularEstadisticas,
  filtrarProductos,
} from "@/utils/agruparInventario";

function obtenerMensajeError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Ocurrió un error inesperado al consultar el inventario.";
}

export function useFaltantes() {
  const [faltantes, setFaltantes] = useState<FaltanteInventario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [actualizadoEn, setActualizadoEn] = useState<Date | null>(null);
  const [version, setVersion] = useState(0);

  const busquedaDiferida = useDeferredValue(busqueda);

  useEffect(() => {
    const controller = new AbortController();
    let activo = true;

    async function cargar() {
      setCargando(true);
      setError(null);

      try {
        const datos = await obtenerTintesBajoMinimo(controller.signal);

        if (!activo) return;

        setFaltantes(datos);
        setActualizadoEn(new Date());
      } catch (err) {
        if (!activo || controller.signal.aborted) return;
        setError(obtenerMensajeError(err));
        setFaltantes([]);
      } finally {
        if (activo) setCargando(false);
      }
    }

    void cargar();

    return () => {
      activo = false;
      controller.abort();
    };
  }, [version]);

  const productos = useMemo(() => agruparFaltantes(faltantes), [faltantes]);
  const productosFiltrados = useMemo(
    () => filtrarProductos(productos, busquedaDiferida),
    [productos, busquedaDiferida],
  );
  const estadisticas = useMemo(
    () => calcularEstadisticas(productos),
    [productos],
  );

  const recargar = useCallback(() => {
    setVersion((actual) => actual + 1);
  }, []);

  return {
    productos,
    productosFiltrados,
    estadisticas,
    cargando,
    error,
    busqueda,
    setBusqueda,
    busquedaDiferida,
    actualizadoEn,
    recargar,
  };
}
