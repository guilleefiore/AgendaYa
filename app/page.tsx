import Link from 'next/link';

export default function Home() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 text-center mb-5">
          <h1 className="fw-bold mb-3" style={{ color: '#6750A4' }}>AgendaYA</h1>
          <p className="lead text-secondary-ag">Panel de control de flujos de prueba (TP6)</p>
        </div>
      </div>

      <div className="row justify-content-center g-4">
        
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card-ag p-4 p-md-5">
            <h3 className="h4 fw-bold mb-3">Booking Público (M04)</h3>
            <p className="text-secondary-ag mb-4">
              Flujo del Usuario Invitado. Simula el calendario, selección de horarios con zona horaria adaptativa y confirmación de la reserva.
            </p>
            <Link href="/reservas" className="btn btn-primary-ag w-100 d-block text-decoration-none">
              Ir a Reservas (Usuario Invitado)
            </Link>
          </div>
        </div>

        <div className="col-12 col-md-10 col-lg-8">
          <div className="card-ag p-4 p-md-5">
            <h3 className="h4 fw-bold mb-3">Gestión de Plantillas (M06)</h3>
            <p className="text-secondary-ag mb-4">
              Flujo del Administrador. Creación y edición de plantillas de email con catálogo de variables dinámicas y vista previa.
            </p>
            <Link href="/plantillas" className="btn btn-primary-ag w-100 d-block text-decoration-none">
              Ir a Configurar Plantillas (Administrador)
            </Link>
          </div>
        </div>

        <div className="col-12 col-md-10 col-lg-8">
          <div className="card-ag p-4 p-md-5">
            <h3 className="h4 fw-bold mb-3">Motor de Notificaciones (M06 Background)</h3>
            <p className="text-secondary-ag mb-4">
              Pantalla técnica para visualizar y forzar los escenarios de la cola de notificaciones (intentos fallidos, reintentos, envíos exitosos).
            </p>
            <Link href="/notificaciones" className="btn btn-secondary-ag w-100 d-block text-decoration-none">
              Ir a Motor de Envío (Pruebas Sistema)
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
