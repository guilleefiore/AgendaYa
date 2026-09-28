<<<<<<< Updated upstream
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
=======
describe('AgendaYA - M06 Encolado de Notificaciones al Administrador (Juan Acre)', () => {
  beforeEach(() => {
    // Arrange: Navegar a la pantalla técnica del motor de notificaciones
    cy.visit('/notificaciones');
  });

  it('Escenario 1: Detectar reserva entrante, validar datos y encolar notificación con éxito', () => {
    // Arrange: Verificar que el formulario de inserción está visible y listo
    cy.get('[data-cy="admin-email"]').should('be.visible').and('have.value', '').clear();

    // Act: Ingresar email del administrador y simular la confirmación de una nueva reserva
    cy.get('[data-cy="admin-email"]').type('juanpablo@agenda.com');
    cy.get('[data-cy="enqueue-notification"]').should('be.enabled').click();

    // Assert: Comprobar que la notificación se genera, entra a la cola y muestra los datos del turno
    cy.get('[data-cy="queued-notification"]')
      .should('be.visible')
      .and('contain', 'juanpablo@agenda.com')
      .and('contain', 'Juan Pérez')
      .and('contain', '2026-06-25')
      .and('contain', '14:30')
      .and('contain', 'Dr. García');
>>>>>>> Stashed changes
  });

  it('Escenario 2: Prevenir encolado y alertar al usuario si el email de destino es inválido', () => {
    // Arrange: Cargar una dirección de correo sin dominio válido
    cy.get('[data-cy="admin-email"]')
      .should('be.visible')
      .clear()
      .type('admin-invalido-sin-arroba');

    // Act: Intentar disparar la inserción en la cola de procesamiento
    cy.get('[data-cy="enqueue-notification"]').click();

    // Assert: Verificar que no se inserte el registro erróneo en la cola y se alerte el formato
    cy.get('[data-cy="queued-notification"]').should('not.exist');
    cy.get('[data-cy="admin-email"]:invalid').should('exist');
  });
});