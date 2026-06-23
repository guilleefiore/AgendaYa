export function esEmailAdministradorValido(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function crearDatosNotificacionAutomatica(adminEmail) {
  return {
    adminEmail,
    patientName: 'Juan Pérez',
    appointmentDay: '2026-06-25',
    appointmentTime: '14:30',
    professionalName: 'Dr. García',
  };
}
