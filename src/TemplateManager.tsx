import { useState } from 'react';
import { obtenerErroresFormularioPlantilla, copiarTextoPlantilla } from './tests/camila/logic';
import { actualizarSeleccionEvento, esEventoSeleccionado } from './tests/julian/logic';
import { crearDatosNotificacionAutomatica, esEmailAdministradorValido } from './tests/juanpablo/logic';

interface NotificationSettings {
  adminEmail: string;
  patientName: string;
  appointmentDay: string;
  appointmentTime: string;
  professionalName: string;
}

export default function TemplateManager({ 
  textoPlantilla = '',
  eventos = [],
  onEventSelect,
  adminEmail = '',
  onSendNotification,
}: { 
  textoPlantilla?: string;
  eventos?: Array<{ id: string; name: string }>;
  onEventSelect?: (eventId: string) => void;
  adminEmail?: string;
  onSendNotification?: (notification: NotificationSettings) => Promise<boolean>;
}) {
  // Estados para simular el formulario (Prueba 1)
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [errores, setErrores] = useState({ titulo: false, categoria: false, descripcion: false });

  // Estados para KAN-33: Selección única de evento
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [continueButtonEnabled, setContinueButtonEnabled] = useState(false);

  // Estados para KAN-85: Notificación al administrador
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);

  // Lógica para el botón Guardar (Prueba 1)
  const handleGuardar = () => {
    setErrores(obtenerErroresFormularioPlantilla({ titulo, categoria, descripcion }));
  };

  // Lógica para el botón Copiar (Pruebas 2 y 3)
  const handleCopiar = async () => {
    await copiarTextoPlantilla(textoPlantilla);
  };

  // Lógica KAN-33: Selección excluyente de evento
  const handleEventSelect = (eventId: string) => {
    const nextSelection = actualizarSeleccionEvento(eventId);
    setSelectedEventId(nextSelection.selectedEventId);
    setContinueButtonEnabled(nextSelection.continueButtonEnabled);
    if (onEventSelect) {
      onEventSelect(eventId);
    }
  };

  // Lógica KAN-85: Envío de notificación
  const handleSendNotification = async (notification: NotificationSettings) => {
    setNotificationStatus(null);
    
    // Validar formato de email
    if (!esEmailAdministradorValido(notification.adminEmail)) {
      setNotificationStatus('error');
      return;
    }

    // Llamar al callback si existe
    if (onSendNotification) {
      const success = await onSendNotification(notification);
      setNotificationStatus(success ? 'success' : 'error');
      return;
    }

    // Por defecto, simular envío exitoso
    setNotificationStatus('success');
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

      {/* --- SECCIÓN KAN-33: SELECCIÓN ÚNICA DE EVENTO --- */}
      <div style={{ marginTop: '20px' }}>
        <h3>Seleccionar Evento</h3>
        <div id="eventos-list">
          {eventos.map((evento) => (
            <button
              key={evento.id}
              onClick={() => handleEventSelect(evento.id)}
              style={{
                marginRight: '10px',
                backgroundColor: esEventoSeleccionado(selectedEventId, evento.id) ? '#4CAF50' : '#f0f0f0',
                color: esEventoSeleccionado(selectedEventId, evento.id) ? 'white' : 'black',
              }}
              className={esEventoSeleccionado(selectedEventId, evento.id) ? 'evento-selected' : ''}
            >
              {evento.name}
            </button>
          ))}
        </div>
        <button 
          onClick={() => {}} 
          disabled={!continueButtonEnabled}
          style={{ marginTop: '10px' }}
        >
          Continuar al calendario
        </button>
      </div>

      {/* --- SECCIÓN KAN-85: NOTIFICACIÓN AL ADMINISTRADOR --- */}
      <div style={{ marginTop: '20px' }}>
        <h3>Enviar Notificación</h3>
        <input 
          placeholder="Email del Administrador" 
          value={adminEmail} 
          readOnly
          style={{ display: 'none' }}
        />
        <button 
          onClick={() => handleSendNotification({
            ...crearDatosNotificacionAutomatica(adminEmail),
          })}
        >
          Enviar Notificación
        </button>
        {notificationStatus === 'success' && <span style={{ color: 'green', marginLeft: '10px' }}>Notificación enviada</span>}
        {notificationStatus === 'error' && <span style={{ color: 'red', marginLeft: '10px' }}>Error en el envío de notificación</span>}
      </div>
    </div>
  );
}
