import { describe, test, expect } from '@jest/globals';
import { procesarReservaAutomática } from './reserva';

describe('Pruebas Unitarias - Confirmación Automática de Reserva (Elena)', () => {
  
  // Test 1: Verifica que si todo está correcto, la reserva se confirme y se envíe el mail
  test('Debería confirmar la reserva automáticamente y enviar el mail si cumple las pre-condiciones', () => {
    const datosReserva = {
      pasosCompletados: true,
      confirmacionAutomatica: true,
      horarioDisponible: true,
      canceOption: true,
      emailInvitado: 'test@usuario.com'
    };

    const resultado = procesarReservaAutomática(datosReserva);

    expect(resultado.estado).toBe('confirmado');
    expect(resultado.mailEnviado).toBe(true);
    expect(resultado.detallesMail).toHaveProperty('fechaYHora');
  });

  // Test 2: Verifica que si el horario NO está disponible, la reserva se rechace
  test('No debería confirmar la reserva si el horario ya no está disponible', () => {
    const datosReserva = {
      pasosCompletados: true,
      confirmacionAutomatica: true,
      horarioDisponible: false, // Horario ocupado
      canceOption: true,
      emailInvitado: 'test@usuario.com'
    };

    const resultado = procesarReservaAutomática(datosReserva);

    expect(resultado.estado).toBe('rechazado');
    expect(resultado.mailEnviado).toBe(false);
  });

  // Test 3: Verifica que falle si la opción "Cance" no está en TRUE
  test('No debería confirmar la reserva si el booleano Cance es FALSE', () => {
    const datosReserva = {
      pasosCompletados: true,
      confirmacionAutomatica: true,
      horarioDisponible: true,
      canceOption: false, // Cance en false provoca el rechazo
      emailInvitado: 'test@usuario.com'
    };

    const resultado = procesarReservaAutomática(datosReserva);

    expect(resultado.estado).toBe('rechazado');
    expect(resultado.mailEnviado).toBe(false);
  });
});