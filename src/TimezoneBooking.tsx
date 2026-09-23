"use client";
import React, { useState, useEffect } from 'react';
import { detectLocalTimezone, convertSlotToLocalTime } from './tests/franco/logic';
import { actualizarSeleccionEvento, filterDaysByDuration } from './tests/julian/logic';
import { validarFormatoEmailReserva } from './tests/francisco/logic';
import { procesarReservaAutomática } from './tests/elena/reserva';

const mockEventTypes = [
  { id: '1', name: 'Consulta Corta', duration: 30 },
  { id: '2', name: 'Consulta Larga', duration: 60 }
];

const mockAvailability = [
  { date: '2026-10-15', freeIntervals: [{ start: '09:00', end: '10:00' }] }, // 60 min
  { date: '2026-10-16', freeIntervals: [{ start: '10:00', end: '10:30' }] }, // 30 min
];

const availableTimezones = [
  "America/Argentina/Buenos_Aires",
  "America/Argentina/Mendoza",
  "America/New_York",
  "Europe/Madrid",
  "Asia/Kolkata",
  "UTC"
];

export default function TimezoneBooking() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);

  const [tzs, setTzs] = useState(availableTimezones);
  const [timezone, setTimezone] = useState('UTC');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const localTz = detectLocalTimezone();
      if (localTz) {
        setTimezone(localTz);
        setTzs(prev => prev.includes(localTz) ? prev : [...prev, localTz]);
      }
    } catch (e) {}
  }, []);

  const handleEventSelect = (eventId: string, eventDuration: number) => {
    const nextSelection = actualizarSeleccionEvento(eventId);
    setSelectedEventId(nextSelection.selectedEventId);
    setDuration(eventDuration);
    setSelectedSlot(null);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (!validarFormatoEmailReserva(val)) {
      setEmailError('Formato de correo inválido');
    } else {
      setEmailError('');
    }
  };

  const handleConfirm = () => {
    if (!selectedEventId || !selectedSlot || !name || !email) {
      setError('Por favor completa todos los campos.');
      return;
    }
    if (emailError) {
      setError('Corrige los errores antes de confirmar.');
      return;
    }
    setError('');
    
    const reservaData = {
      pasosCompletados: true,
      confirmacionAutomatica: true,
      horarioDisponible: true,
      canceOption: true,
      emailInvitado: email,
    };

    const res = procesarReservaAutomática(reservaData);
    setResult(res);
  };

  const validDays = filterDaysByDuration(mockAvailability, duration);

  if (result && result.estado === 'confirmado') {
    return (
      <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', textAlign: 'center', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 data-cy="booking-confirmation" style={{ color: 'green' }}>Tu reserva fue confirmada exitosamente.</h2>
        <p>Te esperamos el {selectedSlot} ({timezone})</p>
        <p>Email enviado a: {result.detallesMail?.destino}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>Booking Público (M04)</h2>
      
      {error && <div data-cy="error-message" style={{ color: 'red', marginBottom: '10px', padding: '10px', background: '#ffebee', borderRadius: '4px' }}>{error}</div>}

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px' }}>1. Selecciona un Evento (Lógica Julián):</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          {mockEventTypes.map(ev => (
            <button
              key={ev.id}
              onClick={() => handleEventSelect(ev.id, ev.duration)}
              style={{ padding: '10px', flex: 1, cursor: 'pointer', background: selectedEventId === ev.id ? '#0070f3' : '#f0f0f0', color: selectedEventId === ev.id ? 'white' : 'black', borderRadius: '4px', border: 'none' }}
            >
              {ev.name} ({ev.duration} min)
            </button>
          ))}
        </div>
      </div>

      {selectedEventId && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>2. Zona Horaria (Lógica Franco):</label>
          <select 
            data-cy="timezone-selector"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '15px' }}
          >
            {tzs.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>

          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>3. Horarios Disponibles:</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {validDays.length === 0 && <p style={{ color: '#666' }}>No hay días con disponibilidad para esta duración.</p>}
            
            {mockAvailability.filter(d => validDays.includes(d.date)).map(day => (
              day.freeIntervals.map((interval, i) => {
                const utcSlot = `${day.date}T${interval.start}:00Z`;
                let localTime = { date: '', time: '' };
                try {
                  localTime = convertSlotToLocalTime(utcSlot, timezone);
                } catch (e) {
                  return null;
                }
                const slotLabel = `${localTime.date} - ${localTime.time}`;
                return (
                  <button
                    key={`${day.date}-${i}`}
                    data-cy={`slot-${utcSlot}`}
                    onClick={() => setSelectedSlot(slotLabel)}
                    style={{ padding: '10px', background: selectedSlot === slotLabel ? '#4CAF50' : '#f1f1f1', color: selectedSlot === slotLabel ? 'white' : 'black', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    {slotLabel}
                  </button>
                );
              })
            ))}
          </div>
        </div>
      )}

      {selectedSlot && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>4. Tus Datos (Lógica Francisco & Elena):</label>
          <input 
            data-cy="guest-name"
            placeholder="Tu Nombre Completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <input 
            data-cy="email-input"
            type="email"
            placeholder="Tu Email"
            value={email}
            onChange={handleEmailChange}
            style={{ width: '100%', padding: '8px', border: emailError ? '1px solid red' : '1px solid #ccc', borderRadius: '4px' }}
          />
          {emailError && <span style={{ color: 'red', fontSize: '12px' }}>{emailError}</span>}
        </div>
      )}

      <button
        data-cy="submit-booking"
        onClick={handleConfirm}
        disabled={!selectedSlot}
        style={{ width: '100%', padding: '12px', background: selectedSlot ? '#0070f3' : '#ccc', color: 'white', border: 'none', borderRadius: '4px', cursor: selectedSlot ? 'pointer' : 'not-allowed', fontSize: '16px' }}
      >
        Confirmar reserva
      </button>
    </div>
  );
}
