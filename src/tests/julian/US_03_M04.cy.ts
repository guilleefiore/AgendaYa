describe('AgendaYA - Módulo de disponibilidad (Julián)', () => {
  beforeEach(() => {
    // Visitamos la nueva pantalla de reservas
    cy.visit('/reservas');
  });

  it('Filtra los días disponibles al seleccionar un evento de 60 minutos', () => {
    // Arrange: Clic en el botón del evento que dura 60 minutos (Consulta Larga)
    // Agregaremos data-cy="event-type-2" a los botones para identificarlos fácilmente
    cy.contains('button', 'Consulta Larga (60 min)').click();

    // Act & Assert: Comprobar el estado final esperado del calendario/slots.
    // En mockAvailability, 2026-10-15 tiene 60 min, 2026-10-16 tiene 30 min.
    // Al elegir 60 min, solo los slots del 15 deberían mostrarse.
    cy.get('[data-cy^="slot-2026-10-15"]').should('exist');
    cy.get('[data-cy^="slot-2026-10-16"]').should('not.exist');
  });
});
