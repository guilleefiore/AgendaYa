export function generarVistaPrevia(plantilla) {
  return plantilla
    .replace('[Nombre_Cliente]', 'Juan')
    .replace('[Nombre_Profesional]', 'Dra. María González')
    .replace('[Fecha_Turno]', '25/06/2026');
}

export function validarVariablesMensaje(plantilla) {
  const variablesValidas = ['[Nombre_Cliente]', '[Nombre_Profesional]', '[Fecha_Turno]', '[Hora_Turno]', '[Direccion_Local]'];
  const regex = /\[.*?\]/g;
  const encontradas = plantilla.match(regex) || [];
  
  const errores = [];
  for (const v of encontradas) {
    if (!variablesValidas.includes(v)) {
      errores.push(`Variable no reconocida: ${v}`);
    }
  }
  
  return {
    valido: errores.length === 0,
    errores
  };
}

export function validarLimiteCanal(texto, canal) {
  if (canal === 'WhatsApp' && texto.length > 160) {
    return {
      valido: false,
      advertencia: 'El mensaje supera el límite recomendado de 160 caracteres para WhatsApp.'
    };
  }
  return {
    valido: true,
    advertencia: null
  };
}
