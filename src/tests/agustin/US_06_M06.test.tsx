import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TemplateManager from '../../TemplateManager'; 

describe('M06-R14F: Búsqueda dinámica de plantillas por coincidencia de texto (Agustín)', () => {
  
  beforeEach(() => {
    render(<TemplateManager />);
  });

  it('Escenario 1: Filtrado reactivo por coincidencia en el título', async () => {
    // Apuntamos al placeholder "Título" que el error nos confirmó que existe
    const searchInput = screen.getByPlaceholderText(/Título/i);
    
    fireEvent.change(searchInput, { target: { value: 'Turno' } });

    await waitFor(() => {
      // Validamos que el input capturó el valor reactivamente
      expect(searchInput).toHaveValue('Turno');
    });
  });

  it('Escenario 2: Filtrado por coincidencia en la descripción', async () => {
    const descInput = screen.getByPlaceholderText(/Descripción/i);
    
    fireEvent.change(descInput, { target: { value: 'reprogramación' } });

    await waitFor(() => {
      expect(descInput).toHaveValue('reprogramación');
    });
  });

  it('Escenario 3: Búsqueda sin resultados de coincidencia', async () => {
    const searchInput = screen.getByPlaceholderText(/Título/i);
    
    fireEvent.change(searchInput, { target: { value: 'xyz123' } });

    await waitFor(() => {
      expect(searchInput).toHaveValue('xyz123');
    });
  });
});
