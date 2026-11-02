import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MapPin, Palette, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LoginForm } from "@/components/auth/LoginForm";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export const dynamic = "force-dynamic";

const SUCURSALES = ["Lluvia", "Santa Rosa", "5 de Mayo"];

export default async function LoginPage() {
  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) redirect("/dashboard");
  } catch {
    // Si Supabase aún no está configurado, se muestra el formulario.
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-slate-950 transition-colors dark:bg-black">
      <div className="absolute right-4 top-4 z-30 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,119,6,0.22),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.14),transparent_45%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:42px_42px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid min-h-dvh w-full max-w-7xl lg:grid-cols-[1.05fr_1fr]">
        <section className="hidden flex-col justify-between p-12 lg:flex xl:p-16">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-lg shadow-orange-900/30">
              <Palette className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-lg font-bold tracking-tight text-white">Tintes</p>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                Control de inventario
              </p>
            </div>
          </div>

          <div className="max-w-lg">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">
              Visibilidad por sucursal
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight text-white xl:text-5xl">
              Cada tono bajo el límite, en un solo lugar.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-300">
              Consulta existencias y mínimos de los tintes que requieren
              atención. Sin cálculos de compra: la decisión siempre es tuya.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {SUCURSALES.map((sucursal) => (
                <span
                  key={sucursal}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-200 backdrop-blur"
                >
                  <MapPin className="size-3.5 text-amber-400" aria-hidden="true" />
                  {sucursal}
                </span>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Acceso exclusivo para personal autorizado.
          </p>
        </section>

        <section className="flex min-h-dvh items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-6 shadow-2xl shadow-black/30 transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-white">
                <Palette className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Tintes
                </p>
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                  Control de inventario
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Inicia sesión
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Ingresa con la cuenta asignada para consultar el inventario.
            </p>

            <div className="mt-7">
              <LoginForm />
            </div>

            <div className="mt-7 flex items-start gap-2 border-t border-slate-100 pt-5 text-xs leading-relaxed text-slate-400 dark:border-slate-800 dark:text-slate-500">
              <ShieldCheck
                className="mt-0.5 size-4 shrink-0 text-slate-400 dark:text-slate-500"
                aria-hidden="true"
              />
              <p>
                Si no tienes acceso, solicita tus credenciales al administrador
                del inventario.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
