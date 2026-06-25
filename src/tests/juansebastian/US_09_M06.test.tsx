import { describe, it, expect } from '@jest/globals';
import {
  generarVistaPrevia,
  validarVariablesMensaje,
  validarLimiteCanal
} from './logic';

describe('Pruebas Unitarias - US_09_M06: Editar y personalizar plantilla', () => {

  // PRUEBA 1: VISTA PREVIA
  it('debe reemplazar correctamente las variables dinámicas por datos reales de ejemplo en la vista previa', () => {
    const plantilla = 'Hola [Nombre_Cliente], tu turno con [Nombre_Profesional] está confirmado para el [Fecha_Turno].';

    const vistaPrevia = generarVistaPrevia(plantilla);

    expect(vistaPrevia).toBe('Hola Juan, tu turno con Dra. María González está confirmado para el 25/06/2026.');
  });

  //  PRUEBA 2: VALIDACIÓN DE VARIABLES INCORRECTAS
  it('debe detectar variables escritas a mano que no existen o están mal formadas', () => {
    const plantillaConErrores = 'Estimado [Nombre_Cliente], su [Nombre_Truno] ha sido agendado. Contactar a [Variable_Inexistente].';

    const resultadoValidacion = validarVariablesMensaje(plantillaConErrores);

    expect(resultadoValidacion.valido).toBe(false);
    expect(resultadoValidacion.errores).toContain('Variable no reconocida: [Nombre_Truno]');
    expect(resultadoValidacion.errores).toContain('Variable no reconocida: [Variable_Inexistente]');
  });

  // PRUEBA 3: ADVERTENCIA DE LÍMITE DE CARACTERES PARA WHATSAPP 
  it('debe lanzar una advertencia si el texto excede los 160 caracteres en el canal WhatsApp', () => {
    // Un texto largo de más de 160 caracteres (unificado usando template literals)
    const textoLargo = `Hola [Nombre_Cliente], te escribimos para recordarte que tu cita con [Nombre_Profesional] en la dirección [Direccion_Local]
      está programada para el [Fecha_Turno] a las [Hora_Turno]. Por favor, asiste con 15 minutos de anticipación y trae tu documento de identidad para
      agilizar el ingreso.`;

    const resultadoWhatsApp = validarLimiteCanal(textoLargo, 'WhatsApp');
    expect(resultadoWhatsApp.valido).toBe(false);
    expect(resultadoWhatsApp.advertencia).toBe('El mensaje supera el límite recomendado de 160 caracteres para WhatsApp.');

    const resultadoEmail = validarLimiteCanal(textoLargo, 'Email');
    expect(resultadoEmail.valido).toBe(true);
    expect(resultadoEmail.advertencia).toBeNull();
  });

});