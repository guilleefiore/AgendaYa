import Link from 'next/link';
import TemplateManager from "../src/TemplateManager";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <main className="w-full max-w-4xl">
        <div className="mb-8 p-4 bg-white rounded shadow text-center flex flex-col gap-4">
          <h1 className="text-2xl font-bold mb-4">AgendaYA - TP6</h1>
          <Link href="/plantillas" className="text-blue-500 underline text-lg">
            Ir a Configurar Plantilla de Email (Flujo M06)
          </Link>
          <Link href="/reservas" className="text-green-600 underline text-lg">
            Ir a Booking Público (Flujo M04 - Timezone)
          </Link>
        </div>
        <TemplateManager adminEmail="admin@hospital.com" />
      </main>
    </div>
  );
}
