describe('AgendaYA - M06 Notificaciones / Booking Automático (Elena)', () => {
  beforeEach(() => {
    // Ingresa a la pantalla de reservas compartida
    cy.visit('/reservas');
  });

  it('Debe confirmar automáticamente la reserva y notificar con datos válidos', () => {
    // Arrange: Seleccionar evento para desplegar disponibilidad y elegir turno
    cy.contains('button', 'Consulta Corta (30 min)').click();
    cy.get('[data-cy="slot-2026-10-15T09:00:00Z"]').click();

    // Completar datos obligatorios
    cy.get('[data-cy="guest-name"]').type('Elena Moyano');
    cy.get('[data-cy="email-input"]').type('test@usuario.com');

    // Act: Confirmar reserva
    cy.get('[data-cy="submit-booking"]').click();

    // Assert: Comprobar mensaje de confirmación exitosa
    cy.get('[data-cy="booking-confirmation"]')
      .should('be.visible')
      .and('contain', 'Tu reserva fue confirmada exitosamente');
  });

  it('Debe bloquear la confirmación si faltan completar campos requeridos', () => {
    // Arrange: Seleccionar turno sin llenar los datos del formulario
    cy.contains('button', 'Consulta Corta (30 min)').click();
    cy.get('[data-cy="slot-2026-10-15T09:00:00Z"]').click();

    // Act: Intentar confirmar con campos vacíos
    cy.get('[data-cy="submit-booking"]').click();

    // Assert: Verificar mensaje de error en pantalla
    cy.get('[data-cy="error-message"]')
      .should('be.visible')
      .and('contain', 'Por favor completa todos los campos');
  });
});