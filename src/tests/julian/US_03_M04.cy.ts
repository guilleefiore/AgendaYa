describe('AgendaYA - Módulo de disponibilidad', () => {
  beforeEach(() => {
    // Arrange: abrir la aplicación en la URL base configurada en Cypress.
    cy.visit('/');
  });

  it('filtra los días disponibles al seleccionar una duración de 60 minutos', () => {
    // Arrange: preparar la duración que se quiere consultar.
    cy.get('[data-cy="duration-selector"]').select('60 minutos');

    // Act: ejecutar la acción principal del flujo de disponibilidad.
    cy.get('[data-cy="calendar"]').should('be.visible');

    // Assert: comprobar el estado final esperado del calendario.
    cy.get('[data-cy="day-2026-06-25"]').should('not.have.class', 'is-disabled');
    cy.get('[data-cy="day-2026-06-27"]').should('not.have.class', 'is-disabled');
    cy.get('[data-cy="day-2026-06-26"]').should('have.class', 'is-disabled');
  });
});
