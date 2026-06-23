interface DatosReserva {
  pasosCompletados: boolean;
  confirmacionAutomatica: boolean;
  horarioDisponible: boolean;
  canceOption: boolean;
  emailInvitado: string;
}

export function procesarReservaAutomática(reserva: DatosReserva) {
  // Verificamos todas las pre-condiciones solicitadas en el requerimiento
  if (
    reserva.pasosCompletados &&
    reserva.confirmacionAutomatica &&
    reserva.horarioDisponible &&
    reserva.canceOption === true
  ) {
    return {
      estado: 'confirmado',
      mailEnviado: true,
      detallesMail: {
        destino: reserva.emailInvitado,
        profesional: 'Empresa Demo',
        tipoEvento: 'Confirmación Automática',
        fechaYHora: '2026-06-25 10:00',
        modalidad: 'Virtual con enlace'
      }
    };
  }

  // Si alguna pre-condición falla, la reserva se rechaza automáticamente
  return {
    estado: 'rechazado',
    mailEnviado: false,
    detallesMail: null
  };
}