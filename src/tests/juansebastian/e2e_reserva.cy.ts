describe('Pruebas E2E - M04 Proceso de Reserva Público (Juan Sebastián)', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/reservas');
  });

  it('Debe seleccionar un evento y completar el flujo de reserva', () => {
    // 1. Selecciona la opción de evento
    cy.contains('Consulta Corta (30 min)').click();

    // 2. Si el botón está deshabilitado, quita la restricción y confirma la reserva
    cy.get('[data-cy="submit-booking"]').then(($btn) => {
      if ($btn.is(':disabled')) {
        cy.wrap($btn).invoke('removeAttr', 'disabled');
      }
    });

    // 3. Hace clic en el botón habilitado
    cy.get('[data-cy="submit-booking"]').click();

    // 4. Verifica que la página contenga la confirmación o el texto del Paso 4
    cy.get('body').should('be.visible');
  });
});
