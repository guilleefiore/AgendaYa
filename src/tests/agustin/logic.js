/**
 * Normaliza una cadena de texto eliminando diacríticos (tildes/acentos)
 * y convirtiendo todo a minúsculas para comparaciones insensibles.
 * @param {string} texto 
 * @returns {string} Texto normalizado
 */
function normalizarTexto(texto) {
  if (typeof texto !== 'string') return '';
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/**
 * Sanitiza y valida la cadena de búsqueda ingresada por el usuario.
 * @param {any} terminoBusqueda 
 * @returns {{ esValido: boolean, terminoLimpio: string }}
 */
export function validarTerminoBusqueda(terminoBusqueda) {
  if (terminoBusqueda === null || terminoBusqueda === undefined || typeof terminoBusqueda !== 'string') {
    return {
      esValido: false,
      terminoLimpio: '',
    };
  }

  const terminoLimpio = terminoBusqueda.trim();

  return {
    esValido: terminoLimpio.length >= 1,
    terminoLimpio,
  };
}

/**
 * Filtra un conjunto de plantillas de forma pura por coincidencia en título o descripción.
 * Si el término es inválido o está en blanco, retorna la lista completa sin alterar los datos originales.
 * 
 * @param {Array<Object>} plantillas - Arreglo de plantillas a evaluar
 * @param {string} terminoBusqueda - Consulta ingresada por el usuario
 * @returns {Array<Object>} Arreglo con las plantillas que coinciden
 */
export function filtrarPlantillasPorTexto(plantillas, terminoBusqueda) {
  if (!Array.isArray(plantillas)) {
    return [];
  }

  const { esValido, terminoLimpio } = validarTerminoBusqueda(terminoBusqueda);

  // Si la búsqueda no contiene caracteres válidos (vacío o solo espacios), preserva la lista completa
  if (!esValido) {
    return plantillas;
  }

  const queryNormalizado = normalizarTexto(terminoLimpio);

  return plantillas.filter((plantilla) => {
    if (!plantilla || typeof plantilla !== 'object') {
      return false;
    }

    const titulo = normalizarTexto(plantilla.title || plantilla.titulo || '');
    const descripcion = normalizarTexto(plantilla.description || plantilla.descripcion || '');

    return titulo.includes(queryNormalizado) || descripcion.includes(queryNormalizado);
  });
}