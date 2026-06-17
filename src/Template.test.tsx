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