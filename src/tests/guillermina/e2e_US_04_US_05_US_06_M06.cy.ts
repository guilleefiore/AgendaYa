describe('Guillermina - M06 - Fallos y reintentos de notificaciones', () => {
  beforeEach(() => {
    // Abre directamente la pantalla que integra las US_04_M06, US_05_M06 y US_06_M06.
    cy.visit('/notificaciones');
  });

  it('CP-004-M06: registra el fallo inicial, realiza tres reintentos y finaliza como fallida', () => {
    // Arrange: crea una notificación válida y configura al proveedor para que todos los envíos fallen.
    cy.get('[data-cy="admin-email"]').type('admin@clinica.com');
    cy.get('[data-cy="enqueue-notification"]').click();
    cy.get('[data-cy="queued-notification"]').should('contain', 'admin@clinica.com');
    cy.get('[data-cy="notification-worker"]').should('be.visible');
    cy.get('[data-cy="send-result"]').select('fallido');

    // Act: ejecuta el envío inicial y los tres reintentos permitidos por la US_05_M06.
    cy.get('[data-cy="process-notification"]').click();
    cy.get('[data-cy="process-notification"]').click();
    cy.get('[data-cy="process-notification"]').click();
    cy.get('[data-cy="process-notification"]').click();

    // Assert: el historial conserva los cuatro intentos y el contador queda limitado a tres.
    cy.get('[data-cy="processing-log-entry"]').should('have.length', 4);
    cy.get('[data-cy="retry-count"]').should('have.text', '3');
    cy.get('[data-cy="process-notification"]').should('be.disabled');

    // El historial muestra primero el intento más reciente, que debe ser el fallo definitivo.
    cy.get('[data-cy="processing-log-entry"]').first().within(() => {
      cy.get('[data-cy="processing-status"]').should('contain', 'FALLIDA');
      cy.get('[data-cy="logged-retry-count"]').should('contain', '3');
      cy.get('[data-cy="failure-detail"]').should('contain', 'Timeout API SendGrid');
    });

    // Los tres registros anteriores corresponden a los reintentos automáticos previos al fallo final.
    cy.get('[data-cy="processing-status"]').filter(':contains("REINTENTADA")').should('have.length', 3);
  });
});
