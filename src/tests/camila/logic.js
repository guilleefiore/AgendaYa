export function obtenerErroresFormularioPlantilla({ titulo, categoria, descripcion }) {
  return {
    titulo: titulo.trim() === '',
    categoria: categoria.trim() === '',
    descripcion: descripcion.trim() === '',
  };
}

export async function copiarTextoPlantilla(textoPlantilla) {
  try {
    await navigator.clipboard.writeText(textoPlantilla);
    alert('Copiado en portapapeles SIN INSERCIÓN DE VARIABLES');
  } catch (error) {
    alert('Error. No se pudo copiar al portapapeles');
  }
}
