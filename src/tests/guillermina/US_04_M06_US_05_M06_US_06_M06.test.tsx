import { procesarNotificacionAutomaticaM06R07F } from './logic';

describe('Guillermina - US_04_M06, US_05_M06 y US_06_M06', () => {
  it('si el envío es exitoso, la notificación queda en estado enviada', () => {
    const resultado = procesarNotificacionAutomaticaM06R07F({
      estadoActual: 'pendiente',
      reintentosRealizados: 1,
      resultadoEnvio: 'exitoso',
    });

    expect(resultado).toEqual({
      nuevoEstado: 'enviada',
      reintentosActualizados: 1,
      informacionError: null,
    });
  });

  it('si el envío falla y todavía hay reintentos disponibles, la notificación queda en estado reintentada y aumenta el contador', () => {
    const resultado = procesarNotificacionAutomaticaM06R07F({
      estadoActual: 'pendiente',
      reintentosRealizados: 1,
      resultadoEnvio: 'fallido',
      tipoError: 'timeout',
    });

    expect(resultado).toEqual({
      nuevoEstado: 'reintentada',
      reintentosActualizados: 2,
      informacionError: null,
    });
  });

  it('si el envío falla y ya se alcanzaron los 3 reintentos, la notificación queda en estado fallida y registra el error', () => {
    const resultado = procesarNotificacionAutomaticaM06R07F({
      estadoActual: 'reintentada',
      reintentosRealizados: 3,
      resultadoEnvio: 'fallido',
      tipoError: 'conexion',
      fechaHoraFallo: new Date('2026-06-23T10:15:30Z'),
    });

    expect(resultado).toEqual({
      nuevoEstado: 'fallida',
      reintentosActualizados: 3,
      informacionError: {
        tipoFallo: 'conexion',
        fecha: '2026-06-23',
        hora: '10:15:30',
      },
    });
  });
});
