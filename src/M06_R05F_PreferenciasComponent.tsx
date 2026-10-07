'use client';

import React, { useState } from 'react';

export interface PreferenciasNotificacionDTO {
  Confir: boolean;
  Cance: boolean;
  Repro: boolean;
  Recor: boolean;
}

export function M06R05FPreferenciasComponent() {
  const [preferencias, setPreferencias] = useState<PreferenciasNotificacionDTO>({
    Confir: true,
    Cance: true,
    Repro: true,
    Recor: true,
  });

  const [mensajeExito, setMensajeExito] = useState(false);

  const toggleSwitch = (clave: keyof PreferenciasNotificacionDTO) => {
    setPreferencias((prev) => ({ ...prev, [clave]: !prev[clave] }));
  };

  const handleGuardar = () => {
    setMensajeExito(true);
    setTimeout(() => setMensajeExito(false), 4000);
  };

  return (
    <div style={{ maxWidth: '450px', margin: '20px auto', padding: '24px', fontFamily: 'sans-serif', border: '1px solid #eaeaea', borderRadius: '16px', backgroundColor: '#fff' }}>
      <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
        Configuración de Tus Notificaciones
      </h2>
      <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '24px' }}>
        Elige qué mensajes quieres recibir de Dr. Martín Pérez.
      </p>

      {/* Confirmaciones */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <strong style={{ display: 'block', fontSize: '15px' }}>Confirmaciones</strong>
          <span style={{ fontSize: '13px', color: '#777' }}>Confirmación de Reserva</span>
        </div>
        <input
          type="checkbox"
          data-cy="toggle-confir"
          checked={preferencias.Confir}
          onChange={() => toggleSwitch('Confir')}
          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
        />
      </div>

      {/* Cancelaciones */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <strong style={{ display: 'block', fontSize: '15px' }}>Cancelaciones</strong>
          <span style={{ fontSize: '13px', color: '#777' }}>Cancelación de Turno</span>
        </div>
        <input
          type="checkbox"
          data-cy="toggle-cance"
          checked={preferencias.Cance}
          onChange={() => toggleSwitch('Cance')}
          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
        />
      </div>

      {/* Reprogramaciones */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '8px', border: '1px dashed #7c3aed', borderRadius: '8px' }}>
        <div>
          <strong style={{ display: 'block', fontSize: '15px' }}>Reprogramaciones</strong>
          <span style={{ fontSize: '13px', color: '#777' }}>Cambios de fecha, hora o profesional</span>
        </div>
        <input
          type="checkbox"
          data-cy="toggle-repro"
          checked={preferencias.Repro}
          onChange={() => toggleSwitch('Repro')}
          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
        />
      </div>

      {/* Recordatorios */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <strong style={{ display: 'block', fontSize: '15px' }}>Recordatorios</strong>
          <span style={{ fontSize: '13px', color: '#777' }}>Recordatorios Automáticos</span>
        </div>
        <input
          type="checkbox"
          data-cy="toggle-recor"
          checked={preferencias.Recor}
          onChange={() => toggleSwitch('Recor')}
          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
        />
      </div>

      <button
        data-cy="btn-guardar-preferencias"
        data-testid="btn-guardar-preferencias"
        onClick={handleGuardar}
        style={{ width: '100%', padding: '12px', backgroundColor: '#6d28d9', color: '#fff', border: 'none', borderRadius: '24px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
      >
        Guardar Cambios
      </button>

      {mensajeExito && (
        <div data-cy="toast-exito" style={{ marginTop: '16px', padding: '12px', backgroundColor: '#15803d', color: '#fff', borderRadius: '8px', textAlign: 'center', fontWeight: '500', fontSize: '14px' }}>
          ✓ Preferencias actualizadas con éxito.
        </div>
      )}
    </div>
  );
}