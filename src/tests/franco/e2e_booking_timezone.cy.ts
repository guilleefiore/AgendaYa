describe('AgendaYA - M04 Booking Público (Timezone)', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/reservas');
  });

  it('Debe convertir los slots de UTC a la zona horaria seleccionada y permitir reservar', () => {
    // Arrange: Cambiar la zona horaria a Buenos Aires
    cy.get('[data-cy="timezone-selector"]').select('America/Argentina/Buenos_Aires');

    // Verificar que un slot específico aparezca con la hora correcta (UTC-3)
    // El slot original era 2026-10-15T13:00:00Z -> Debería ser 10:00 en Buenos Aires
    cy.get('[data-cy="slot-2026-10-15T13:00:00Z"]').should('contain', '10:00');

    // Cambiar a otra zona horaria para verificar reactividad (Mendoza - mismo uso horario, o Madrid UTC+2/+1 dependiendo de DST)
    cy.get('[data-cy="timezone-selector"]').select('Europe/Madrid');
    // Para Madrid en Octubre podría ser +2, 13:00 UTC -> 15:00
    cy.get('[data-cy="slot-2026-10-15T13:00:00Z"]').should('contain', '15:00');

    // Act: Seleccionar un horario
    cy.get('[data-cy="slot-2026-10-15T13:00:00Z"]').click();

    // Completar el formulario
    cy.get('[data-cy="guest-name"]').type('Franco Invitado');
    cy.get('[data-cy="email-input"]').type('franco@test.com');

    // Confirmar reserva
    cy.get('[data-cy="submit-booking"]').click();

    // Assert: Ver el mensaje de confirmación
    cy.get('[data-cy="booking-confirmation"]').should('be.visible').and('contain', 'Tu reserva fue confirmada exitosamente');
  });

  it('Debe fallar si no se completa la información requerida', () => {
    // Arrange: no seleccionar horario ni llenar datos
    cy.get('[data-cy="submit-booking"]').click();
    
    // Assert: Mensaje de error por falta de horario
    cy.get('[data-cy="error-message"]').should('be.visible').and('contain', 'Debes seleccionar un horario');

    // Seleccionar horario pero no llenar datos
    cy.get('[data-cy="slot-2026-10-15T13:00:00Z"]').click();
    cy.get('[data-cy="submit-booking"]').click();

    // Assert: Mensaje de error por falta de nombre/email
    cy.get('[data-cy="error-message"]').should('be.visible').and('contain', 'Nombre y email son obligatorios');
  });
});
