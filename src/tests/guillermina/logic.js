// Cantidad máxima de reintentos permitidos antes de marcar la notificación como fallida.
export const MAX_REINTENTOS_NOTIFICACION_AUTOMATICA = 3;

export function determinarEstadoNotificacionAutomatica(input) {
  // Evita contadores negativos o decimales antes de evaluar el resultado del envío.
  const reintentosNormalizados = Math.max(0, Math.floor(input.reintentosRealizados));

  // Un envío exitoso finaliza el proceso sin sumar reintentos ni registrar errores.
  if (input.resultadoEnvio === 'exitoso') {
    return {
      nuevoEstado: 'enviada',
      reintentosActualizados: reintentosNormalizados,
      informacionError: null,
    };
  }

  // Si el envío no fue exitoso y aún quedan intentos, incrementa el contador para reintentarlo.
  if (reintentosNormalizados < MAX_REINTENTOS_NOTIFICACION_AUTOMATICA) {
    return {
      nuevoEstado: 'reintentada',
      reintentosActualizados: reintentosNormalizados + 1,
      informacionError: null,
    };
  }

  // Al alcanzar el límite, usa la fecha recibida o la fecha actual como momento del fallo.
  const fechaHoraFallo = input.fechaHoraFallo ?? new Date();

  // Separa la fecha y la hora UTC en el formato que espera la información del error.
  const [fecha, horaConZona] = fechaHoraFallo.toISOString().split('T');
  const hora = horaConZona.replace('Z', '').slice(0, 8);

  // Devuelve el fallo definitivo, conserva el contador en el máximo y registra su detalle.
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
