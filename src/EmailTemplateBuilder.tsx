"use client";
import React, { useState, useRef } from 'react';
import { obtenerErroresFormularioPlantilla } from './tests/camila/logic';
import { generarVistaPrevia, validarVariablesMensaje } from './tests/juansebastian/logic';

const initialTemplates = [
  { id: 1, title: 'Bienvenida Standard', category: 'Bienvenida', description: 'Para pacientes nuevos' },
  { id: 2, title: 'Recordatorio 24h', category: 'Recordatorio', description: 'Aviso 24hs antes del turno' },
];

export default function EmailTemplateBuilder() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [message, setMessage] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [errorObj, setErrorObj] = useState<any>({});
  const [varErrors, setVarErrors] = useState<string[]>([]);
  const [preview, setPreview] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const variables = [
    { label: 'Nombre Cliente', value: '[Nombre_Cliente]', cy: 'var-nombre-cliente' },
    { label: 'Fecha Turno', value: '[Fecha_Turno]', cy: 'var-fecha-turno' },
    { label: 'Hora Turno', value: '[Hora_Turno]', cy: 'var-hora-turno' },
    { label: 'Nombre Admin', value: '[Nombre_Profesional]', cy: 'var-nombre-admin' },
  ];

  const handleInsertVariable = (variableValue: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const newBody = body.substring(0, start) + variableValue + body.substring(end);
    setBody(newBody);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + variableValue.length;
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleSave = () => {
    setMessage('');
    
    // Lógica Camila: Validación
    const errores = obtenerErroresFormularioPlantilla({ titulo: title, categoria: category, descripcion: description });
    setErrorObj(errores);
    
    // Lógica Juanse: Validación de variables
    const valVars = validarVariablesMensaje(body);
    setVarErrors(valVars.errores);

    if (errores.titulo || errores.categoria || errores.descripcion || !valVars.valido || body.trim() === '') {
      return; // Stop if errors
    }

    setMessage('Plantilla guardada exitosamente.');
    setTitle(''); setCategory(''); setDescription(''); setBody(''); setPreview('');
  };

  const handlePreview = () => {
    // Lógica Juanse: Vista Previa
    setPreview(generarVistaPrevia(body));
  };

  // Lógica Agustín: Búsqueda dinámica
  const filteredTemplates = initialTemplates.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '8px' }}>
      <h2>Gestión de Plantillas (M06)</h2>
      
      {/* BÚSQUEDA (Agustín) */}
      <div style={{ padding: '15px', background: '#f5f5f5', marginBottom: '20px', borderRadius: '4px' }}>
        <h3 style={{ marginTop: 0 }}>Listado de Plantillas</h3>
        <input 
          placeholder="Buscar por Título o Descripción (Agustín)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <ul>
          {filteredTemplates.map(t => (
            <li key={t.id}><strong>{t.title}</strong> - {t.description} ({t.category})</li>
          ))}
          {filteredTemplates.length === 0 && <li>No se encontraron plantillas.</li>}
        </ul>
      </div>

      <hr style={{ margin: '20px 0' }}/>

      {/* ALTA/EDICIÓN */}
      <h3 data-cy="template-builder-title">Crear Nueva Plantilla</h3>
      {message && <div data-cy="success-message" style={{ color: 'green', marginBottom: '10px' }}>{message}</div>}

      <div style={{ marginBottom: '10px' }}>
        <label>Título (Único):</label>
        <input data-cy="template-title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '8px' }} />
        {errorObj.titulo && <span data-cy="error-message" style={{ color: 'red' }}>El título es obligatorio</span>}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Categoría:</label>
        <select data-cy="template-category" value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '8px' }}>
          <option value="">Seleccione...</option>
          <option value="Bienvenida">Bienvenida</option>
          <option value="Recordatorio">Recordatorio</option>
        </select>
        {errorObj.categoria && <span style={{ color: 'red' }}>La categoría es obligatoria</span>}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Descripción:</label>
        <input data-cy="template-description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '8px' }} />
        {errorObj.descripcion && <span style={{ color: 'red' }}>La descripción es obligatoria</span>}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Variables Dinámicas:</label>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '10px' }}>
          {variables.map((v) => (
            <button key={v.value} data-cy={v.cy} onClick={() => handleInsertVariable(v.value)} style={{ padding: '5px 10px', background: '#e0e0e0', border: '1px solid #ccc', borderRadius: '4px' }}>
              {v.label}
            </button>
          ))}
        </div>
        
        <textarea data-cy="template-body" ref={textareaRef} value={body} onChange={(e) => setBody(e.target.value)} style={{ width: '100%', height: '100px', padding: '8px' }} />
        {varErrors.length > 0 && <div style={{ color: 'red' }}>{varErrors.join(', ')}</div>}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={handlePreview} style={{ padding: '10px', background: '#ccc', borderRadius: '4px' }}>Generar Vista Previa</button>
        <button data-cy="save-template" onClick={handleSave} style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>Guardar Plantilla</button>
      </div>

      {preview && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#e8f4f8', border: '1px solid #b3d4fc', borderRadius: '4px' }}>
          <h4>Vista Previa Generada (Juanse)</h4>
          <p>{preview}</p>
        </div>
      )}
    </div>
  );
}
