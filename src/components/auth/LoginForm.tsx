"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

function traducirError(mensaje: string): string {
  const texto = mensaje.toLocaleLowerCase("es-MX");

  if (texto.includes("invalid login credentials")) {
    return "Correo o contraseña incorrectos. Verifica tus datos.";
  }

  if (texto.includes("email not confirmed")) {
    return "Tu correo aún no ha sido confirmado. Contacta al administrador.";
  }

  if (texto.includes("too many requests")) {
    return "Demasiados intentos. Espera un momento e inténtalo de nuevo.";
  }

  if (texto.includes("faltan next_public_supabase")) {
    return "La conexión con Supabase no está configurada. Revisa .env.local.";
  }

  return mensaje;
}

export function LoginForm() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setCargando(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: errorAuth } = await supabase.auth.signInWithPassword({
        email: correo.trim(),
        password: contrasena,
      });

      if (errorAuth) {
        setError(traducirError(errorAuth.message));
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        traducirError(
          err instanceof Error ? err.message : "No fue posible iniciar sesión.",
        ),
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="correo"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Correo electrónico
        </label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            aria-hidden="true"
          />
          <input
            id="correo"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="nombre@correo.com"
            value={correo}
            onChange={(event) => setCorreo(event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-amber-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="contrasena"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Contraseña
        </label>
        <div className="relative">
          <LockKeyhole
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            aria-hidden="true"
          />
          <input
            id="contrasena"
            name="password"
            type={mostrarContrasena ? "text" : "password"}
            required
            autoComplete="current-password"
            placeholder="Tu contraseña"
            value={contrasena}
            onChange={(event) => setContrasena(event.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-amber-500"
          />
          <button
            type="button"
            onClick={() => setMostrarContrasena((visible) => !visible)}
            className="absolute right-1.5 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label={
              mostrarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {mostrarContrasena ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={cargando}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-900/15 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white dark:focus:ring-white/20"
      >
        {cargando ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Ingresando...
          </>
        ) : (
          <>
            Ingresar al panel
            <ArrowRight className="size-4" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
