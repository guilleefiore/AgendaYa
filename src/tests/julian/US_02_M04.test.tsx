import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TemplateManager from '../../TemplateManager';

describe('Julian - US_02_M04 - Selección Única de Evento', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debe desmarcar el evento anterior cuando se selecciona un nuevo evento', () => {
    const mockEventSelect = jest.fn();
    const eventos = [
      { id: 'evento-a', name: 'Evento A' },
      { id: 'evento-b', name: 'Evento B' },
    ];

    const { rerender } = render(
      <TemplateManager eventos={eventos} onEventSelect={mockEventSelect} />
    );

    const btnEventoA = screen.getByRole('button', { name: 'Evento A' });
    fireEvent.click(btnEventoA);
    expect(mockEventSelect).toHaveBeenCalledWith('evento-a');

    rerender(<TemplateManager eventos={eventos} onEventSelect={mockEventSelect} />);

    const btnEventoB = screen.getByRole('button', { name: 'Evento B' });
    fireEvent.click(btnEventoB);

    expect(mockEventSelect).toHaveBeenCalledWith('evento-b');
    expect(mockEventSelect).toHaveBeenCalledTimes(2);
  });

  it('debe habilitar el botón "Continuar al calendario" cuando se selecciona un evento', () => {
    render(<TemplateManager eventos={[{ id: 'evento-a', name: 'Evento A' }]} />);

    const btnContinuar = screen.getByRole('button', { name: /Continuar al calendario/i });
    expect(btnContinuar).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Evento A' }));

    expect(btnContinuar).not.toBeDisabled();
  });

  it('debe resaltar visualmente el evento seleccionado', () => {
    render(
      <TemplateManager
        eventos={[
          { id: 'evento-a', name: 'Evento A' },
          { id: 'evento-b', name: 'Evento B' },
        ]}
      />
    );

    const btnEventoA = screen.getByRole('button', { name: 'Evento A' });
    fireEvent.click(btnEventoA);

    expect(btnEventoA).toHaveClass('evento-selected');
    expect(btnEventoA).toHaveStyle({ backgroundColor: '#4CAF50' });
  });
});
