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
    <html lang="es">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
