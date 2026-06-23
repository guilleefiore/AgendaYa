export const MAX_REINTENTOS_NOTIFICACION_AUTOMATICA = 3;

export function procesarNotificacionAutomaticaM06R07F(input) {
  const reintentosNormalizados = Math.max(0, Math.floor(input.reintentosRealizados));

  if (input.resultadoEnvio === 'exitoso') {
    return {
      nuevoEstado: 'enviada',
      reintentosActualizados: reintentosNormalizados,
      informacionError: null,
    };
  }

  if (reintentosNormalizados < MAX_REINTENTOS_NOTIFICACION_AUTOMATICA) {
    return {
      nuevoEstado: 'reintentada',
      reintentosActualizados: reintentosNormalizados + 1,
      informacionError: null,
    };
  }

  const fechaHoraFallo = input.fechaHoraFallo ?? new Date();
  const [fecha, horaConZona] = fechaHoraFallo.toISOString().split('T');
  const hora = horaConZona.replace('Z', '').slice(0, 8);

  return {
    nuevoEstado: 'fallida',
    reintentosActualizados: MAX_REINTENTOS_NOTIFICACION_AUTOMATICA,
    informacionError: {
      tipoFallo: input.tipoError ?? 'desconocido',
      fecha,
      hora,
    },
  };
}
