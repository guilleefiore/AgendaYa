import { filtrarPlantillas } from './logic';

describe('US_03_M06 - Lógica de Búsqueda y Filtrado', () => {
  const mockPlantillas = [
    { id: 1, titulo: 'Recordatorio de turno', descripcion: 'Aviso 24hs antes', categoria: 'Recordatorio', estado: 'Activas' },
    { id: 2, titulo: 'Bienvenida paciente', descripcion: 'Mensaje inicial', categoria: 'Bienvenida', estado: 'Activas' },
    { id: 3, titulo: 'Falta de pago', descripcion: 'Recordatorio de saldo', categoria: 'Recordatorio', estado: 'Inactivas' }
  ];

  // Test para verificar que se filtre correctamente por coincidencia de texto parcial en título o descripción
  it('debe filtrar por coincidencia de texto parcial en título o descripción', () => {
    
    const filtros = { texto: 'recordatorio', categoria: '', estado: '' };
    
    
    const resultado = filtrarPlantillas(mockPlantillas, filtros);
    
    
    expect(resultado).toHaveLength(2);
    expect(resultado[0].id).toBe(1);
    expect(resultado[1].id).toBe(3);
  });

    // Test para verificar que se filtre correctamente por categoría y estado
  it('debe devolver un arreglo vacío si los filtros acumulativos no arrojan resultados', () => {
    
    const filtros = { texto: '', categoria: 'Bienvenida', estado: 'Inactivas' };
    
    const resultado = filtrarPlantillas(mockPlantillas, filtros);
    
    expect(resultado).toHaveLength(0);
    expect(resultado).toEqual([]);
  });
});