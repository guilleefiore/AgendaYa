# AgendaYA - TP6 Testing Automatizado

Frontend mínimo funcional de **AgendaYA** desarrollado para el Trabajo Práctico N.º 6 de Ingeniería y Calidad de Software. El proyecto implementa flujos de Booking Público (M04) y Notificaciones (M06), junto con tests unitarios en Jest y tests end-to-end en Cypress.

El frontend funciona como una simulación local: no necesita un backend ni una base de datos reales. Su objetivo es ofrecer comportamientos observables y testeables, como validaciones, cambios de estado, reintentos y confirmaciones visibles.

## Tecnologías

- Next.js 16 y React 19.
- TypeScript y JavaScript.
- Jest, Testing Library y `jest-dom` para tests unitarios.
- Cypress 16 para tests E2E.
- ESLint para análisis estático.

## Requisitos previos

- Node.js 22 o 24. El proyecto fue verificado con Node.js 24.14.1.
- npm.
- Google Chrome para ejecutar los E2E con el navegador utilizado por el equipo.

> Cypress 16 requiere Node.js 22, 24 o una versión compatible posterior. Por eso no se recomienda ejecutar este proyecto con Node.js 20, aunque Next.js por separado lo admita.

## Instalación

Clonar el repositorio, entrar en su directorio e instalar exactamente las dependencias registradas en `package-lock.json`:

```bash
git clone https://github.com/guilleefiore/AgendaYa.git
cd AgendaYa
npm ci
```

## Levantar el frontend

En una terminal, ejecutar:

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000). El servidor debe permanecer activo mientras se ejecutan los tests de Cypress.

Rutas disponibles:

| Ruta | Funcionalidad |
| --- | --- |
| `/` | Inicio y acceso a los flujos del TP. |
| `/reservas` | Selección de evento, zona horaria, horario y confirmación de una reserva. |
| `/plantillas` | Creación, validación y vista previa de plantillas de email. |
| `/notificaciones` | Simulación de envío, reintentos, fallo definitivo e historial de notificaciones. |
| `/test-francisco` | Pantalla aislada para el flujo E2E de validación de email. |

## Tests unitarios con Jest

Los tests unitarios están ubicados en `src/tests/<integrante>/` y utilizan el sufijo `.test.ts` o `.test.tsx`.

Ejecutar toda la suite:

```bash
npm test -- --runInBand
```

Ejecutar solamente un archivo:

```bash
npm test -- src/tests/guillermina/US_04_M06_US_05_M06_US_06_M06.test.tsx --runInBand
```

## Tests E2E con Cypress

Cypress utiliza `http://localhost:3000` como `baseUrl` y descubre los archivos `src/tests/**/*.cy.{js,jsx,ts,tsx}`. Antes de ejecutarlo, el frontend debe estar levantado con `npm run dev` en otra terminal.

### Modo interactivo en Chrome

```bash
npx cypress open --e2e --browser chrome
```

### Todos los E2E en Chrome headless

```bash
npx cypress run --browser chrome
```

### Un E2E específico

```bash
npx cypress run --browser chrome --spec src/tests/guillermina/e2e_US_04_US_05_US_06_M06.cy.ts
```

Los tests E2E siguen el patrón **Arrange / Act / Assert** y seleccionan los elementos interactivos mediante atributos `data-cy` estables.

## Validaciones adicionales

Comprobar el estilo y posibles errores estáticos:

```bash
npm run lint
```

Generar el build de producción:

```bash
npm run build -- --webpack
```

Iniciar el build generado:

```bash
npm start
```

## Configuración de TypeScript

El repositorio mantiene configuraciones separadas para impedir que los tipos globales de Jest y Cypress entren en conflicto:

| Archivo | Alcance |
| --- | --- |
| `tsconfig.json` | Aplicación Next.js. |
| `src/tests/tsconfig.json` | Tests unitarios de Jest y matchers de Testing Library. |
| `tsconfig.cypress.json` | Tests E2E y globales de Cypress, como `cy`. |

Si VS Code no reconoce `describe`, `expect` o `cy` después de instalar las dependencias, ejecutar desde la paleta de comandos:

```text
TypeScript: Restart TS Server
```

## Estructura principal

```text
AgendaYa/
├── app/                         # Rutas y pantallas de Next.js
├── src/                         # Componentes y lógica utilizada por el frontend
│   └── tests/
│       ├── <integrante>/        # TU, E2E y lógica organizada por responsable
│       └── tsconfig.json        # Tipos exclusivos de Jest
├── cypress.config.ts            # baseUrl y patrón de specs E2E
├── jest.config.mjs              # Entorno y configuración de Jest
├── jest.setup.ts                # Matchers adicionales de jest-dom
├── tsconfig.cypress.json        # Tipos exclusivos de Cypress
├── tsconfig.json                # Configuración TypeScript de la aplicación
├── package.json
└── README.md
```

## Estado verificado

Última verificación local: **24 de septiembre de 2026**.

- 11 suites y 44 tests unitarios aprobados.
- 7 archivos E2E y 10 tests de Cypress aprobados en Chrome.
- TypeScript aprobado para la aplicación, Jest y Cypress.
- ESLint aprobado.
- Build de producción generado correctamente.

## Evidencia de la entrega

Además del código versionado, el informe del TP debe conservar las capturas o videos de las ejecuciones, el análisis de resultados, la documentación del uso de IA, la reflexión estructurada y las lecciones aprendidas solicitadas por la consigna.
