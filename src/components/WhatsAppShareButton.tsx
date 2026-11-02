"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, MessageCircle } from "lucide-react";
import type { ProductoFaltante } from "@/types/inventario";
import {
  construirMensajeWhatsApp,
  crearEnlaceWhatsApp,
} from "@/utils/whatsapp";

interface WhatsAppShareButtonProps {
  productos: ProductoFaltante[];
  deshabilitado?: boolean;
}

export function WhatsAppShareButton({
  productos,
  deshabilitado = false,
}: WhatsAppShareButtonProps) {
  const [copiado, setCopiado] = useState(false);
  const [errorCopia, setErrorCopia] = useState(false);
  const temporizador = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (temporizador.current) window.clearTimeout(temporizador.current);
    };
  }, []);

  const sinDatos = deshabilitado || productos.length === 0;

  function compartir() {
    if (sinDatos) return;

    const mensaje = construirMensajeWhatsApp(productos);
    window.open(crearEnlaceWhatsApp(mensaje), "_blank", "noopener,noreferrer");
  }

  async function copiarMensaje() {
    if (sinDatos) return;

    try {
      const mensaje = construirMensajeWhatsApp(productos);
      await navigator.clipboard.writeText(mensaje);
      setCopiado(true);
      setErrorCopia(false);

      if (temporizador.current) window.clearTimeout(temporizador.current);
      temporizador.current = window.setTimeout(() => setCopiado(false), 2200);
    } catch {
      setErrorCopia(true);
      setCopiado(false);
    }
  }

  return (
    <div className="relative flex items-stretch gap-1.5">
      <button
        type="button"
        onClick={compartir}
        disabled={sinDatos}
        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-600/20 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
      >
        <MessageCircle className="size-4" aria-hidden="true" />
        Enviar por WhatsApp
      </button>

      <button
        type="button"
        onClick={copiarMensaje}
        disabled={sinDatos}
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:border-emerald-500/50 dark:hover:bg-emerald-500/20"
        aria-label="Copiar lista para WhatsApp"
        title={copiado ? "Mensaje copiado" : "Copiar mensaje"}
      >
        {copiado ? (
          <Check className="size-4" aria-hidden="true" />
        ) : (
          <Copy className="size-4" aria-hidden="true" />
        )}
      </button>

      {(copiado || errorCopia) && (
        <span
          role="status"
          className={`absolute -bottom-6 right-0 whitespace-nowrap rounded-md px-2 py-1 text-xs ${
            errorCopia
              ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
              : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
          }`}
        >
          {errorCopia ? "No se pudo copiar" : "Mensaje copiado"}
        </span>
      )}
    </div>
  );
}
