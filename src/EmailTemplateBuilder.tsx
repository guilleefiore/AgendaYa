"use client";
import React, { useState, useRef } from 'react';

export default function EmailTemplateBuilder() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const variables = [
    { label: 'Nombre Cliente', value: '{{[Nombre_Cliente]}}', cy: 'var-nombre-cliente' },
    { label: 'Fecha Turno', value: '{{[Fecha_Turno]}}', cy: 'var-fecha-turno' },
    { label: 'Hora Turno', value: '{{[Hora_Turno]}}', cy: 'var-hora-turno' },
    { label: 'Nombre Admin', value: '{{[Nombre_Admin]}}', cy: 'var-nombre-admin' },
    { label: 'Nombre Evento', value: '{{[Nombre_Evento]}}', cy: 'var-nombre-evento' },
    { label: 'Enlace Agenda', value: '{{[Enlace_Agenda]}}', cy: 'var-enlace-agenda' }
  ];

  const handleInsertVariable = (variableValue: string) => {
    if (!textareaRef.current) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    
    const newBody = body.substring(0, start) + variableValue + body.substring(end);
    setBody(newBody);
    
    // Move cursor after inserted variable
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + variableValue.length;
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleSave = () => {
    setError('');
    setMessage('');

    if (!title) {
      setError('El título es obligatorio.');
      return;
    }
    if (!category) {
      setError('La categoría es obligatoria.');
      return;
    }
    if (!description) {
      setError('La descripción es obligatoria.');
      return;
    }
    if (!body) {
      setError('El cuerpo del mensaje es obligatorio.');
      return;
    }

    // Simulamos el guardado
    setMessage('Plantilla guardada exitosamente.');
    setTitle('');
    setCategory('');
    setDescription('');
    setBody('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 data-cy="template-builder-title">Configurar Plantilla de Email</h2>
      
      {error && <div data-cy="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      {message && <div data-cy="success-message" style={{ color: 'green', marginBottom: '10px' }}>{message}</div>}

      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block' }}>Título (Único):</label>
        <input 
          data-cy="template-title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          style={{ width: '100%', padding: '8px' }} 
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block' }}>Categoría:</label>
        <select 
          data-cy="template-category" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        >
          <option value="">Seleccione una categoría</option>
          <option value="Bienvenida">Bienvenida</option>
          <option value="Recordatorio">Recordatorio</option>
          <option value="Cancelación">Cancelación</option>
          <option value="Agradecimiento">Agradecimiento</option>
        </select>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block' }}>Descripción:</label>
        <input 
          data-cy="template-description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          style={{ width: '100%', padding: '8px' }} 
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block' }}>Variables Dinámicas:</label>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '10px' }}>
          {variables.map((v) => (
            <button 
              key={v.value} 
              data-cy={v.cy} 
              onClick={() => handleInsertVariable(v.value)}
              style={{ padding: '5px 10px', cursor: 'pointer', background: '#e0e0e0', border: '1px solid #ccc', borderRadius: '4px' }}
            >
              {v.label}
            </button>
          ))}
        </div>
        
        <label style={{ display: 'block' }}>Cuerpo del Mensaje:</label>
        <textarea 
          data-cy="template-body" 
          ref={textareaRef}
          value={body} 
          onChange={(e) => setBody(e.target.value)} 
          style={{ width: '100%', height: '150px', padding: '8px' }} 
        />
      </div>

      <button 
        data-cy="save-template" 
        onClick={handleSave}
        style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Guardar Plantilla
      </button>
    </div>
  );
}
