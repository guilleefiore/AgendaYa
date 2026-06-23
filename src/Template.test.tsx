import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TemplateManager from './TemplateManager';

describe('US_01 y US_10 - Gestión y Copiado de Plantillas', () => {

  // Limpiamos los mocks después de cada prueba
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // --- PRUEBA 1: US_01_M06 - Escenario 3 ---
  it('debe impedir el guardado y mostrar error si hay campos obligatorios vacíos', () => {
    render(<TemplateManager />);
    
    // Simulamos que el usuario hace clic en "Guardar" sin llenar nada
    const btnGuardar = screen.getByRole('button', { name: /Guardar/i });
    fireEvent.click(btnGuardar);

    // Verificamos que aparezcan los mensajes de error
    const errorTitulo = screen.getByText(/El título es obligatorio/i);
    const errorCategoria = screen.getByText(/La categoría es obligatoria/i);
    const errorDescripcion = screen.getByText(/La descripción es obligatoria/i);

    expect(errorTitulo).toBeInTheDocument();
    expect(errorCategoria).toBeInTheDocument();
    expect(errorDescripcion).toBeInTheDocument();
  });

  // --- PRUEBA 2: US_10_M06 - Escenario 1 ---
  it('debe copiar al portapapeles el texto en crudo y mostrar confirmación', async () => {
    render(<TemplateManager textoPlantilla="Hola [Nombre_Cliente]" />);
    
    // Mockeamos la API del portapapeles para que simule éxito
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
    // Mockeamos el alert/pop-up
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();

    // Simulamos el clic en copiar
    const btnCopiar = screen.getByRole('button', { name: /Copiar texto/i });
    fireEvent.click(btnCopiar);

    await waitFor(() => {
      // Verificamos que se haya copiado el texto EXACTO con los corchetes
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Hola [Nombre_Cliente]');
      // Verificamos el mensaje de éxito exacto pedido en la US
      expect(alertMock).toHaveBeenCalledWith('Copiado en portapapeles SIN INSERCIÓN DE VARIABLES');
    });
  });

  // --- PRUEBA 3: US_10_M06 - Escenario 2 ---
  it('debe mostrar error exacto si el acceso al portapapeles falla', async () => {
    render(<TemplateManager textoPlantilla="Hola [Nombre_Cliente]" />);
    
    // Mockeamos la API del portapapeles para que simule una falla
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockRejectedValue(new Error('Permiso denegado')),
      },
    });
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();

    // Simulamos el clic
    const btnCopiar = screen.getByRole('button', { name: /Copiar texto/i });
    fireEvent.click(btnCopiar);

    await waitFor(() => {
      // Verificamos el mensaje de error exacto pedido en la US
      expect(alertMock).toHaveBeenCalledWith('Error. No se pudo copiar al portapapeles');
    });
  });

});

