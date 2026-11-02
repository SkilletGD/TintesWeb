import type { Metadata } from "next";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Tintes | Inventario bajo el límite",
    template: "%s | Tintes",
  },
  description:
    "Panel para consultar tintes con bajo stock en Lluvia, Santa Rosa y 5 de Mayo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
