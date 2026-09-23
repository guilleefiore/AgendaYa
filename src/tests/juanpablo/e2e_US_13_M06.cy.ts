describe('AgendaYA - M06 - Motor de Notificaciones (Juan Pablo & Guillermina)', () => {
  beforeEach(() => {
    // Visitamos la pantalla técnica del motor de notificaciones
    cy.visit('/notificaciones');
  });

  it('Flujo happy path: detectar reserva, encolar y procesar envío exitoso', () => {
    // Arrange: Cargar email del admin
    cy.get('input[type="email"]').type('admin@clinica.com');

    // Act: Simular la recepción de una nueva reserva (Lógica Juan Pablo)
    cy.contains('button', 'Simular Inserción en Cola').click();

    // Assert: Aparece la caja con los datos de la notificación
    cy.contains('admin@clinica.com').should('be.visible');

    // Act 2: Procesar la cola con resultado Exitoso (Lógica Guillermina)
    cy.get('select').select('exitoso');
    cy.contains('button', 'Ejecutar Worker (Procesar Mensaje)').click();

    // Assert 2: Ver el log de procesamiento confirmando el éxito
    cy.contains('Resultado Worker: ENVIADA').should('be.visible');
  });
});
