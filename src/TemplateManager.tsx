import { useState } from 'react';

export default function TemplateManager({ textoPlantilla = '' }: { textoPlantilla?: string }) {
  // Estados para simular el formulario (Prueba 1)
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [errores, setErrores] = useState({ titulo: false, categoria: false, descripcion: false });

  // Lógica para el botón Guardar (Prueba 1)
  const handleGuardar = () => {
    const nuevosErrores = {
      titulo: titulo.trim() === '',
      categoria: categoria.trim() === '',
      descripcion: descripcion.trim() === '',
    };
    setErrores(nuevosErrores);
  };

  // Lógica para el botón Copiar (Pruebas 2 y 3)
  const handleCopiar = async () => {
    try {
      await navigator.clipboard.writeText(textoPlantilla);
      alert('Copiado en portapapeles SIN INSERCIÓN DE VARIABLES');
    } catch (error) {
      alert('Error. No se pudo copiar al portapapeles');
    }
  };

  return (
    <div>
      {/* --- SECCIÓN PRUEBA 1: FORMULARIO --- */}
      <div>
        <input placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        {errores.titulo && <span style={{ color: 'red' }}>El título es obligatorio</span>}
      </div>

      <div>
        <input placeholder="Categoría" value={categoria} onChange={(e) => setCategoria(e.target.value)} />
        {errores.categoria && <span style={{ color: 'red' }}>La categoría es obligatoria</span>}
      </div>

      <div>
        <textarea placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        {errores.descripcion && <span style={{ color: 'red' }}>La descripción es obligatoria</span>}
      </div>

      <button onClick={handleGuardar}>Guardar</button>

      {/* --- SECCIÓN PRUEBAS 2 Y 3: PORTAPAPELES --- */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleCopiar}>Copiar texto</button>
      </div>
    </div>
  );
}