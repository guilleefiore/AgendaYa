describe('AgendaYA - M06 Notificaciones', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  it('CP-US01-01: Navegar a plantillas y validar prevención de guardado por campos obligatorios vacíos', () => {
    // 1. Navegación desde el Home
    cy.contains('Ir a Configurar Plantillas (Administrador)').click()
    cy.url().should('include', '/plantillas')

    // 2. Arrange: Verificar que los campos iniciales estén vacíos
    cy.get('[data-cy="template-title"]').should('have.value', '')
    cy.get('[data-cy="template-category"]').should('have.value', '')
    cy.get('[data-cy="template-description"]').should('have.value', '')

    // 3. Act: Clic en el botón guardar usando tu identificador exacto
    cy.get('[data-cy="save-template"]').click()

    // 4. Assert: Verificar los mensajes de error
    // El título sí tiene data-cy en tu código:
    cy.get('[data-cy="error-message"]').should('be.visible').and('contain', 'El título es obligatorio')
    
    // Como los spans de categoría y descripción no tienen data-cy, los buscamos por su texto:
    cy.contains('La categoría es obligatoria').should('be.visible')
    cy.contains('La descripción es obligatoria').should('be.visible')
  })
})