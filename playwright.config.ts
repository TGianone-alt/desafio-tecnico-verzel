import { defineConfig, devices } from '@playwright/test';

// Ambiente compartilhado por vários candidatos: poucas requisições em paralelo,
// sem retries e sem testes de carga (fora do escopo, conforme o enunciado).
const BASE_URL = process.env.BASE_URL ?? 'https://verzel-store.qa-test-verzel-store.workers.dev';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 2,
  retries: 0,
  timeout: 30_000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    // Testes de API: usam apenas o cliente HTTP do Playwright (não precisam de navegador).
    { name: 'api', testMatch: /tests\/api\/.*\.spec\.ts/ },
    // Testes de UI (rascunho): ver tests/e2e/pages/loja.page.ts antes de rodar.
    { name: 'ui', testMatch: /tests\/e2e\/.*\.spec\.ts/, use: { ...devices['Desktop Chrome'] } },
  ],
});
