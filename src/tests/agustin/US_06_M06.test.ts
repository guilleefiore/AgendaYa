import { filtrarPlantillasPorTexto, validarTerminoBusqueda } from './logic';

describe('US_06_M06 / M06-R14F - Lógica de Búsqueda y Filtrado de Plantillas (Agustín Aguilera)', () => {
  // Set de datos representativo con casos reales de AgendaYA
  const mockPlantillas = [
    {
      id: 1,
      title: 'Bienvenida Standard',
      category: 'Bienvenida',
      description: 'Mensaje inicial de presentación para nuevos pacientes',
    },
    {
      id: 2,
      title: 'Recordatorio 24h',
      category: 'Recordatorio',
      description: 'Aviso 24 horas antes del turno médico programado',
    },
    {
      id: 3,
      title: 'Cancelación de Turno',
      category: 'Cancelación',
      description: 'Notificación inmediata enviada al liberarse el horario reservado',
    },
  ];

  // Test 1: Caso normal - Coincidencia en título
  it('Test 1 (Normal): debe filtrar correctamente por coincidencia parcial en el título', () => {
    const resultado = filtrarPlantillasPorTexto(mockPlantillas, 'Bienvenida');

    expect(resultado).toHaveLength(1);
    expect(resultado[0].id).toBe(1);
    expect(resultado[0].title).toBe('Bienvenida Standard');
  });

  // Test 2: Caso normal - Coincidencia en descripción
  it('Test 2 (Normal): debe filtrar por coincidencia en la descripción aunque el término no esté en el título', () => {
    // 'horario' solo está presente en la descripción de la plantilla con id 3
    const resultado = filtrarPlantillasPorTexto(mockPlantillas, 'horario');

    expect(resultado).toHaveLength(1);
    expect(resultado[0].id).toBe(3);
    expect(resultado[0].title).toBe('Cancelación de Turno');
  });

  // Test 3: Caso borde - Insensibilidad a mayúsculas y acentos diacríticos
  it('Test 3 (Borde): debe ser insensible a mayúsculas, minúsculas y tildes', () => {
    // Búsqueda en mayúsculas sin tilde
    const busquedaMayusculaSinTilde = filtrarPlantillasPorTexto(mockPlantillas, 'CANCELACION');
    // Búsqueda en minúsculas con tilde inversa o estándar
    const busquedaMinusculaConTilde = filtrarPlantillasPorTexto(mockPlantillas, 'cancelación');

    expect(busquedaMayusculaSinTilde).toHaveLength(1);
    expect(busquedaMayusculaSinTilde[0].id).toBe(3);

    expect(busquedaMinusculaConTilde).toHaveLength(1);
    expect(busquedaMinusculaConTilde[0].id).toBe(3);
  });

  // Test 4: Caso límite - Búsqueda sin coincidencias
  it('Test 4 (Límite): debe retornar un arreglo vacío sin arrojar errores cuando no hay coincidencias', () => {
    const resultado = filtrarPlantillasPorTexto(mockPlantillas, 'xyz123');

    expect(resultado).toHaveLength(0);
    expect(resultado).toEqual([]);
  });

  // Test 5: Caso de error / Sanitización y resiliencia de datos
  it('Test 5 (Error/Sanitización): debe sanitizar entradas inválidas o vacías y preservar la lista íntegra', () => {
    // 1. Validación aislada de la función sanitizadora
    expect(validarTerminoBusqueda(null)).toEqual({ esValido: false, terminoLimpio: '' });
    expect(validarTerminoBusqueda(undefined)).toEqual({ esValido: false, terminoLimpio: '' });
    expect(validarTerminoBusqueda('   ')).toEqual({ esValido: false, terminoLimpio: '' });
    expect(validarTerminoBusqueda('  Turno  ')).toEqual({ esValido: true, terminoLimpio: 'Turno' });

    // 2. Comportamiento seguro de filtrado ante valores no válidos
    const resEspacios = filtrarPlantillasPorTexto(mockPlantillas, '    ');
    const resNull = filtrarPlantillasPorTexto(mockPlantillas, null as unknown as string);
    const resUndefined = filtrarPlantillasPorTexto(mockPlantillas, undefined as unknown as string);

    // No debe colapsar y debe devolver el conjunto original de plantillas
    expect(resEspacios).toHaveLength(3);
    expect(resNull).toHaveLength(3);
    expect(resUndefined).toHaveLength(3);
  });
});