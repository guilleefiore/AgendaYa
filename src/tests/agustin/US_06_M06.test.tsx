import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TemplateManager from '../../TemplateManager'; 

describe('M06-R14F: Búsqueda dinámica de plantillas por coincidencia de texto (Agustín)', () => {
  
  beforeEach(() => {
    // Renderizamos el componente antes de cada test para tener un entorno limpio
    render(<TemplateManager />);
  });

  it('Escenario 1: Filtrado reactivo por coincidencia en el título', async () => {
    const searchInput = screen.getByPlaceholderText(/Buscar plantilla/i);
    
    // Usamos fireEvent que ya viene incluido de forma nativa
    fireEvent.change(searchInput, { target: { value: 'Turno' } });

    await waitFor(() => {
      expect(screen.getByText(/Recordatorio de Turno/i)).toBeInTheDocument();
      expect(screen.queryByText(/Bienvenida nuevos pacientes/i)).not.toBeInTheDocument();
    });
  });

  it('Escenario 2: Filtrado por coincidencia en la descripción', async () => {
    const searchInput = screen.getByPlaceholderText(/Buscar plantilla/i);
    
    fireEvent.change(searchInput, { target: { value: 'reprogramación' } });

    await waitFor(() => {
      expect(screen.getByText(/reprogramación/i)).toBeInTheDocument();
      expect(screen.queryByText(/Recordatorio 24hs/i)).not.toBeInTheDocument();
    });
  });

  it('Escenario 3: Búsqueda sin resultados de coincidencia', async () => {
    const searchInput = screen.getByPlaceholderText(/Buscar plantilla/i);
    
    fireEvent.change(searchInput, { target: { value: 'xyz123' } });

    await waitFor(() => {
      expect(screen.getByText('No se encontraron plantillas que coincidan con la búsqueda')).toBeInTheDocument();
    });
  });
});
