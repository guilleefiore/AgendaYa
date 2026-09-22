// Cypress E2E test for AgendaYA - M06 (Notificación al Administrador)
// Arrange / Act / Assert pattern
// Nota: Cypress debe estar configurado y el servidor dev corriendo en `http://localhost:3000`.

describe('AgendaYA - M06 - Envío de notificación (E2E)', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Flujo happy path: completar campos y enviar notificación', () => {
    // Arrange: verificar que la página cargó
    cy.contains('Enviar Notificación').should('exist');

    // Act: hacer click en Enviar Notificación (el componente usa valores por defecto)
    cy.contains('button', 'Enviar Notificación').click();

    // Assert: debería aparecer mensaje de éxito y conservarse en la misma ruta
    cy.contains('Notificación enviada').should('be.visible');
    cy.url().should('include', '/');
  });
});
