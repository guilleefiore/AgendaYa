import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TemplateManager from '../../TemplateManager';

describe('Camila Bastian - US_01 y US_10 - Gestión y Copiado de Plantillas', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debe impedir el guardado y mostrar error si hay campos obligatorios vacíos', () => {
    render(<TemplateManager />);

    const btnGuardar = screen.getByRole('button', { name: /Guardar/i });
    fireEvent.click(btnGuardar);

    expect(screen.getByText(/El título es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/La categoría es obligatoria/i)).toBeInTheDocument();
    expect(screen.getByText(/La descripción es obligatoria/i)).toBeInTheDocument();
  });

  it('debe copiar al portapapeles el texto en crudo y mostrar confirmación', async () => {
    render(<TemplateManager textoPlantilla="Hola [Nombre_Cliente]" />);

    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });

    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    fireEvent.click(screen.getByRole('button', { name: /Copiar texto/i }));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Hola [Nombre_Cliente]');
      expect(alertMock).toHaveBeenCalledWith('Copiado en portapapeles SIN INSERCIÓN DE VARIABLES');
    });
  });

  it('debe mostrar error exacto si el acceso al portapapeles falla', async () => {
    render(<TemplateManager textoPlantilla="Hola [Nombre_Cliente]" />);

    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockRejectedValue(new Error('Permiso denegado')),
      },
    });

    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    fireEvent.click(screen.getByRole('button', { name: /Copiar texto/i }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Error. No se pudo copiar al portapapeles');
    });
  });
});
