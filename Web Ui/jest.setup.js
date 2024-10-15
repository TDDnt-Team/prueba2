/* eslint-disable */

require('dotenv').config();
// Mock para evitar la ejecucion de Vite en los tests
jest.mock('./config.ts', () => ({
    VITE_API: process.env.VITE_API_URL
}));

/* eslint-enable */