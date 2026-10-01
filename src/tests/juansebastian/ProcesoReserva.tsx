// src/tests/juan/ProcesoReserva.tsx
'use client';

import React, { useState } from 'react';
import { validarDatosCliente, validarSlotDisponible, Slot, DatosCliente } from './logicaReserva';

export default function ProcesoReserva() {
  // Estado para controlar el flujo mobile de 4 pasos (M04-R02NF)
  const [paso, setPaso] = useState<number>(1);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<string>('');
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>('');
  const [slotSeleccionado, setSlotSeleccionado] = useState<Slot | null>(null);
  
  const [cliente, setCliente] = useState<DatosCliente>({ nombre: '', email: '', telefono: '' });
  const [errorMensaje, setErrorMensaje] = useState<string>('');

  // Horarios de prueba (incluye uno ocupado/no disponible para testear errores)
  const slotsEjemplo: Slot[] = [
    { id: '1', hora: '09:00 AM', disponible: true },
    { id: '2', hora: '10:30 AM', disponible: false }, // Simula horario ocupado
    { id: '3', hora: '02:00 PM', disponible: true },
  ];

  // Manejadores de los pasos
  const seleccionarEvento = (nombreEvento: string) => {
    setEventoSeleccionado(nombreEvento);
    setErrorMensaje('');
    setPaso(2);
  };

  const confirmarFechaYHora = () => {
    if (!fechaSeleccionada) {
      setErrorMensaje('Seleccione una fecha válida.');
      return;
    }
    const validacionSlot = validarSlotDisponible(slotSeleccionado);
    if (!validacionSlot.valido) {
      setErrorMensaje(validacionSlot.mensaje);
      return;
    }
    setErrorMensaje('');
    setPaso(3);
  };

  const confirmarReservaFinal = (e: React.FormEvent) => {
    e.preventDefault();
    const validacion = validarDatosCliente(cliente);
    if (!validacion.valido) {
      setErrorMensaje(validacion.mensaje);
      return;
    }
    setErrorMensaje('');
    setPaso(4); // Confirmación exitosa
  };

  return (
    <div style={{ maxWidth: '450px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2 data-cy="titulo-modulo" style={{ textAlign: 'center' }}>AgendaYA - Reserva de Turno</h2>
      <p data-cy="indicador-paso" style={{ fontWeight: 'bold', color: '#555' }}>Paso {paso} de 4</p>

      {/* Cartel de Error Global */}
      {errorMensaje && (
        <div data-cy="error-message" style={{ color: 'red', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontWeight: 'bold' }}>
          {errorMensaje}
        </div>
      )}

      {/* PASO 1: Selección del Tipo de Evento */}
      {paso === 1 && (
        <div data-cy="paso-1-eventos">
          <h3>1. Selecciona el Tipo de Evento</h3>
          <button
            data-cy="event-card-consulta"
            onClick={() => seleccionarEvento('Consulta Inicial (30 min)')}
            style={{ display: 'block', width: '100%', padding: '12px', marginBottom: '10px', cursor: 'pointer' }}
          >
            Consulta Inicial (30 min)
          </button>
          <button
            data-cy="event-card-seguimiento"
            onClick={() => seleccionarEvento('Reunión de Seguimiento (1h)')}
            style={{ display: 'block', width: '100%', padding: '12px', cursor: 'pointer' }}
          >
            Reunión de Seguimiento (1h)
          </button>
        </div>
      )}

      {/* PASO 2: Selección de Fecha y Turno */}
      {paso === 2 && (
        <div data-cy="paso-2-horarios">
          <h3>2. Fecha y Horario ({eventoSeleccionado})</h3>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            Fecha:
            <input
              type="date"
              data-cy="input-fecha"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>

          <p>Horarios disponibles:</p>
          {slotsEjemplo.map((s) => (
            <button
              key={s.id}
              data-cy={`slot-button-${s.id}`}
              onClick={() => {
                setSlotSeleccionado(s);
                setErrorMensaje('');
              }}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px',
                marginBottom: '8px',
                backgroundColor: slotSeleccionado?.id === s.id ? '#cce5ff' : '#f8f9fa',
                border: s.disponible ? '1px solid #ccc' : '1px red dashed',
                cursor: 'pointer'
              }}
            >
              {s.hora} {!s.disponible && '(Ocupado)'}
            </button>
          ))}

          <button
            data-cy="btn-siguiente-paso2"
            onClick={confirmarFechaYHora}
            style={{ width: '100%', padding: '12px', marginTop: '15px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Siguiente
          </button>
        </div>
      )}

      {/* PASO 3: Formulario de Datos Personales */}
      {paso === 3 && (
        <form data-cy="paso-3-formulario" onSubmit={confirmarReservaFinal}>
          <h3>3. Ingrese sus Datos</h3>
          <div style={{ marginBottom: '10px' }}>
            <label>Nombre Completo:</label>
            <input
              type="text"
              data-cy="name-input"
              value={cliente.nombre}
              onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Correo Electrónico:</label>
            <input
              type="text"
              data-cy="email-input"
              value={cliente.email}
              onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Teléfono (Opcional):</label>
            <input
              type="text"
              data-cy="phone-input"
              value={cliente.telefono}
              onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>
          <button
            type="submit"
            data-cy="submit-booking"
            style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Confirmar Reserva
          </button>
        </form>
      )}

      {/* PASO 4: Confirmación Final Exitosa */}
      {paso === 4 && (
        <div data-cy="booking-confirmation" style={{ textAlign: 'center', padding: '20px', backgroundColor: '#e6ffe6', borderRadius: '4px', border: '1px solid green' }}>
          <h3 style={{ color: 'green' }}>¡Reserva Confirmada!</h3>
          <p>Tu turno para <strong>{eventoSeleccionado}</strong> quedó registrado con éxito.</p>
          <p>Fecha: {fechaSeleccionada} - {slotSeleccionado?.hora}</p>
          <p>Enviamos un email de confirmación a: <strong>{cliente.email}</strong></p>
        </div>
      )}
    </div>
  );
}