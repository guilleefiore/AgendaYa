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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [log, setLog] = useState<any[]>([]);

  const handleSimularNuevaReserva = () => {
    if (!esEmailAdministradorValido(adminEmail)) {
      alert("El email del administrador no es válido");
      return;
    }
    const datos = crearDatosNotificacionAutomatica(adminEmail);
    setDatosSimulados(datos);
  };

  const handleProcesarCola = () => {
    const input = {
      resultadoEnvio: resultadoEnvio,
      reintentosRealizados: reintentos,
      fechaHoraFallo: new Date(),
      tipoError: 'Timeout API SendGrid'
    };
    
    const resultado = determinarEstadoNotificacionAutomatica(input);
    
    setLog([{
      input,
      resultado
    }, ...log]);
    
    if (resultado.nuevoEstado === 'reintentada') {
      setReintentos(resultado.reintentosActualizados);
    }
  };

  const handleReset = () => {
    setReintentos(0);
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
          <input 
            type="email"
            placeholder="admin@clinica.com"
            value={adminEmail}
            onChange={e => setAdminEmail(e.target.value)}
            style={{ padding: '8px', width: '300px', marginRight: '10px' }}
          />
          <button onClick={handleSimularNuevaReserva} style={{ padding: '8px 16px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}>
            Simular Inserción en Cola
          </button>

          {datosSimulados && (
            <pre style={{ background: '#333', color: '#fff', padding: '10px', marginTop: '10px', borderRadius: '4px' }}>
              {JSON.stringify(datosSimulados, null, 2)}
            </pre>
          )}
        </div>

        {datosSimulados && (
          <div style={{ padding: '15px', background: '#fff3e0', marginBottom: '20px', borderRadius: '4px' }}>
            <h3>Paso 2: Worker de Cola de Envío (Lógica Guillermina)</h3>
            <p>El sistema intenta enviar el correo usando un proveedor externo.</p>
            
            <div style={{ marginBottom: '10px' }}>
              <label>Simular respuesta de la API Externa: </label>
              <select value={resultadoEnvio} onChange={e => setResultadoEnvio(e.target.value)} style={{ padding: '8px', marginLeft: '10px' }}>
                <option value="exitoso">200 OK (Exitoso)</option>
                <option value="fallido">500 Server Error (Fallo)</option>
                <option value="timeout">Timeout de Red</option>
              </select>
            </div>
            
            <p>Reintentos actuales en BD: <strong>{reintentos}</strong> / 3</p>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleProcesarCola} style={{ padding: '8px 16px', background: '#f57c00', color: 'white', border: 'none', borderRadius: '4px' }}>
                Ejecutar Worker (Procesar Mensaje)
              </button>
              <button onClick={handleReset} style={{ padding: '8px 16px', background: '#9e9e9e', color: 'white', border: 'none', borderRadius: '4px' }}>
                Resetear Simulación
              </button>
            </div>
          </div>
        )}

        {log.length > 0 && (
          <div>
            <h3>Historial de Procesamiento</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {log.map((entry, idx) => (
                <div key={idx} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', background: entry.resultado.nuevoEstado === 'fallida' ? '#ffebee' : entry.resultado.nuevoEstado === 'enviada' ? '#e8f5e9' : '#fff9c4' }}>
                  <strong>Resultado Worker:</strong> {entry.resultado.nuevoEstado.toUpperCase()}
                  <br />
                  <small>Reintentos actualizados a: {entry.resultado.reintentosActualizados}</small>
                  {entry.resultado.informacionError && (
                    <div style={{ color: 'red', marginTop: '5px', fontSize: '12px' }}>
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
