import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { M06R05FPreferenciasComponent } from '../../M06_R05F_PreferenciasComponent';

export interface PreferenciasNotificacionDTO {
  Confir: boolean;
  Cance: boolean;
  Repro: boolean;
  Recor: boolean;
}

export function validarEstadoPreferencias(prefs?: Partial<PreferenciasNotificacionDTO> | null): boolean {
  if (!prefs || typeof prefs !== 'object') {
    return false;
  }

  return (
    typeof prefs.Confir === 'boolean' &&
    typeof prefs.Cance === 'boolean' &&
    typeof prefs.Repro === 'boolean' &&
    typeof prefs.Recor === 'boolean'
  );
}

export function actualizarPreferencia(
  prefsActuales: Partial<PreferenciasNotificacionDTO> | null | undefined,
  clave: keyof PreferenciasNotificacionDTO,
  nuevoValor: boolean
): PreferenciasNotificacionDTO {
  const base: PreferenciasNotificacionDTO = {
    Confir: true,
    Cance: true,
    Repro: true,
    Recor: true,
  };

  if (prefsActuales && typeof prefsActuales === 'object') {
    Object.assign(base, prefsActuales);
  }

  if (!Object.prototype.hasOwnProperty.call(base, clave)) {
    return base;
  }

  return {
    ...base,
    [clave]: nuevoValor,
  };
}

describe('Pruebas Unitarias - M06-R05F: Preferencias de Notificación', () => {
  const estadoInicial: PreferenciasNotificacionDTO = {
    Confir: true,
    Cance: true,
    Repro: true,
    Recor: true,
  };

  test('Caso Lógica: Valida correctamente la estructura del objeto de preferencias', () => {
    expect(validarEstadoPreferencias(estadoInicial)).toBe(true);
  });

  test('Caso Lógica: Modifica el estado individual de Confirmaciones (Confir)', () => {
    const res = actualizarPreferencia(estadoInicial, 'Confir', false);
    expect(res.Confir).toBe(false);
    expect(res.Cance).toBe(true);
  });

  test('Caso Interfaz: Renders y muestra el mensaje de éxito al guardar cambios', () => {
    render(<M06R05FPreferenciasComponent />);

    const btnGuardar = screen.getByTestId('btn-guardar-preferencias');
    fireEvent.click(btnGuardar);

    expect(screen.getByText(/Preferencias actualizadas con éxito/i)).toBeInTheDocument();
  });
});