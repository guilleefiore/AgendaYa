"use client";
import React, { useState, useEffect } from 'react';
import { detectLocalTimezone, convertSlotToLocalTime } from './tests/franco/logic';

const mockUtcSlots = [
  "2026-10-15T13:00:00Z",
  "2026-10-15T14:30:00Z",
  "2026-10-16T09:00:00Z",
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
  const [timezone, setTimezone] = useState('UTC');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const localTz = detectLocalTimezone();
      if (localTz) {
        setTimezone(localTz);
        if (!availableTimezones.includes(localTz)) {
          availableTimezones.push(localTz);
        }
      }
    } catch (e) {
      // Fallback
    }
  }, []);

  const handleConfirm = () => {
    if (!selectedSlot) {
      setError('Debes seleccionar un horario.');
      return;
    }
    if (!name || !email) {
      setError('Nombre y email son obligatorios.');
      return;
    }
    setError('');
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
        <h2 data-cy="booking-confirmation" style={{ color: 'green' }}>Tu reserva fue confirmada exitosamente.</h2>
        <p>Te esperamos el {selectedSlot} ({timezone})</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Reserva tu turno</h2>
      
      {error && <div data-cy="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Zona Horaria:</label>
        <select 
          data-cy="timezone-selector"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        >
          {availableTimezones.map(tz => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Horarios Disponibles:</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {mockUtcSlots.map(utcSlot => {
            let localTime = { date: '', time: '' };
            try {
              localTime = convertSlotToLocalTime(utcSlot, timezone);
            } catch (e) {
              localTime = { date: 'Error', time: 'Error' };
            }
            const slotLabel = `${localTime.date} - ${localTime.time}`;
            
            return (
              <button
                key={utcSlot}
                data-cy={`slot-${utcSlot}`}
                onClick={() => setSelectedSlot(slotLabel)}
                style={{
                  padding: '10px',
                  background: selectedSlot === slotLabel ? '#4CAF50' : '#f1f1f1',
                  color: selectedSlot === slotLabel ? 'white' : 'black',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {slotLabel}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <input 
          data-cy="guest-name"
          placeholder="Tu Nombre Completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <input 
          data-cy="email-input"
          type="email"
          placeholder="Tu Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <button
        data-cy="submit-booking"
        onClick={handleConfirm}
        style={{ width: '100%', padding: '12px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
      >
        Confirmar reserva
      </button>
    </div>
  );
}
