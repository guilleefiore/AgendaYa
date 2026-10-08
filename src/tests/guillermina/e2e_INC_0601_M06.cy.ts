describe('INC-0601 - Notificaciones', () => {
  it('detecta el error de estado de notificación no reiniciado', () => {
    cy.visit('/notificaciones');

    // Asegurarnos de que el input tenga el valor correcto antes de hacer click
    cy.get('[data-cy="admin-email"]')
      .clear()
      .type('admin@clinica.com')
      .should('have.value', 'admin@clinica.com');

    // Primera reserva
    cy.get('[data-cy="enqueue-notification"]').click();

    // Validamos que se creó correctamente y la UI se actualizó
    cy.get('[data-cy="queued-notification"]').should('be.visible');
    cy.get('[data-cy="notification-worker"]').should('be.visible');

    // Procesar hasta que finalice (exitoso)
    cy.get('[data-cy="send-result"]').select('exitoso');
    cy.get('[data-cy="process-notification"]').click();

    // Validar que el botón se deshabilitó tras procesar
    cy.get('[data-cy="process-notification"]').should('be.disabled');
    cy.get('[data-cy="processing-status"]').should('contain', 'ENVIADA');

    // Nueva reserva
    cy.get('[data-cy="enqueue-notification"]').click();

    // Ahora el botón debería estar habilitado nuevamente
    cy.get('[data-cy="process-notification"]').should('not.be.disabled');
  });
});
