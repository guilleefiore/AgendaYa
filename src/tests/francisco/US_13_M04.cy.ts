/**
 * Test E2E Cypress - Francisco
 * US_13_M04 - Validación de correo electrónico
 *
 * Testea directamente el formulario de reserva (Invitado) del componente TemplateManager,
 * completamente aislado de la lógica de otros compañeros (como la selección de eventos de Julián).
 */
describe('Francisco - US_13_M04 - Validación de correo aislada (E2E)', () => {

  beforeEach(() => {
    cy.visit('/test-francisco');
    cy.wait(1000); 
    cy.get('[data-cy="email-input"]').should('exist');
  });

  it('muestra error y deshabilita el botón cuando el email no tiene @', () => {
    // Act
    cy.get('[data-cy="email-input"]').clear().type('franciscosindominio.com');
    cy.get('[data-cy="email-input"]').blur();

    // Assert
    cy.get('[data-cy="email-error"]').should('be.visible').and('contain', 'Ej: usuario@dominio.com');
    cy.get('[data-cy="submit-booking"]').should('be.disabled');
  });

  it('no muestra error y habilita el botón con un email válido', () => {
    // Act
    cy.get('[data-cy="email-input"]').clear().type('francisco@test.com');
    cy.get('[data-cy="email-input"]').blur();

    // Assert
    cy.get('[data-cy="email-error"]').should('not.exist');
    cy.get('[data-cy="submit-booking"]').should('not.be.disabled');
  });

});
