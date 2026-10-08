// Cypress E2E test for AgendaYA - M06 (Motor de Notificaciones)
// Patrón: Arrange / Act / Assert

describe('AgendaYA - M06 - Motor de Notificaciones al Administrador', () => {
  beforeEach(() => {
    // Visitamos la pantalla técnica del motor de notificaciones
    cy.visit('/notificaciones');
  });

  it('Escenario 1: Prevenir encolado y alertar al usuario si el email de destino es inválido', () => {
    // Arrange: Cargar una dirección de correo sin dominio válido
    cy.get('[data-cy="admin-email"]')
      .should('be.visible')
      .clear()
      .type('admin-invalido-sin-arroba');

    // Act: Intentar disparar la inserción en la cola
    cy.get('[data-cy="enqueue-notification"]').click();

    // Assert: Verificar que no se inserte el registro y salte el error HTML5
    cy.get('[data-cy="queued-notification"]').should('not.exist');
    cy.get('[data-cy="admin-email"]:invalid').should('exist');
  });

  it('Escenario 2: Flujo completo (detectar reserva, encolar y procesar envío exitoso)', () => {
    // Arrange: Cargar email válido del admin
    cy.get('[data-cy="admin-email"]')
      .should('be.visible')
      .clear()
      .type('admin@clinica.com');

    // Act 1: Simular la recepción de una nueva reserva y encolar
    cy.get('[data-cy="enqueue-notification"]').should('be.enabled').click();

    // Assert 1: Aparece la caja con los datos de la notificación encolada
    cy.get('[data-cy="queued-notification"]')
      .should('be.visible')
      .and('contain', 'admin@clinica.com')
      .and('contain', 'Juan Pérez');

    // Act 2: Procesar la cola simulando un resultado Exitoso en el Worker
    cy.get('select').select('exitoso');

    // Fallback a cy.contains por si no le pusieron data-cy a este botón aún
    cy.contains('button', 'Ejecutar Worker').click();

    // Assert 2: Ver el log de procesamiento confirmando el éxito
    cy.contains('Resultado Worker: ENVIADA').should('be.visible');
  });
});
