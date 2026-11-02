"use client";

import { Fragment } from "react";
import {
  CheckCircle2,
  CircleAlert,
  MapPin,
  PackageOpen,
  Palette,
  SearchX,
} from "lucide-react";
import type { ProductoFaltante } from "@/types/inventario";
import { formatearPiezas } from "@/utils/formato";

interface TablaFaltantesProps {
  productos: ProductoFaltante[];
  cargando: boolean;
  hayBusqueda: boolean;
  busqueda: string;
  onLimpiarBusqueda: () => void;
}

function EstadoStock({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-200 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/25">
        <CircleAlert className="size-3.5" aria-hidden="true" />
        Sin stock
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/25">
      <CircleAlert className="size-3.5" aria-hidden="true" />
      Bajo mínimo
    </span>
  );
}

function StockBadge({ stock }: { stock: number }) {
  return (
    <span
      className={`inline-flex min-w-9 items-center justify-center rounded-lg px-2 py-1 text-sm font-bold tabular-nums ${
        stock === 0
          ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/25"
          : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/25"
      }`}
    >
      {stock}
    </span>
  );
}

function EncabezadoProducto({ producto }: { producto: ProductoFaltante }) {
  const cantidad = producto.sucursales.length;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
          <Palette className="size-4" aria-hidden="true" />
        </span>
        <p className="min-w-0 truncate text-sm text-slate-900 dark:text-slate-100">
          <span className="font-bold">{producto.marca}</span>
          <span className="mx-1.5 text-slate-300 dark:text-slate-600">—</span>
          <span className="font-medium">{producto.tono}</span>
        </p>
      </div>
      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        {cantidad} {cantidad === 1 ? "sucursal" : "sucursales"}
      </span>
    </div>
  );
}

function SkeletonTabla() {
  return (
    <div className="space-y-3" aria-hidden="true">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="h-5 w-56 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-5 w-24 rounded-full bg-slate-100 dark:bg-slate-800" />
          </div>
          <div className="mt-5 space-y-3">
            <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-4 w-5/6 rounded bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EstadoVacio({
  hayBusqueda,
  busqueda,
  onLimpiarBusqueda,
}: Pick<TablaFaltantesProps, "hayBusqueda" | "busqueda" | "onLimpiarBusqueda">) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-900">
      <div
        className={`mx-auto flex size-14 items-center justify-center rounded-2xl ${
          hayBusqueda
            ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
            : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
        }`}
      >
        {hayBusqueda ? (
          <SearchX className="size-6" aria-hidden="true" />
        ) : (
          <CheckCircle2 className="size-6" aria-hidden="true" />
        )}
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
        {hayBusqueda ? "Sin coincidencias" : "Todo el inventario está en orden"}
      </h3>
      <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {hayBusqueda
          ? `No encontramos tintes por debajo del límite que coincidan con “${busqueda}”.`
          : "No hay tintes por debajo del límite mínimo en este momento."}
      </p>
      {hayBusqueda && (
        <button
          type="button"
          onClick={onLimpiarBusqueda}
          className="mt-5 inline-flex h-9 items-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          Limpiar búsqueda
        </button>
      )}
    </div>
  );
}

export function TablaFaltantes({
  productos,
  cargando,
  hayBusqueda,
  busqueda,
  onLimpiarBusqueda,
}: TablaFaltantesProps) {
  if (cargando && productos.length === 0) {
    return <SkeletonTabla />;
  }

  if (productos.length === 0) {
    return (
      <EstadoVacio
        hayBusqueda={hayBusqueda}
        busqueda={busqueda}
        onLimpiarBusqueda={onLimpiarBusqueda}
      />
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 md:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Tintes por debajo del límite mínimo, agrupados por marca y tono
          </caption>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/60">
              <th
                scope="col"
                className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Sucursal
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Stock actual
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Límite mínimo
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <Fragment key={producto.id}>
                <tr className="border-b border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/40">
                  <th
                    colSpan={4}
                    scope="colgroup"
                    className="px-6 py-3.5 text-left font-normal"
                  >
                    <EncabezadoProducto producto={producto} />
                  </th>
                </tr>

                {producto.sucursales.map((sucursal) => (
                  <tr
                    key={`${producto.id}-${sucursal.sucursal}`}
                    className="border-b border-slate-100 last:border-b-0 hover:bg-amber-50/30 dark:border-slate-800 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-6 py-3 text-sm text-slate-700 dark:text-slate-300">
                      <span className="flex items-center gap-2">
                        <MapPin
                          className="size-4 text-slate-400 dark:text-slate-500"
                          aria-hidden="true"
                        />
                        {sucursal.sucursal}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StockBadge stock={sucursal.stockActual} />
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-medium tabular-nums text-slate-600 dark:text-slate-300">
                      {sucursal.stockMinimo}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <EstadoStock stock={sucursal.stockActual} />
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {productos.map((producto) => (
          <article
            key={producto.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-3.5 dark:border-slate-800 dark:bg-slate-800/40">
              <EncabezadoProducto producto={producto} />
            </div>

            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {producto.sucursales.map((sucursal) => (
                <li
                  key={`${producto.id}-${sucursal.sucursal}`}
                  className="px-4 py-3.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                      <MapPin
                        className="size-4 text-slate-400 dark:text-slate-500"
                        aria-hidden="true"
                      />
                      {sucursal.sucursal}
                    </span>
                    <EstadoStock stock={sucursal.stockActual} />
                  </div>

                  <dl className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-950/60">
                      <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                        Existencia
                      </dt>
                      <dd className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {formatearPiezas(sucursal.stockActual)}
                      </dd>
                    </div>
                    <div className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-950/60">
                      <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                        Límite mínimo
                      </dt>
                      <dd className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {formatearPiezas(sucursal.stockMinimo)}
                      </dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {cargando && (
        <p className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <PackageOpen className="size-4" aria-hidden="true" />
          Actualizando inventario...
        </p>
      )}
    </>
  );
}
