import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Palette } from "lucide-react";
import { DashboardInventario } from "@/components/DashboardInventario";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Inventario crítico",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let correo: string | null = null;

  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    correo = user?.email ?? null;
  } catch {
    correo = null;
  }

  if (!correo) redirect("/login");

  const inicial = correo.charAt(0).toUpperCase();

  return (
    <div className="min-h-dvh bg-slate-50 transition-colors dark:bg-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-950/85">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-sm shadow-orange-600/20">
              <Palette className="size-4.5" aria-hidden="true" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Tintes
              </p>
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                Control de inventario
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 transition-colors dark:border-slate-800 dark:bg-slate-900 sm:flex">
              <span className="flex size-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white dark:bg-slate-100 dark:text-slate-900">
                {inicial}
              </span>
              <span className="max-w-52 truncate text-xs font-medium text-slate-600 dark:text-slate-300">
                {correo}
              </span>
            </div>
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        <DashboardInventario />
      </main>

      <footer className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="border-t border-slate-200 pt-5 text-center text-xs text-slate-400 transition-colors dark:border-slate-800 dark:text-slate-500 sm:flex sm:items-center sm:justify-between sm:text-left">
          <p>Tintes · Consulta de inventario por sucursal</p>
          <p className="mt-1 sm:mt-0">
            Solo lectura · La decisión de compra es del negocio
          </p>
        </div>
      </footer>
    </div>
  );
}
