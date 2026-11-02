"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export function LogoutButton() {
  const router = useRouter();
  const [saliendo, setSaliendo] = useState(false);

  async function cerrarSesion() {
    setSaliendo(true);

    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
    } finally {
      router.replace("/login");
      router.refresh();
      setSaliendo(false);
    }
  }

  return (
    <button
      type="button"
      onClick={cerrarSesion}
      disabled={saliendo}
      className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
      title="Cerrar sesión"
    >
      {saliendo ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <LogOut className="size-4" aria-hidden="true" />
      )}
      <span className="hidden sm:inline">Salir</span>
    </button>
  );
}
