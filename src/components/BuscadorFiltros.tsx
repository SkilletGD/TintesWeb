"use client";

import { Clock3, RefreshCw, Search, X } from "lucide-react";
import { formatearFechaHora } from "@/utils/formato";

interface BuscadorFiltrosProps {
  busqueda: string;
  onBusquedaChange: (valor: string) => void;
  totalResultados: number;
  totalProductos: number;
  cargando: boolean;
  actualizadoEn: Date | null;
  onRecargar: () => void;
}

export function BuscadorFiltros({
  busqueda,
  onBusquedaChange,
  totalResultados,
  totalProductos,
  cargando,
  actualizadoEn,
  onRecargar,
}: BuscadorFiltrosProps) {
  const hayBusqueda = busqueda.trim().length > 0;

  return (
    <section
      aria-label="Buscar y actualizar inventario"
      className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-4"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xl">
          <label htmlFor="buscar-tinte" className="sr-only">
            Buscar por tono o marca
          </label>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            aria-hidden="true"
          />
          <input
            id="buscar-tinte"
            type="search"
            value={busqueda}
            onChange={(event) => onBusquedaChange(event.target.value)}
            placeholder="Buscar por tono o marca..."
            autoComplete="off"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-amber-500 dark:focus:bg-slate-950 [&::-webkit-search-cancel-button]:hidden"
          />
          {hayBusqueda && (
            <button
              type="button"
              onClick={() => onBusquedaChange("")}
              className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Limpiar búsqueda"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 lg:justify-end">
          <p
            aria-live="polite"
            className="text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            {hayBusqueda
              ? `${totalResultados} de ${totalProductos} tintes`
              : `${totalProductos} ${totalProductos === 1 ? "tinte" : "tintes"}`}
          </p>

          <button
            type="button"
            onClick={onRecargar}
            disabled={cargando}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <RefreshCw
              className={`size-4 ${cargando ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            Actualizar
          </button>

          {actualizadoEn && (
            <p className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
              <Clock3 className="size-3.5" aria-hidden="true" />
              <span>{formatearFechaHora(actualizadoEn)}</span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