describe('KAN-33 (US_02_M04) - Selección Única de Evento', () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // --- PRUEBA 4: KAN-33 - Escenario 1 - Selección Excluyente ---
  it('debe desmarcar el evento anterior cuando se selecciona un nuevo evento', () => {
    const mockEventSelect = jest.fn();
    const eventos = [
      { id: 'evento-a', name: 'Evento A' },
      { id: 'evento-b', name: 'Evento B' },
    ];

    const { rerender } = render(
      <TemplateManager eventos={eventos} onEventSelect={mockEventSelect} />
    );

    // Simulamos la selección del Evento A
    const botonesEventos = screen.getAllByRole('button');
    const btnEventoA = botonesEventos.find((btn: HTMLElement) => btn.textContent === 'Evento A');
    fireEvent.click(btnEventoA!);

    expect(mockEventSelect).toHaveBeenCalledWith('evento-a');

    // Simulamos la selección del Evento B
    rerender(
      <TemplateManager eventos={eventos} onEventSelect={mockEventSelect} />
    );

    const botonesEventosActualizados = screen.getAllByRole('button');
    const btnEventoB = botonesEventosActualizados.find((btn: HTMLElement) => btn.textContent === 'Evento B');
    fireEvent.click(btnEventoB!);

    expect(mockEventSelect).toHaveBeenCalledWith('evento-b');
    expect(mockEventSelect).toHaveBeenCalledTimes(2);
  });

  // --- PRUEBA 5: KAN-33 - Escenario 2 - Habilitación de Flujo ---
  it('debe habilitar el botón "Continuar al calendario" cuando se selecciona un evento', () => {
    const eventos = [
      { id: 'evento-a', name: 'Evento A' },
    ];

    render(<TemplateManager eventos={eventos} />);

    // Verificamos que el botón está inicialmente deshabilitado
    const btnContinuar = screen.getByRole('button', { name: /Continuar al calendario/i });
    expect(btnContinuar).toBeDisabled();

    // Simulamos la selección del evento
    const botonesEventos = screen.getAllByRole('button');
    const btnEventoA = botonesEventos.find(btn => btn.textContent === 'Evento A');
    fireEvent.click(btnEventoA!);

    // Verificamos que el botón está habilitado
    expect(btnContinuar).not.toBeDisabled();
  });

  // --- PRUEBA 6: KAN-33 - Escenario 3 - Resaltado Visual del Evento Seleccionado ---
  it('debe resaltar visualmente el evento seleccionado', () => {
    const eventos = [
      { id: 'evento-a', name: 'Evento A' },
      { id: 'evento-b', name: 'Evento B' },
    ];

    render(<TemplateManager eventos={eventos} />);

    const botonesEventos = screen.getAllByRole('button');
    const btnEventoA = botonesEventos.find((btn: HTMLElement) => btn.textContent === 'Evento A');

    // Simulamos la selección
    fireEvent.click(btnEventoA!);

    // Verificamos que el botón tiene la clase de selección
    expect(btnEventoA).toHaveClass('evento-selected');

    // Verificamos el estilo de fondo
    const computedStyle = window.getComputedStyle(btnEventoA!);
    // Nota: el estilo está en el atributo style del elemento
    expect(btnEventoA).toHaveStyle({ backgroundColor: '#4CAF50' });
  });

});

describe('KAN-85 (US_13_M06) - Envío Automático de Notificación al Administrador', () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // --- PRUEBA 7: KAN-85 - Escenario 1 - Envío Exitoso ---
  it('debe enviar notificación exitosa con datos del paciente, día, horario y profesional', async () => {
    const mockSendNotification = jest.fn().mockResolvedValue(true);
    
    const { container } = render(
      <TemplateManager 
        adminEmail="admin@hospital.com"
        onSendNotification={mockSendNotification}
      />
    );

    const btnEnviar = screen.getByRole('button', { name: /Enviar Notificación/i });
    fireEvent.click(btnEnviar);

    await waitFor(() => {
      expect(mockSendNotification).toHaveBeenCalled();
      const notificationData = mockSendNotification.mock.calls[0][0];
      
      expect(notificationData).toEqual({
        adminEmail: 'admin@hospital.com',
        patientName: 'Juan Pérez',
        appointmentDay: '2026-06-25',
        appointmentTime: '14:30',
        professionalName: 'Dr. García',
      });

      const successMessage = screen.getByText(/Notificación enviada/i);
      expect(successMessage).toBeInTheDocument();
      expect(successMessage).toHaveStyle({ color: 'green' });
    });
  });

  // --- PRUEBA 8: KAN-85 - Escenario 2 - Envío Fallido por Email Inválido ---
  it('debe cancelar el envío y mostrar error si el email del administrador es inválido', async () => {
    const mockSendNotification = jest.fn();

    render(
      <TemplateManager 
        adminEmail="email-invalido-sin-dominio"
        onSendNotification={mockSendNotification}
      />
    );

    const btnEnviar = screen.getByRole('button', { name: /Enviar Notificación/i });
    fireEvent.click(btnEnviar);

    await waitFor(() => {
      // El callback no debe ser llamado si el email es inválido
      expect(mockSendNotification).not.toHaveBeenCalled();

      const errorMessage = screen.getByText(/Error en el envío de notificación/i);
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveStyle({ color: 'red' });
    });
  });

  // --- PRUEBA 9: KAN-85 - Escenario 3 - Registro de Error en Panel de Control ---
  it('debe registrar alerta de error cuando el envío de notificación falla', async () => {
    const mockSendNotification = jest.fn().mockResolvedValue(false);

    render(
      <TemplateManager 
        adminEmail="admin@hospital.com"
        onSendNotification={mockSendNotification}
      />
    );

    const btnEnviar = screen.getByRole('button', { name: /Enviar Notificación/i });
    fireEvent.click(btnEnviar);

    await waitFor(() => {
      expect(mockSendNotification).toHaveBeenCalled();

      const errorMessage = screen.getByText(/Error en el envío de notificación/i);
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveStyle({ color: 'red' });
    });
  });

});