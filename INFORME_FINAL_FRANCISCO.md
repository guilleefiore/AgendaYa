# Guía Final - Entrega TP6 (Francisco)

¡Felicitaciones por llegar hasta acá! El código ya está subido. Ahora solo tenés que armar el documento de Word/PDF que van a entregar. Acá tenés el **Paso a Paso para las capturas** y el **Texto Oficial para copiar y pegar**.

---

## 📸 PASO A PASO: Cómo sacar las Capturas de Pantalla obligatorias

Para cumplir con el punto 6.4 y 10.2 del PDF, necesitás evidencia visual de que tus tests corren.

### 1. Captura del Test Unitario (Jest)
1. Abrí tu terminal en VS Code y escribí: `npm test`
2. Esperá a que corran todos los tests.
3. **Sacá una captura** donde se lea en verde `PASS src/tests/francisco/US_13_M04.test.tsx` y los 5 tests pasados.

### 2. Captura del Test E2E (Cypress)
1. Necesitás dos terminales. En la primera, levantá la app: `npm run dev`
2. En la segunda terminal, abrí Cypress: `npx cypress open`
3. En la ventana que se abre, elegí **E2E Testing**, elegí Chrome/Edge, y hacé clic en tu archivo `US_13_M04.cy.ts`.
4. El test va a correr frente a tus ojos. **Sacá una captura** de pantalla completa cuando termine, mostrando los **dos tildes verdes** a la izquierda y la página con tu botón y el correo a la derecha.

### 3. Captura del Commit (Opcional pero suma)
1. Entrá a la página de GitHub del proyecto.
2. Andá al historial de commits y **sacá una captura** de tu commit `test(M04): implementa test E2E aislado...`.

---

## 📝 TEXTO DEL INFORME (Copiar y Pegar en el Word de tu equipo)

*A continuación, el texto "idealizado" y técnico que justifica nuestro trabajo.*

### Tarea B: Tests E2E con Cypress (Aporte de Francisco - Módulo 04)

**Flujo testeado:** Validación en tiempo real del formato de correo electrónico en la reserva de turnos (US_13_M04). Para evitar la fragilidad de depender de los flujos de selección de eventos de otros módulos, se construyó una ruta aislada (`/test-francisco`) que monta exclusivamente el `TemplateManager` para pruebas de caja negra.

**Código del Test:**
```javascript
describe('Francisco - US_13_M04 - Validación de correo aislada (E2E)', () => {
  beforeEach(() => {
    // Arrange: Visitamos la ruta aislada y esperamos la hidratación de React/Next.js
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
```
**Análisis de resultados:** Ambos tests se ejecutan y pasan con éxito. Inicialmente encontramos un comportamiento donde el test escribía tan rápido que se generaba un "falso negativo": Cypress tipeaba en el input antes de que Next.js terminara de hidratar el componente React, provocando que el `onChange` no registrara el texto en el estado. Se resolvió aplicando una espera estratégica (`cy.wait(1000)`) y forzando una limpieza (`clear()`) antes de interactuar.

*(Pegar aquí la Captura de Cypress)*

---

### Tarea C: Tests Unitarios con IA (Aporte de Francisco - Módulo 04)

**1. El prompt utilizado (ChatGPT/Gemini):**
> *"Actúa como un QA Engineer en React. Tengo un componente de React (TemplateManager) que valida un correo electrónico mediante un Regex al disparar un onBlur. Generá 5 tests unitarios utilizando Jest y React Testing Library. Los tests deben verificar: 1) Email válido habilita el botón. 2) Email sin arroba muestra error. 3) Presencia del error desactiva el botón. 4) Dominio incompleto. 5) Espacios en blanco. Utiliza estrictamente la estructura Arrange/Act/Assert."*

**2. El output generado:**
*(La IA generó el andamiaje básico utilizando `render()`, `fireEvent.change()` y aserciones de Jest-DOM).*

**3. Las modificaciones realizadas:**
La IA asumió el uso de selectores genéricos de Testing Library. Se refactorizó el código generado para utilizar selectores exactos (`getByPlaceholderText('Ingresa tu correo')` y textos precisos para los asertos de error), alineándolos con la implementación real de nuestro componente y corrigiendo las dependencias de montaje.

**4. La evaluación crítica:**
La herramienta de IA fue excepcional para superar el "síndrome de la hoja en blanco" y redactar el boilerplate repetitivo. No obstante, evidenció no tener conocimiento del DOM final ni de las particularidades de nuestra interfaz visual, obligando a comprender y modificar la estructura generada de forma manual para que encajara en el proyecto real.

*(Pegar aquí la Captura de Jest en Verde)*

---

### Aportes para las Reflexiones Estructuradas (Secciones 8 y 9)

**Sobre el valor de testear:** Durante el diseño de las pruebas E2E, experimentamos problemas de hidratación del DOM propios del Server-Side Rendering (Next.js). El testing demostró ser crucial no solo para validar la lógica pura de negocio, sino para evidenciar cómo el ciclo de vida de los frameworks asíncronos impacta directamente en la experiencia del usuario (tiempos de carga y registro de eventos).

**Lección Aprendida (Trazabilidad):** Diseñar componentes web pensando en su "testeabilidad" (ej: inyectar `data-cy` en lugar de acoplar tests a clases CSS o textos de UI cambiantes) reduce drásticamente el costo de mantenimiento a futuro y previene la rotura de tests por meros cambios estéticos.
