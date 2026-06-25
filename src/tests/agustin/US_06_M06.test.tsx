import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TemplateManager from '../../TemplateManager'; 

describe('M06-R14F: Búsqueda dinámica de plantillas por coincidencia de texto (Agustín)', () => {
  
  beforeEach(() => {
    // Renderizamos el componente antes de cada test para tener un entorno limpio
    render(<TemplateManager />);
  });

  it('Escenario 1: Filtrado reactivo por coincidencia en el título', async () => {
    const searchInput = screen.getByPlaceholderText(/Buscar plantilla/i);
    
    // Simulamos que el usuario tipea "Turno"
    await userEvent.type(searchInput, 'Turno');

    await waitFor(() => {
      // Verificamos que la plantilla de turno aparece y las demás se ocultan
      expect(screen.getByText(/Recordatorio de Turno/i)).toBeInTheDocument();
      expect(screen.queryByText(/Bienvenida nuevos pacientes/i)).not.toBeInTheDocument();
    });
  });

  it('Escenario 2: Filtrado por coincidencia en la descripción', async () => {
    const searchInput = screen.getByPlaceholderText(/Buscar plantilla/i);
    
    // Simulamos que el usuario busca una palabra clave de la descripción
    await userEvent.type(searchInput, 'reprogramación');

    await waitFor(() => {
      expect(screen.getByText(/reprogramación/i)).toBeInTheDocument();
      expect(screen.queryByText(/Recordatorio 24hs/i)).not.toBeInTheDocument();
    });
  });

  it('Escenario 3: Búsqueda sin resultados de coincidencia', async () => {
    const searchInput = screen.getByPlaceholderText(/Buscar plantilla/i);
    
    // Simulamos un texto que no existe en ninguna plantilla
    await userEvent.type(searchInput, 'xyz123');

    await waitFor(() => {
      // El sistema debe mostrar el mensaje de fallback amigable
      expect(screen.getByText('No se encontraron plantillas que coincidan con la búsqueda')).toBeInTheDocument();
    });
  });
});
