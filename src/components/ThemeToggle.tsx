"use client";

import { Moon, Sun } from "lucide-react";
import { THEME_STORAGE_KEY } from "@/lib/theme";

export function ThemeToggle() {
  function alternarTema() {
    const raiz = document.documentElement;
    const oscuro = raiz.classList.toggle("dark");

    raiz.style.colorScheme = oscuro ? "dark" : "light";

    try {
      localStorage.setItem(THEME_STORAGE_KEY, oscuro ? "dark" : "light");
    } catch {
      // El tema sigue funcionando aunque no se pueda persistir.
    }
  }

  return (
    <button
      type="button"
      onClick={alternarTema}
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white dark:focus:ring-white/10"
      aria-label="Cambiar entre modo claro y oscuro"
      title="Cambiar tema"
    >
      <Moon className="size-4 dark:hidden" aria-hidden="true" />
      <Sun className="hidden size-4 dark:block" aria-hidden="true" />
    </button>
  );
}
