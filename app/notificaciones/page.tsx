"use client";
import React, { useState } from 'react';
import { determinarEstadoNotificacionAutomatica } from '../../src/tests/guillermina/logic';
import { crearDatosNotificacionAutomatica, esEmailAdministradorValido } from '../../src/tests/juanpablo/logic';

export default function NotificacionesPage() {
  const [adminEmail, setAdminEmail] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [datosSimulados, setDatosSimulados] = useState<any>(null);
  
  const [resultadoEnvio, setResultadoEnvio] = useState('exitoso');
  const [reintentos, setReintentos] = useState(0);
  const [estadoNotificacion, setEstadoNotificacion] = useState('pendiente');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [log, setLog] = useState<any[]>([]);

  const procesamientoFinalizado = estadoNotificacion === 'enviada' || estadoNotificacion === 'fallida';

  const handleSimularNuevaReserva = () => {
    if (!esEmailAdministradorValido(adminEmail)) {
      alert("El email del administrador no es válido");
      return;
    }
    const datos = crearDatosNotificacionAutomatica(adminEmail);
    setReintentos(0);
    setEstadoNotificacion('pendiente');
    setLog([]);
    setDatosSimulados(datos);
  };

  const handleProcesarCola = () => {
    // No permite nuevos intentos cuando la notificación ya alcanzó un estado terminal.
    if (procesamientoFinalizado) return;

    const input = {
      estadoActual: estadoNotificacion,
      resultadoEnvio: resultadoEnvio,
      reintentosRealizados: reintentos,
      fechaHoraFallo: new Date(),
      tipoError: 'Timeout API SendGrid'
    };
    
    const resultado = determinarEstadoNotificacionAutomatica(input);
    
    setLog((logActual) => [{
      input,
      resultado
    }, ...logActual]);

    setEstadoNotificacion(resultado.nuevoEstado);
    
    if (resultado.nuevoEstado === 'reintentada') {
      setReintentos(resultado.reintentosActualizados);
    }
  };

  const handleReset = () => {
    setReintentos(0);
    setEstadoNotificacion('pendiente');
    setLog([]);
    setDatosSimulados(null);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8 flex justify-center items-center">
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '8px', width: '100%' }}>
        <h2>Motor de Cola de Notificaciones (M06)</h2>
        <p>Esta pantalla simula el comportamiento asíncrono del sistema.</p>
        
        <div style={{ padding: '15px', background: '#f0f4f8', marginBottom: '20px', borderRadius: '4px' }}>
          <h3>Paso 1: Detectar Nueva Reserva (Lógica Juan Pablo)</h3>
          <p>Al confirmar una reserva, el sistema recopila los datos y envía una notificación al administrador.</p>
          {/* Permite que Cypress complete el email sin depender del placeholder o del estilo del campo. */}
          <input 
            data-cy="admin-email"
            type="email"
            placeholder="admin@clinica.com"
            value={adminEmail}
            onChange={e => setAdminEmail(e.target.value)}
            style={{ padding: '8px', width: '300px', marginRight: '10px' }}
          />
          {/* Identifica la acción que crea la notificación y habilita el worker de envío. */}
          <button data-cy="enqueue-notification" onClick={handleSimularNuevaReserva} style={{ padding: '8px 16px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}>
            Simular Inserción en Cola
          </button>

          {/* Confirma en el E2E que la notificación fue creada con los datos ingresados. */}
          {datosSimulados && (
            <pre data-cy="queued-notification" style={{ background: '#333', color: '#fff', padding: '10px', marginTop: '10px', borderRadius: '4px' }}>
              {JSON.stringify(datosSimulados, null, 2)}
            </pre>
          )}
        </div>

        {/* Marca el bloque que aparece cuando la notificación ya está disponible para procesar. */}
        {datosSimulados && (
          <div data-cy="notification-worker" style={{ padding: '15px', background: '#fff3e0', marginBottom: '20px', borderRadius: '4px' }}>
            <h3>Paso 2: Worker de Cola de Envío (Lógica Guillermina)</h3>
            <p>El sistema intenta enviar el correo usando un proveedor externo.</p>
            
            <div style={{ marginBottom: '10px' }}>
              <label>Simular respuesta de la API Externa: </label>
              {/* Permite elegir de forma estable si el proveedor externo responde con éxito o error. */}
              <select data-cy="send-result" value={resultadoEnvio} onChange={e => setResultadoEnvio(e.target.value)} style={{ padding: '8px', marginLeft: '10px' }}>
                <option value="exitoso">200 OK (Exitoso)</option>
                <option value="fallido">500 Server Error (Fallo)</option>
                <option value="timeout">Timeout de Red</option>
              </select>
            </div>
            
            {/* Expone solamente el valor dinámico para comprobar que nunca supere los tres reintentos. */}
            <p>Reintentos actuales en BD: <strong data-cy="retry-count">{reintentos}</strong> / 3</p>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              {/* Identifica la acción principal que ejecuta cada intento de envío. */}
              <button
                data-cy="process-notification"
                onClick={handleProcesarCola}
                disabled={procesamientoFinalizado}
                style={{
                  padding: '8px 16px',
                  background: procesamientoFinalizado ? '#bdbdbd' : '#f57c00',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: procesamientoFinalizado ? 'not-allowed' : 'pointer',
                }}
              >
                Ejecutar Worker (Procesar Mensaje)
              </button>
              {/* Permite reiniciar el escenario sin localizar el botón por su texto visible. */}
              <button data-cy="reset-notification" onClick={handleReset} style={{ padding: '8px 16px', background: '#9e9e9e', color: 'white', border: 'none', borderRadius: '4px' }}>
                Resetear Simulación
              </button>
            </div>
          </div>
        )}

        {/* Delimita el historial completo para verificar cuántos intentos fueron registrados. */}
        {log.length > 0 && (
          <div data-cy="processing-history">
            <h3>Historial de Procesamiento</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Usa el mismo selector en cada registro para que Cypress pueda contar y recorrer los intentos. */}
              {log.map((entry, idx) => (
                <div key={idx} data-cy="processing-log-entry" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', background: entry.resultado.nuevoEstado === 'fallida' ? '#ffebee' : entry.resultado.nuevoEstado === 'enviada' ? '#e8f5e9' : '#fff9c4' }}>
                  {/* Separa el estado del resto del texto para comprobar ENVIADA, REINTENTADA o FALLIDA. */}
                  <span data-cy="processing-status"><strong>Resultado Worker:</strong> {entry.resultado.nuevoEstado.toUpperCase()}</span>
                  <br />
                  {/* Permite validar el contador guardado en cada entrada individual del historial. */}
                  <small data-cy="logged-retry-count">Reintentos actualizados a: {entry.resultado.reintentosActualizados}</small>
                  {/* Identifica el detalle que solo debe aparecer cuando el fallo ya es definitivo. */}
                  {entry.resultado.informacionError && (
                    <div data-cy="failure-detail" style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
                      Error Registrado: {entry.resultado.informacionError.tipoFallo} a las {entry.resultado.informacionError.hora}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
