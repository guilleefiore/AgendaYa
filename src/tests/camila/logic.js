// Función para obtener los errores del formulario de creación de plantillas
export function obtenerErroresFormularioPlantilla({ titulo, categoria, descripcion }) {
  return {
    titulo: titulo.trim() === '',
    categoria: categoria.trim() === '',
    descripcion: descripcion.trim() === '',
  };
}

// Función para copiar texto al portapapeles y mostrar alertas según el resultado
export async function copiarTextoPlantilla(textoPlantilla) {
  try {
    await navigator.clipboard.writeText(textoPlantilla);
    alert('Copiado en portapapeles SIN INSERCIÓN DE VARIABLES');
  } catch {
    alert('Error. No se pudo copiar al portapapeles');
  }
}

// Función para filtrar plantillas según los filtros proporcionados
export function filtrarPlantillas(plantillas, filtros) {
  return plantillas.filter(plantilla => {
    // Escenario 1: Coincidencia en título o descripción
    const cumpleTexto = !filtros.texto || 
      plantilla.titulo.toLowerCase().includes(filtros.texto.toLowerCase()) || 
      plantilla.descripcion.toLowerCase().includes(filtros.texto.toLowerCase());
      
    // Escenario 2: Filtros acumulativos
    const cumpleCategoria = !filtros.categoria || plantilla.categoria === filtros.categoria;
    const cumpleEstado = !filtros.estado || plantilla.estado === filtros.estado;

    // Retorna true solo si cumple TODAS las condiciones (AND lógico)
    return cumpleTexto && cumpleCategoria && cumpleEstado;
  });
}