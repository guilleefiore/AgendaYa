describe('AgendaYA - M04 Booking Público (Timezone)', () => {
  beforeEach(() => {
    cy.visit('/reservas');
  });

  it('Debe convertir los slots de UTC a la zona horaria seleccionada y permitir reservar', () => {
    // Arrange: Primero debemos seleccionar un evento para que aparezcan los horarios (Lógica de Julián)
    cy.contains('button', 'Consulta Corta (30 min)').click();

    // Cambiar la zona horaria a Buenos Aires
    cy.get('[data-cy="timezone-selector"]').select('America/Argentina/Buenos_Aires');

    // Verificar que un slot específico aparezca con la hora correcta (UTC-3)
    // El slot en UTC es 2026-10-15T09:00:00Z -> Debería ser 06:00 en Buenos Aires
    cy.get('[data-cy="slot-2026-10-15T09:00:00Z"]').should('contain', '06:00');

    // Cambiar a otra zona horaria para verificar reactividad (Madrid)
    cy.get('[data-cy="timezone-selector"]').select('Europe/Madrid');
    // Para Madrid en Octubre podría ser +2, 09:00 UTC -> 11:00
    cy.get('[data-cy="slot-2026-10-15T09:00:00Z"]').should('contain', '11:00');

    // Act: Seleccionar un horario
    cy.get('[data-cy="slot-2026-10-15T09:00:00Z"]').click();

    // Completar el formulario
    cy.get('[data-cy="guest-name"]').type('Franco Invitado');
    cy.get('[data-cy="email-input"]').type('franco@test.com');

    // Confirmar reserva
    cy.get('[data-cy="submit-booking"]').click();

    // Assert: Ver el mensaje de confirmación
    cy.get('[data-cy="booking-confirmation"]').should('be.visible').and('contain', 'Tu reserva fue confirmada exitosamente');
  });

  it('Debe fallar si no se completa la información requerida', () => {
    // Arrange: Seleccionar el evento para habilitar el formulario
    cy.contains('button', 'Consulta Corta (30 min)').click();

    // Antes de seleccionar horario, el botón debe estar deshabilitado
    cy.get('[data-cy="submit-booking"]').should('be.disabled');

    // Seleccionar horario pero NO llenar datos
    cy.get('[data-cy="slot-2026-10-15T09:00:00Z"]').click();
    
    // Ahora el botón está habilitado, intentamos enviar
    cy.get('[data-cy="submit-booking"]').should('not.be.disabled').click();
    
    // Assert: Mensaje de error por falta de nombre o email
    cy.get('[data-cy="error-message"]').should('be.visible').and('contain', 'Por favor completa todos los campos');

    // Llenar datos pero con email inválido
    cy.get('[data-cy="guest-name"]').type('Franco Invitado');
    cy.get('[data-cy="email-input"]').type('franco-sin-arroba');
    
    cy.get('[data-cy="submit-booking"]').click();

    // Assert: Mensaje de error por formato de email
    cy.get('[data-cy="error-message"]').should('be.visible').and('contain', 'Corrige los errores antes de confirmar');
  });
});
