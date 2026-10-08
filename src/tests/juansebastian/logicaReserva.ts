// src/tests/juansebastian/logicaReserva.ts

export interface DatosCliente {
  nombre: string;
  email: string;
  telefono?: string;
}

export interface Slot {
  id: string;
  hora: string;
  disponible: boolean;
}

// Validar datos personales del cliente (Evita campos vacíos y formato de correo inválido)
export function validarDatosCliente(datos: DatosCliente): {
  valido: boolean;
  mensaje: string;
} {
  if (!datos.nombre || datos.nombre.trim() === '') {
    return { valido: false, mensaje: 'El nombre completo es obligatorio.' };
  }
  if (!datos.email || datos.email.trim() === '') {
    return { valido: false, mensaje: 'El correo electrónico es obligatorio.' };
  }
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(datos.email)) {
    return { valido: false, mensaje: 'Ingrese un correo electrónico válido.' };
  }
  return { valido: true, mensaje: '' };
}

// Verificar disponibilidad del turno/slot seleccionado
export function validarSlotDisponible(slot: Slot | null): {
  valido: boolean;
  mensaje: string;
} {
  if (!slot) {
    return { valido: false, mensaje: 'Debe seleccionar un horario.' };
  }
  if (!slot.disponible) {
    return {
      valido: false,
      mensaje: 'Este horario ya fue reservado. Por favor elegí otro.',
    };
  }
  return { valido: true, mensaje: '' };
}
