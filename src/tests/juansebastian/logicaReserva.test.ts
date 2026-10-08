import { validarDatosCliente, validarSlotDisponible } from './logicaReserva';

describe('Pruebas Unitarias - Lógica de Reserva', () => {
  test('Debe rechazar cliente si el nombre está vacío', () => {
    const resultado = validarDatosCliente({
      nombre: '',
      email: 'juan@gmail.com',
    });
    expect(resultado.valido).toBe(false);
  });

  test('Debe aceptar cliente con datos correctos', () => {
    const resultado = validarDatosCliente({
      nombre: 'Juan Zalazar',
      email: 'juan@gmail.com',
    });
    expect(resultado.valido).toBe(true);
  });
});
