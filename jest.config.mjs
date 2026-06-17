import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Le dice a Next.js dónde está tu proyecto para cargar los archivos .env y la configuración
  dir: './',
});

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

// Esto hace que next/jest conecte automáticamente su transformador de JSX/SWC
export default createJestConfig(config);