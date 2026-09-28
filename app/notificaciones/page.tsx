'use client';

import { FormEvent, useState } from 'react';
import {
  crearDatosNotificacionAutomatica,
  esEmailAdministradorValido,
} from '../../src/tests/juanpablo/logic';

export default function NotificacionesPage() {
  const [adminEmail, setAdminEmail] = useState('');
  const [queuedNotification, setQueuedNotification] = useState<ReturnType<
    typeof crearDatosNotificacionAutomatica
  > | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!esEmailAdministradorValido(adminEmail)) {
      return;
    }

    setQueuedNotification(crearDatosNotificacionAutomatica(adminEmail));
  };

  return (
    <main>
      <h1>Notificaciones al administrador</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="admin-email">Email del administrador</label>
        <input
          id="admin-email"
          data-cy="admin-email"
          type="email"
          required
          value={adminEmail}
          onChange={(event) => setAdminEmail(event.target.value)}
        />
        <button data-cy="enqueue-notification" type="submit">
          Encolar notificacion
        </button>
      </form>

      {queuedNotification && (
        <output data-cy="queued-notification">
          {queuedNotification.adminEmail} - {queuedNotification.patientName} -{' '}
          {queuedNotification.appointmentDay} - {queuedNotification.appointmentTime} -{' '}
          {queuedNotification.professionalName}
        </output>
      )}
    </main>
  );
}
