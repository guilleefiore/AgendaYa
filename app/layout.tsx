import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgendaYA - Sistema de Reservas",
  description: "TP6 Ingeniería y Calidad de Software",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
