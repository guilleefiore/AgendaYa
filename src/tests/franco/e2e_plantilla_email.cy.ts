describe('AgendaYA - M06 Notificaciones y Comunicaciones', () => {
  beforeEach(() => {
    // Visitamos la página local del frontend (la ruta que creamos para plantillas)
    cy.visit('http://localhost:3000/plantillas');
  });

  it('Debe permitir crear una nueva plantilla de email y usar el catálogo de variables', () => {
    // Arrange: preparar el estado inicial y los datos
    const titulo = 'Bienvenida a la Consulta';
    const descripcion = 'Plantilla para nuevos pacientes de primera vez.';
    
    // Act: ejecutar la acción principal
    // 1. Llenamos el formulario
    cy.get('[data-cy="template-title"]').type(titulo);
    cy.get('[data-cy="template-category"]').select('Bienvenida');
    cy.get('[data-cy="template-description"]').type(descripcion);
    
    // Escribimos algo de texto en el cuerpo
    cy.get('[data-cy="template-body"]').type('Hola ');
    
    // Hacemos clic en una variable dinámica del catálogo visual para insertarla
    cy.get('[data-cy="var-nombre-cliente"]').click();
    
    // Agregamos más texto después de la variable
    cy.get('[data-cy="template-body"]').type(', tu turno para el día ');
    
    // Insertamos otra variable
    cy.get('[data-cy="var-fecha-turno"]').click();
    
    // Verificamos que el textarea contenga el texto con las variables insertadas
    cy.get('[data-cy="template-body"]').should('have.value', 'Hola {{[Nombre_Cliente]}}, tu turno para el día {{[Fecha_Turno]}}');
    
    // Hacemos click en el botón de guardar
    cy.get('[data-cy="save-template"]').click();

    // Assert: verificar el resultado esperado
    // El sistema debería mostrar un mensaje de éxito
    cy.get('[data-cy="success-message"]').should('be.visible').and('contain', 'Plantilla guardada exitosamente');
    
    // El formulario debería vaciarse después de guardar con éxito
    cy.get('[data-cy="template-title"]').should('have.value', '');
    cy.get('[data-cy="template-body"]').should('have.value', '');
  });

  it('Debe mostrar un mensaje de error si se intenta guardar con campos vacíos', () => {
    // Arrange: Solo llenamos el título, dejamos el resto vacío
    cy.get('[data-cy="template-title"]').type('Plantilla Incompleta');
    
    // Act: intentamos guardar
    cy.get('[data-cy="save-template"]').click();
    
    // Assert: debe fallar por validación de campos obligatorios (la categoría falta)
    cy.get('[data-cy="error-message"]').should('be.visible').and('contain', 'La categoría es obligatoria');
  });
});
