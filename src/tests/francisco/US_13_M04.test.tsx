import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import TemplateManager from '../../TemplateManager';

describe('Francisco - US_13_M04 - Validación de correo electrónico en reserva', () => {

  it('acepta un correo válido sin mostrar errores y habilita el botón', () => {
    render(<TemplateManager />);
    const inputEmail = screen.getByPlaceholderText('Ingresa tu correo');
    
    fireEvent.change(inputEmail, { target: { value: 'usuario@dominio.com' } });
    fireEvent.blur(inputEmail);

    expect(screen.queryByText('Ej: usuario@dominio.com')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirmar reserva/i })).not.toBeDisabled();
  });

  it('rechaza formato sin @, muestra sugerencia de error', () => {
    render(<TemplateManager />);
    const inputEmail = screen.getByPlaceholderText('Ingresa tu correo');
    
    fireEvent.change(inputEmail, { target: { value: 'usuariodominio.com' } });
    fireEvent.blur(inputEmail);

    const errorMessage = screen.getByText('Ej: usuario@dominio.com');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });

  it('deshabilita el botón de confirmación si el formato es incorrecto', () => {
    render(<TemplateManager />);
    const inputEmail = screen.getByPlaceholderText('Ingresa tu correo');
    
    fireEvent.change(inputEmail, { target: { value: 'usuario@' } });
    fireEvent.blur(inputEmail);

    expect(screen.getByRole('button', { name: /Confirmar reserva/i })).toBeDisabled();
  });
});