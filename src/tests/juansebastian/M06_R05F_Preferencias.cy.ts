/// <reference types="cypress" />

describe('M06-R05F - Test E2E: Gestión de Preferencias de Notificación', () => {
  beforeEach(() => {
    // Usar la ruta completa o la ruta /reservas donde está integrado TimezoneBooking
    cy.visit('http://localhost:3000/reservas');
  });

  it('Debe cambiar las preferencias y mostrar la confirmación en pantalla', () => {
    cy.contains('Configuración de Tus Notificaciones').should('be.visible');
    cy.get('[data-cy="toggle-repro"]').click();
    cy.get('[data-cy="btn-guardar-preferencias"]').click();
    cy.get('[data-cy="toast-exito"]')
      .should('be.visible')
      .and('contain', 'Preferencias actualizadas con éxito');
  });
});