import { determinarEstadoNotificacionAutomatica } from './logic';

describe('Guillermina - US_04_M06, US_05_M06 y US_06_M06', () => {
  describe('US_04_M06 - Detectar fallos en el envío', () => {
    // Comprueba que un envío exitoso no active el mecanismo de reintentos.
    it('si el envío inicial es exitoso, la notificación queda enviada sin reintentos', () => {
      // Preparación y ejecución: se procesa una notificación pendiente cuyo primer envío fue exitoso.
      const resultado = determinarEstadoNotificacionAutomatica({
        estadoActual: 'pendiente',
        reintentosRealizados: 0,
        resultadoEnvio: 'exitoso',
      });

      // Verificación: cambia a enviada, no suma reintentos y no registra errores.
      expect(resultado).toEqual({
        nuevoEstado: 'enviada',
        reintentosActualizados: 0,
        informacionError: null,
      });
    });

    // Comprueba que la falta de confirmación de entrega también sea tratada como un fallo.
    it('si no se recibe confirmación de entrega, la notificación queda pendiente de reintento', () => {
      // Preparación y ejecución: el proveedor no confirma que la notificación haya sido entregada.
      const resultado = determinarEstadoNotificacionAutomatica({
        estadoActual: 'pendiente',
        reintentosRealizados: 0,
        resultadoEnvio: 'sin_confirmacion',
        tipoError: 'sin_confirmacion_entrega',
      });

      // Verificación: se programa el primer reintento en lugar de marcarla como enviada.
      expect(resultado).toEqual({
        nuevoEstado: 'reintentada',
        reintentosActualizados: 1,
        informacionError: null,
      });
    });
  });

  describe('US_05_M06 - Reintentar notificaciones fallidas', () => {
    // Comprueba un fallo recuperable: todavía se puede volver a intentar el envío.
    it('si el envío falla y todavía hay reintentos disponibles, aumenta el contador', () => {
      // Preparación y ejecución: se procesa un fallo con un solo reintento realizado.
      const resultado = determinarEstadoNotificacionAutomatica({
        estadoActual: 'pendiente',
        reintentosRealizados: 1,
        resultadoEnvio: 'fallido',
        tipoError: 'timeout',
      });

      // Verificación: queda lista para reintentar, el contador aumenta y aún no se registra un error definitivo.
      expect(resultado).toEqual({
        nuevoEstado: 'reintentada',
        reintentosActualizados: 2,
        informacionError: null,
      });
    });

    // Comprueba CP-003-M06: el primer reintento funciona y no se programan más intentos.
    it('si un reintento es exitoso, la notificación queda enviada y conserva el contador', () => {
      // Preparación y ejecución: se procesa con éxito una notificación que ya había fallado una vez.
      const resultado = determinarEstadoNotificacionAutomatica({
        estadoActual: 'reintentada',
        reintentosRealizados: 1,
        resultadoEnvio: 'exitoso',
      });

      // Verificación: finaliza enviada y no agrega otro reintento ni información de error.
      expect(resultado).toEqual({
        nuevoEstado: 'enviada',
        reintentosActualizados: 1,
        informacionError: null,
      });
    });
  });

  describe('US_06_M06 - Marcar como fallida al agotar reintentos', () => {
    // Comprueba CP-004-M06: ya no quedan reintentos disponibles.
    it('si ya se alcanzaron los 3 reintentos, queda fallida y registra el error', () => {
      // Preparación y ejecución: se procesa otro fallo luego de alcanzar el máximo de reintentos.
      const resultado = determinarEstadoNotificacionAutomatica({
        estadoActual: 'reintentada',
        reintentosRealizados: 3,
        resultadoEnvio: 'fallido',
        tipoError: 'conexion',
        fechaHoraFallo: new Date('2026-06-23T10:15:30Z'),
      });

      // Verificación: queda fallida y guarda el tipo, la fecha y la hora exacta del error.
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

    // Comprueba que un dato inconsistente nunca haga superar el máximo definido por la historia.
    it('si el contador recibido supera el máximo, permanece limitado a 3 y queda fallida', () => {
      // Preparación y ejecución: se recibe un cuarto reintento fallido por un error de entrega.
      const resultado = determinarEstadoNotificacionAutomatica({
        estadoActual: 'reintentada',
        reintentosRealizados: 4,
        resultadoEnvio: 'fallido',
        tipoError: 'entrega',
        fechaHoraFallo: new Date('2026-06-23T10:20:00Z'),
      });

      // Verificación: el contador se limita a 3 y se conserva la información del fallo definitivo.
      expect(resultado).toEqual({
        nuevoEstado: 'fallida',
        reintentosActualizados: 3,
        informacionError: {
          tipoFallo: 'entrega',
          fecha: '2026-06-23',
          hora: '10:20:00',
        },
      });
    });

    // Comprueba que un fallo definitivo no pueda convertirse posteriormente en un envío exitoso.
    it('si la notificación ya está fallida, un nuevo procesamiento conserva el estado final', () => {
      const informacionError = {
        tipoFallo: 'conexion',
        fecha: '2026-06-23',
        hora: '10:15:30',
      };

      const resultado = determinarEstadoNotificacionAutomatica({
        estadoActual: 'fallida',
        reintentosRealizados: 3,
        resultadoEnvio: 'exitoso',
        informacionError,
      });

      expect(resultado).toEqual({
        nuevoEstado: 'fallida',
        reintentosActualizados: 3,
        informacionError,
      });
    });

    // Comprueba que una notificación enviada tampoco vuelva al circuito de reintentos.
    it('si la notificación ya está enviada, un fallo posterior no modifica su estado', () => {
      const resultado = determinarEstadoNotificacionAutomatica({
        estadoActual: 'enviada',
        reintentosRealizados: 1,
        resultadoEnvio: 'fallido',
        tipoError: 'conexion',
      });

      expect(resultado).toEqual({
        nuevoEstado: 'enviada',
        reintentosActualizados: 1,
        informacionError: null,
      });
    });
  });
});
