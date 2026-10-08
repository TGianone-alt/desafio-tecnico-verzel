# Teste técnico QA Júnior — Verzel Store (card VZS-142)

Validação da entrega **"Cupom de desconto e frete grátis"** (v2.3.0) da Verzel Store: cenários de teste, execução manual/exploratória, report de bugs, evidências e automação com Playwright.

- Loja: https://verzel-store.qa-test-verzel-store.workers.dev/
- Documentação da entrega: https://verzel-store.qa-test-verzel-store.workers.dev/documentacao
- API: https://verzel-store.qa-test-verzel-store.workers.dev/api

## Onde está cada entrega

| Item do enunciado | Onde |
|---|---|
| Cenários de teste (com Gherkin) | [`docs/02-cenarios-e-rastreabilidade.md`](docs/02-cenarios-e-rastreabilidade.md) · [`features/*.feature`](features/) |
| Premissas e ambiguidades (interpretação adotada) | [`docs/01-premissas-e-ambiguidades.md`](docs/01-premissas-e-ambiguidades.md) |
| Execução manual e exploratória, com resultado por cenário | [`docs/03-execucao.md`](docs/03-execucao.md) |
| Report de bugs | [`docs/bugs/`](docs/bugs/) |
| Evidências da execução | [`docs/evidencias/`](docs/evidencias/) |
| Automação com Playwright (≥ 3 cenários) | [`tests/api/`](tests/api/) (API) · [`tests/e2e/`](tests/e2e/) (UI) |
| Uso de IA | [`docs/05-uso-de-ia.md`](docs/05-uso-de-ia.md) |

> **Status do repositório** _(atualize antes de enviar)_: ✅ cenários e Gherkin · ✅ automação de API · 🟡 automação de UI em rascunho · ⬜ execução manual · ⬜ bugs · ⬜ evidências

## Como a validação foi organizada

1. **Leitura da documentação** e registro de premissas/ambiguidades (`docs/01`).
2. **Cenários** derivados dos critérios de aceite CA01–CA11, das regras de cálculo, das regras de cliente já existentes e do contrato da API, com **matriz de rastreabilidade** (requisito → cenário) em `docs/02`. Cada cenário tem um ID (`CT-CUP-01`, `CT-FRE-02`…) que aparece nas tags do Gherkin, nos títulos dos testes automatizados, na planilha de execução e nos bugs.
3. **Técnicas:** classes de equivalência e **análise de valor-limite** (frete em 199,80 / 199,90 / 200,00; 5 × 6 unidades), tabela de decisão cupom × subtotal, testes de contrato da API e **invariantes** (a fórmula `total = subtotal − desconto + frete` é conferida em vários carrinhos), além de 4 charters exploratórios.
4. **Automação** concentrada na camada de API, onde as regras de negócio vivem ("os cálculos são feitos pela API e a interface apenas exibe o resultado"). Isso a torna rápida, estável e adequada a um ambiente compartilhado.

## Como rodar a automação

Requisitos: Node.js 18+.

```bash
npm ci
npm test                 # suíte de API (não precisa instalar navegador)
npm run report           # abre o relatório HTML da última execução
```

Apontar para outro endereço (opcional):

```bash
BASE_URL=https://outro-host npm test              # Linux/macOS
$env:BASE_URL="https://outro-host"; npm test      # PowerShell
```

Testes de UI (**rascunho** — veja `tests/e2e/pages/loja.page.ts`):

```bash
npx playwright install chromium
npm run codegen          # grava a navegação e ajuda a confirmar os seletores
# depois de ajustar os seletores, troque SELETORES_CONFIRMADOS para true
npm run test:ui
```

Cuidados com o ambiente compartilhado (já configurados em `playwright.config.ts`): 2 workers, sem retries, sem testes de carga/estresse/segurança.

### Como interpretar os resultados

- Os valores esperados vêm **exclusivamente da documentação**. Um teste que falha indica divergência entre a loja e a documentação; a falha é confirmada manualmente e, sendo real, vira um `BUG-xxx`.
- Mensagens de falha listam todos os campos divergentes de uma vez (`expect.soft`), o que facilita o report.
- Para manter a suíte executável com um bug aberto, marque o teste como falha esperada, citando o bug:

  ```ts
  test('CT-FRE-02 | ...', async ({ request }) => {
    test.fail(true, 'BUG-001: frete cobrado com subtotal = 200,00 (docs/bugs/BUG-001.md)');
    // ...
  });
  ```

## Estrutura

```
.
├── README.md
├── docs/            # premissas, cenários + rastreabilidade, execução, bugs, evidências, uso de IA
├── features/        # cenários em Gherkin (pt-BR)
├── tests/
│   ├── api/         # Playwright (APIRequestContext): cupom, frete, quantidade, pedidos, erros
│   └── e2e/         # Playwright UI (rascunho) + page object
├── playwright.config.ts
└── package.json
```
