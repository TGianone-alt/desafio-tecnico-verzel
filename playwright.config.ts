import { defineConfig, devices } from '@playwright/test';
import { defineBddProject } from 'playwright-bdd';

// Ambiente compartilhado por vários candidatos: poucas requisições em paralelo,
// sem retries e sem testes de carga (fora do escopo, conforme o enunciado).
const BASE_URL = process.env.BASE_URL ?? 'https://verzel-store.qa-test-verzel-store.workers.dev';

export default defineConfig({
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
    // Cenários @auto: BDD (Gherkin em português) executado pelo Playwright na camada de API.
    // Não precisa de navegador.
    {
      ...defineBddProject({
        name: 'api',
        features: 'features/*.feature',
        steps: ['steps/fixtures.ts', 'steps/api/*.ts'],
        tags: '@auto',
        outputDir: '.features-gen/api',
        examplesTitleFormat: 'Exemplo <_index_>',
      }),
    },
    // Cenários @rascunho-auto: BDD de interface (rascunho até os seletores serem confirmados).
    {
      ...defineBddProject({
        name: 'ui',
        features: 'features/ui.feature',
        steps: ['steps/fixtures.ts', 'steps/ui/*.ts'],
        tags: '@rascunho-auto',
        outputDir: '.features-gen/ui',
        examplesTitleFormat: 'Exemplo <_index_>',
      }),
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
