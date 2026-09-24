// Cypress E2E test for AgendaYA - M06 (Búsqueda y Filtrado Dinámico de Plantillas)
// Integrante: Agustín Aguilera
// Requerimiento asociado: M06-R14F / US_28_M06 (US_06_M06)

describe('AgendaYA - M06 Búsqueda dinámica de plantillas (Agustín Aguilera)', () => {
  beforeEach(() => {
    // Arrange: Navegar a la pantalla de gestión de plantillas del Administrador
    cy.visit('/plantillas');
  });

  it('Escenario 1: Filtrado reactivo por coincidencia en el título', () => {
    // Arrange: Verificar que el buscador está visible y la lista carga los dos registros iniciales
    cy.get('[data-cy="search-template-input"]').should('be.visible').and('have.value', '');
    cy.get('[data-cy="template-item"]').should('have.length', 2);

    // Act: Escribir el término de búsqueda coincidente con el título de la primera plantilla
    cy.get('[data-cy="search-template-input"]').type('Bienvenida');

    // Assert: Verificar que la grilla filtra reactivamente y solo muestra la plantilla correspondiente
    cy.get('[data-cy="template-item"]').should('have.length', 1);
    cy.get('[data-cy="template-item"]').first().should('contain', 'Bienvenida Standard');
    cy.contains('Recordatorio 24h').should('not.exist');
    cy.get('[data-cy="no-templates-message"]').should('not.exist');
  });

  it('Escenario 2: Filtrado reactivo por coincidencia en la descripción', () => {
    // Arrange: Verificar estado inicial de la lista completa
    cy.get('[data-cy="template-item"]').should('have.length', 2);

    // Act: Escribir término que solo existe dentro del cuerpo descriptivo ("turno")
    cy.get('[data-cy="search-template-input"]').type('turno');

    // Assert: Comprobar que se filtra exclusivamente la plantilla cuya descripción contiene la palabra
    cy.get('[data-cy="template-item"]').should('have.length', 1);
    cy.get('[data-cy="template-item"]').first().should('contain', 'Recordatorio 24h');
    cy.contains('Bienvenida Standard').should('not.exist');
  });

  it('Escenario 3: Búsqueda sin resultados de coincidencia y mensaje de estado vacío', () => {
    // Arrange: Campo de búsqueda limpio y listo para recibir texto
    cy.get('[data-cy="search-template-input"]').should('have.value', '');

    // Act: Ingresar una consulta arbitraria sin coincidencia en títulos ni descripciones
    cy.get('[data-cy="search-template-input"]').type('xyz123');

    // Assert: Validar que no hay elementos en la lista y se renderiza el mensaje de estado vacío
    cy.get('[data-cy="template-item"]').should('not.exist');
    cy.get('[data-cy="no-templates-message"]')
      .should('be.visible')
      .and('contain', 'No se encontraron plantillas que coincidan con la búsqueda');
  });

  it('Escenario 4: Restablecer el listado completo al limpiar el campo de búsqueda', () => {
    // Arrange: Aplicar un filtro que reduzca los resultados de la grilla
    cy.get('[data-cy="search-template-input"]').type('Bienvenida');
    cy.get('[data-cy="template-item"]').should('have.length', 1);

    // Act: Hacer clic en el botón de limpieza de filtro
    cy.get('[data-cy="clear-search-button"]').should('be.visible').click();

    // Assert: Verificar que el input se vacía y se reestablecen todas las plantillas iniciales
    cy.get('[data-cy="search-template-input"]').should('have.value', '');
    cy.get('[data-cy="template-item"]').should('have.length', 2);
    cy.contains('Bienvenida Standard').should('be.visible');
    cy.contains('Recordatorio 24h').should('be.visible');
  });
});
