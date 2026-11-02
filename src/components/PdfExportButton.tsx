"use client";

import { useState } from "react";
import type { RowInput } from "jspdf-autotable";
import { FileDown, Loader2 } from "lucide-react";
import type { ProductoFaltante } from "@/types/inventario";
import {
  formatearClaveArchivo,
  formatearFechaHora,
  formatearPiezas,
} from "@/utils/formato";

interface PdfExportButtonProps {
  productos: ProductoFaltante[];
  deshabilitado?: boolean;
}

export function PdfExportButton({
  productos,
  deshabilitado = false,
}: PdfExportButtonProps) {
  const [generando, setGenerando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generarPdf() {
    if (productos.length === 0 || generando) return;

    setGenerando(true);
    setError(null);

    try {
      const [{ jsPDF }, { default: autoTable }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);

      const fecha = new Date();
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const body: RowInput[] = [];
      let totalSucursales = 0;

      productos.forEach((producto, indiceProducto) => {
        const relleno: [number, number, number] =
          indiceProducto % 2 === 0 ? [248, 250, 252] : [255, 255, 255];

        const sucursalesTexto = producto.sucursales
          .map((sucursal) => `• ${sucursal.sucursal}`)
          .join("\n");

        const stockTexto = producto.sucursales
          .map(
            (sucursal) =>
              `${formatearPiezas(sucursal.stockActual)} (Mín: ${sucursal.stockMinimo})`,
          )
          .join("\n");

        totalSucursales += producto.sucursales.length;

        body.push([
          {
            content: producto.marca,
            styles: {
              fillColor: relleno,
              fontStyle: "bold",
              valign: "top",
            },
          },
          {
            content: producto.tono,
            styles: { fillColor: relleno, valign: "top" },
          },
          {
            content: sucursalesTexto,
            styles: { fillColor: relleno, valign: "top" },
          },
          {
            content: stockTexto,
            styles: { fillColor: relleno, valign: "top" },
          },
        ]);
      });

      doc.setFillColor(217, 119, 6);
      doc.rect(14, 14, 10, 2.5, "F");

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.text(
        "Reporte de Tintes por Debajo del Límite de Inventario",
        14,
        24,
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Fecha y hora de generación: ${formatearFechaHora(fecha)}`, 14, 30);
      doc.text(
        `${productos.length} ${productos.length === 1 ? "tinte" : "tintes"} · ${totalSucursales} ${totalSucursales === 1 ? "sucursal" : "sucursales"}`,
        14,
        35,
      );

      autoTable(doc, {
        startY: 41,
        head: [["Marca", "Tono", "Sucursal", "Stock / Mínimo"]],
        body,
        theme: "grid",
        rowPageBreak: "avoid",
        margin: { left: 14, right: 14, bottom: 18 },
        styles: {
          font: "helvetica",
          fontSize: 9,
          cellPadding: 3,
          textColor: [51, 65, 85],
          lineColor: [226, 232, 240],
          lineWidth: 0.2,
          valign: "top",
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 8.5,
          valign: "middle",
        },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 45 },
          2: { cellWidth: 38 },
          3: { cellWidth: 64 },
        },
      });

      const totalPaginas = doc.getNumberOfPages();

      for (let pagina = 1; pagina <= totalPaginas; pagina += 1) {
        doc.setPage(pagina);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text("Control de inventario de tintes", 14, 289);
        doc.text(`Página ${pagina} de ${totalPaginas}`, 196, 289, {
          align: "right",
        });
      }

      doc.save(`reporte-tintes-${formatearClaveArchivo(fecha)}.pdf`);
    } catch (err) {
      setError(
        err instanceof Error
          ? `No se pudo generar el PDF: ${err.message}`
          : "No se pudo generar el PDF.",
      );
    } finally {
      setGenerando(false);
    }
  }

  return (
    <div className="flex flex-col items-stretch gap-1.5 sm:items-end">
      <button
        type="button"
        onClick={generarPdf}
        disabled={deshabilitado || generando || productos.length === 0}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white dark:focus:ring-white/10"
      >
        {generando ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <FileDown className="size-4" aria-hidden="true" />
        )}
        {generando ? "Generando..." : "Descargar PDF"}
      </button>

      {error && (
        <p
          role="alert"
          className="max-w-64 text-right text-xs text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  );
}
