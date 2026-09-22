import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TemplateManager from '../../TemplateManager';

describe('Juanpablo - US_13_M06 - Envío Automático de Notificación al Administrador', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debe enviar notificación exitosa con datos del paciente, día, horario y profesional', async () => {
    const mockSendNotification = jest.fn().mockResolvedValue(true);

    render(
      <TemplateManager
        adminEmail="admin@hospital.com"
        onSendNotification={mockSendNotification}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Enviar Notificación/i }));

    await waitFor(() => {
      expect(mockSendNotification).toHaveBeenCalled();
      expect(mockSendNotification.mock.calls[0][0]).toEqual({
        adminEmail: 'admin@hospital.com',
        patientName: 'Juan Pérez',
        appointmentDay: '2026-06-25',
        appointmentTime: '14:30',
        professionalName: 'Dr. García',
      });

      const successMessage = screen.getByText(/Notificación enviada/i);
      expect(successMessage).toBeInTheDocument();
      expect(successMessage).toHaveStyle({ color: 'rgb(0, 128, 0)' });
    });
  });

  it('debe cancelar el envío y mostrar error si el email del administrador es inválido', async () => {
    const mockSendNotification = jest.fn();

    render(
      <TemplateManager
        adminEmail="email-invalido-sin-dominio"
        onSendNotification={mockSendNotification}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Enviar Notificación/i }));

    await waitFor(() => {
      expect(mockSendNotification).not.toHaveBeenCalled();
      const errorMessage = screen.getByText(/Error en el envío de notificación/i);
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    });
  });

  it('debe registrar alerta de error cuando el envío de notificación falla', async () => {
    const mockSendNotification = jest.fn().mockResolvedValue(false);

    render(
      <TemplateManager
        adminEmail="admin@hospital.com"
        onSendNotification={mockSendNotification}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Enviar Notificación/i }));

    await waitFor(() => {
      expect(mockSendNotification).toHaveBeenCalled();

      const errorMessage = screen.getByText(/Error en el envío de notificación/i);
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    });
  });

  it('debe mostrar errores de validación cuando los campos obligatorios están vacíos', async () => {
    render(<TemplateManager />);

    fireEvent.click(screen.getByRole('button', { name: /Guardar/i }));

    await waitFor(() => {
      const tituloError = screen.getByText(/El título es obligatorio/i);
      const categoriaError = screen.getByText(/La categoría es obligatoria/i);
      const descripcionError = screen.getByText(/La descripción es obligatoria/i);

      expect(tituloError).toBeInTheDocument();
      expect(categoriaError).toBeInTheDocument();
      expect(descripcionError).toBeInTheDocument();

      expect(tituloError).toHaveStyle({ color: 'rgb(255, 0, 0)' });
      expect(categoriaError).toHaveStyle({ color: 'rgb(255, 0, 0)' });
      expect(descripcionError).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    });
  });

  it('debe permitir seleccionar un evento y habilitar el botón continuar', async () => {
    const mockOnEventSelect = jest.fn();

    render(
      <TemplateManager
        eventos={[
          { id: 'e1', name: 'Evento 1' },
          { id: 'e2', name: 'Evento 2' },
        ]}
        onEventSelect={mockOnEventSelect}
      />
    );

    const evento1Btn = screen.getByRole('button', { name: /Evento 1/i });

    fireEvent.click(evento1Btn);

    await waitFor(() => {
      const continuarBtn = screen.getByRole('button', { name: /Continuar al calendario/i });
      expect(continuarBtn).toBeEnabled();
      expect(evento1Btn).toHaveClass('evento-selected');
      expect(mockOnEventSelect).toHaveBeenCalledWith('e1');
    });
  });
});
