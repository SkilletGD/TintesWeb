"use client";

import { AlertTriangle, CircleAlert, MapPin, Palette } from "lucide-react";
import { BuscadorFiltros } from "@/components/BuscadorFiltros";
import { PdfExportButton } from "@/components/PdfExportButton";
import { TablaFaltantes } from "@/components/TablaFaltantes";
import { WhatsAppShareButton } from "@/components/WhatsAppShareButton";
import { useFaltantes } from "@/hooks/useFaltantes";

function TarjetaEstadistica({
  etiqueta,
  valor,
  detalle,
  icono,
  acento,
}: {
  etiqueta: string;
  valor: number | string;
  detalle: string;
  icono: React.ReactNode;
  acento: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {etiqueta}
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {valor}
          </p>
        </div>
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${acento}`}
        >
          {icono}
        </span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        {detalle}
      </p>
    </div>
  );
}

export function DashboardInventario() {
  const {
    productosFiltrados,
    estadisticas,
    cargando,
    error,
    busqueda,
    setBusqueda,
    actualizadoEn,
    recargar,
  } = useFaltantes();

  const hayBusqueda = busqueda.trim().length > 0;
  const sinDatos = cargando || Boolean(error) || productosFiltrados.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-400">
            Panel de inventario
          </p>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Tintes bajo el límite mínimo
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Consulta los tonos que requieren atención en Lluvia, Santa Rosa y 5
            de Mayo. La lista muestra únicamente existencias y límites por
            sucursal.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <PdfExportButton
            productos={productosFiltrados}
            deshabilitado={sinDatos}
          />
          <WhatsAppShareButton
            productos={productosFiltrados}
            deshabilitado={sinDatos}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <TarjetaEstadistica
          etiqueta="Tintes bajo el límite"
          valor={cargando ? "—" : estadisticas.totalProductos}
          detalle="Productos con al menos una sucursal por debajo del mínimo."
          icono={<Palette className="size-5" aria-hidden="true" />}
          acento="bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
        />
        <TarjetaEstadistica
          etiqueta="Sucursales afectadas"
          valor={cargando ? "—" : estadisticas.totalSucursalesAfectadas}
          detalle="Sucursales que presentan al menos un tinte bajo el límite."
          icono={<MapPin className="size-5" aria-hidden="true" />}
          acento="bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400"
        />
        <TarjetaEstadistica
          etiqueta="Casos sin existencia"
          valor={cargando ? "—" : estadisticas.totalSucursalesSinStock}
          detalle="Combinaciones de sucursal y tinte con stock en cero."
          icono={<CircleAlert className="size-5" aria-hidden="true" />}
          acento="bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
        />
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm dark:border-red-500/30 dark:bg-red-500/10"
        >
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400">
            <AlertTriangle className="size-6" aria-hidden="true" />
          </div>
          <h2 className="mt-3 text-base font-semibold text-red-900 dark:text-red-300">
            No se pudo cargar el inventario
          </h2>
          <p className="mx-auto mt-1.5 max-w-lg text-sm leading-relaxed text-red-700 dark:text-red-400">
            {error}
          </p>
          <button
            type="button"
            onClick={recargar}
            className="mt-5 inline-flex h-9 items-center rounded-lg bg-red-700 px-4 text-sm font-semibold text-white transition hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-500"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <>
          <BuscadorFiltros
            busqueda={busqueda}
            onBusquedaChange={setBusqueda}
            totalResultados={productosFiltrados.length}
            totalProductos={estadisticas.totalProductos}
            cargando={cargando}
            actualizadoEn={actualizadoEn}
            onRecargar={recargar}
          />

          <TablaFaltantes
            productos={productosFiltrados}
            cargando={cargando}
            hayBusqueda={hayBusqueda}
            busqueda={busqueda}
            onLimpiarBusqueda={() => setBusqueda("")}
          />
        </>
      )}
    </div>
  );
}
