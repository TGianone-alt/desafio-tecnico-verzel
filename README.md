# Teste técnico QA Júnior — Verzel Store (card VZS-142)

Validação da entrega **"Cupom de desconto e frete grátis"** (versão 2.3.0, publicada em 30/09/2026) da Verzel Store, um ambiente fictício usado no processo seletivo de QA da Verzel.

Este repositório reúne tudo o que o teste pede, num só lugar: cenários de teste em **Gherkin (BDD)**, execução **manual e exploratória** com resultado por cenário, **report de bugs**, **evidências**, e **automação com Playwright** em que os próprios arquivos `.feature` são executados.

- Loja: https://verzel-store.qa-test-verzel-store.workers.dev/
- Documentação da entrega: https://verzel-store.qa-test-verzel-store.workers.dev/documentacao
- API: https://verzel-store.qa-test-verzel-store.workers.dev/api

---

## Sumário

1. [Onde está cada entrega](#1-onde-está-cada-entrega)
2. [Resultados em resumo](#2-resultados-em-resumo)
3. [Como rodar a automação (passo a passo)](#3-como-rodar-a-automação-passo-a-passo)
4. [Como a automação funciona (BDD)](#4-como-a-automação-funciona-bdd)
5. [Como interpretar os resultados](#5-como-interpretar-os-resultados)
6. [Como adicionar ou alterar um cenário](#6-como-adicionar-ou-alterar-um-cenário)
7. [Estratégia de testes](#7-estratégia-de-testes)
8. [Estrutura do repositório](#8-estrutura-do-repositório)
9. [Limitações e cuidados](#9-limitações-e-cuidados)
10. [Problemas comuns](#10-problemas-comuns)
11. [Uso de IA](#11-uso-de-ia)

---

## 1. Onde está cada entrega

| Item pedido no enunciado | Onde encontrar |
|---|---|
| Cenários de teste levantados a partir da documentação (Gherkin é diferencial) | [`features/`](features/) (8 arquivos `.feature`, em português) · catálogo com 61 cenários e matriz de rastreabilidade em [`docs/02-cenarios-e-rastreabilidade.md`](docs/02-cenarios-e-rastreabilidade.md) |
| Interpretação de trechos ambíguos da documentação | [`docs/01-premissas-e-ambiguidades.md`](docs/01-premissas-e-ambiguidades.md) (15 itens, `AMB-01` a `AMB-15`) |
| Execução dos testes, manuais e exploratórios, com o resultado de cada cenário | [`docs/03-execucao.md`](docs/03-execucao.md) (resultado dos 61 cenários) · [`docs/04-sessoes-exploratorias.md`](docs/04-sessoes-exploratorias.md) (4 sessões exploratórias) |
| Report de todos os bugs encontrados | [`docs/bugs/`](docs/bugs/) — [BUG-001](docs/bugs/BUG-001.md), [BUG-002](docs/bugs/BUG-002.md), [BUG-003](docs/bugs/BUG-003.md) |
| Documento com as evidências da execução | [`docs/evidencias/`](docs/evidencias/) (prints e saídas da automação; cada evidência é citada em `docs/03` e nos bugs) |
| Automação de pelo menos 3 cenários com Playwright | Cenários com a tag `@auto` em [`features/`](features/), ligados ao código em [`steps/`](steps/) e [`support/`](support/) — **119 cenários executáveis** |
| README explicando como rodar a automação e onde encontrar cada entrega | Este arquivo |
| Uso de IA | [`docs/05-uso-de-ia.md`](docs/05-uso-de-ia.md) (e campo correspondente do formulário de envio) |

---

## 2. Resultados em resumo

**Execução manual e exploratória** (61 cenários, detalhes em [`docs/03-execucao.md`](docs/03-execucao.md)):

| Status | Quantidade |
|---|---|
| ✅ Passou | 53 |
| 🟡 Passou com observação | 3 |
| ❌ Falhou (vinculado a bug) | 4 |
| ⛔ Não executável pela interface | 1 |

**Automação** (`npm test`, contra a loja real): 119 cenários, **109 passaram e 10 falharam**. As 10 falhas são **esperadas** e correspondem aos bugs abaixo; a saída está em `docs/evidencias/automacao/`.

**Bugs encontrados:**

| ID | Resumo | Severidade | Onde |
|---|---|---|---|
| [BUG-001](docs/bugs/BUG-001.md) | Com subtotal **exatamente R$ 200,00** o frete de R$ 19,90 ainda é cobrado (o CA06 diz "a partir de R$ 200,00, inclusive"). A tela chega a mostrar "Faltam R$ 0,00 para o frete grátis" ao mesmo tempo. O valor errado vai para o pedido confirmado. | Alta | API, tela e pedido |
| [BUG-002](docs/bugs/BUG-002.md) | A API **não valida o limite de 5 unidades por produto** (aceita 6, 10 e 100 em `/calcular` e confirma pedido em `/pedidos`). A interface bloqueia corretamente. | Alta (prioridade média) | API |
| [BUG-003](docs/bugs/BUG-003.md) | O cupom é removido por "Esvaziar carrinho", mas permanece aplicado ao remover o último item e adicionar outro (comportamento inconsistente; a documentação não define). | Baixa | Interface |

Das 10 falhas da automação, 5 vêm do BUG-001 (CT-FRE-02, CT-FRE-05 e CT-CAL-01) e 5 do BUG-002 (CT-QTD-05).

---

## 3. Como rodar a automação (passo a passo)

### Pré-requisitos

- **Node.js 20 ou superior** (versão LTS) e npm. Confira com `node -v`.
- Acesso à internet (os testes chamam a API da loja).
- **Não é necessário instalar navegador** para os cenários `@auto` (camada de API).

### Instalação e execução

```bash
git clone <URL-DO-REPOSITORIO>
cd <pasta-do-repositorio>

npm install     # instala Playwright, playwright-bdd e TypeScript
npm test        # gera os testes a partir dos .feature e roda os cenários @auto
npm run report  # abre o relatório HTML da última execução
```

> **Windows / PowerShell:** se o `npm` for bloqueado com "a execução de scripts foi desabilitada neste sistema", rode uma vez
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, ou use `npm.cmd` no lugar de `npm`.

### Outros comandos

| Comando | O que faz |
|---|---|
| `npm test` | Gera os testes (`bddgen`) e roda os cenários `@auto` na camada de API |
| `npm run bddgen` | Só gera os testes em `.features-gen/` a partir dos `.feature` (não executa) |
| `npm run report` | Abre o relatório HTML da última execução |
| `npm run typecheck` | Confere os tipos TypeScript |
| `npm run codegen` | Abre o gravador do Playwright (usado para confirmar seletores da UI) |
| `npm run test:ui` | Roda os cenários de interface em **rascunho** (ver [limitações](#9-limitações-e-cuidados)) |

### Rodar um cenário específico (por tag)

Cada cenário carrega tags com o ID (`@CT-FRE-02`) e o critério de aceite (`@CA06`). Para rodar só alguns:

```bash
npm run bddgen
npx playwright test --project=api --grep "@CT-FRE-02"
npx playwright test --project=api --grep "@CT-QTD-05|@CT-FRE-05"   # mais de um
npx playwright test --project=api --grep "@CA08"                    # por critério de aceite
```

### Apontar para outro endereço

```bash
BASE_URL=https://outro-host npm test              # Linux/macOS
$env:BASE_URL="https://outro-host"; npm test      # PowerShell
```

### Salvar a saída como evidência (PowerShell)

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$env:FORCE_COLOR = "0"; $env:NO_COLOR = "1"
npm test | Out-File -Encoding utf8 docs\evidencias\automacao\execucao-bdd-2026-10-08.txt
```

---

## 4. Como a automação funciona (BDD)

Os cenários são escritos em **Gherkin em português** (`# language: pt`) e **executados de verdade**: o [`playwright-bdd`](https://github.com/vitalets/playwright-bdd) lê os arquivos `.feature`, gera os testes do Playwright e liga cada frase (`Dado`, `Quando`, `Então`) ao código TypeScript em `steps/`.

```
features/*.feature  ──(bddgen)──►  .features-gen/  ──►  Playwright  ──►  relatório
        ▲                                 ▲
   cenários em                     steps/ e support/
   português                      (frases ↔ código)
```

### Tags dos cenários

| Tag | Significado |
|---|---|
| `@CT-XXX-NN` | ID do cenário (liga o `.feature`, `docs/02`, `docs/03` e os bugs) |
| `@CA01` … `@CA11` | Critério de aceite do card que o cenário cobre |
| `@auto` | Cenário **automatizado** (roda em `npm test`, camada de API) |
| `@manual` | Cenário executado **manualmente** (resultado em `docs/03`) |
| `@rascunho-auto` | Automação de **interface em rascunho** (`features/ui.feature`) |
| `@api` / `@ui` | Camada(s) em que o cenário foi verificado |
| `@nao-aplicavel` | Cenário que não é executável pela interface (explicado no próprio arquivo) |

### Frases disponíveis (vocabulário dos passos)

Valores em reais seguem o formato `R$ 1.234,56`. Textos entre aspas são literais.

**Dado**
- `que o carrinho está vazio`
- `que o carrinho contém 1 unidade de "Calça Jeans Slim" e 2 unidades de "Boné Aba Curva"` (também aceita `1 "Mochila Urbana 20L", 1 "Boné Aba Curva"` e o id do produto, ex.: `"P999"`)
- `que o carrinho contém 5 unidades de cada um dos 8 produtos`

**Quando**
- `eu calculo o carrinho sem cupom` · `eu calculo o carrinho com o cupom "X"` · `eu aplico o cupom "X"`
- `eu calculo o carrinho duas vezes com o cupom "X"`
- `eu confirmo o pedido` — e variações: `... com o cupom "X"`, `... com o nome "X"`, `... com o e-mail "X"`, `... com o CEP "X"`, `... com o mesmo carrinho sem cupom`, `... com o mesmo carrinho e o cupom "X"`
- `eu envio GET /api/produtos` (também `POST`, `PUT`, `DELETE`) · `eu envio POST /rota com o corpo <texto cru>`

**Então**
- `a resposta é 200` · `a resposta é 422 com o código "QUANTIDADE_MAXIMA_EXCEDIDA"` · `o campo apontado é "itens[0].quantidade"` · `a mensagem de erro é "..."`
- `o subtotal | o desconto | o frete | o total é R$ 0,00` · `o valor faltante para o frete grátis é R$ 0,00` · `o frete grátis está ativo | inativo`
- `o cupom está | não está aplicado` · `a mensagem do cupom é "..."`
- `os valores respeitam as regras de cálculo` · `as duas respostas são idênticas` · `os valores do pedido são iguais aos do cálculo`
- `o número do pedido segue o formato VZ-NNNNNN` · `o CEP do cliente é devolvido como "01310100"`
- `a resposta é 200 com 8 produtos` · `cada produto tem id, nome, descricao, categoria e preco conforme a tabela da documentação` · `o produto retornado é "X" com preço R$ 0,00`

### Verificação de invariantes (`os valores respeitam as regras de cálculo`)

Para qualquer carrinho, o passo confere: `total = subtotal − desconto + frete`; subtotal igual à soma dos itens; frete R$ 0,00 se e somente se o subtotal é ≥ R$ 200,00 (senão R$ 19,90); faltante = `máx(0, 200 − subtotal)`; desconto = 10% do subtotal quando o cupom está aplicado; e **no máximo 2 casas decimais em cada valor** (detecta artefatos de ponto flutuante, como `59,90 × 3 = 179.70000000000002`).

---

## 5. Como interpretar os resultados

- Os valores esperados vêm **exclusivamente da documentação** do card. Cenário que falha = a loja diverge da documentação.
- Nesta versão da loja, as **10 falhas esperadas** são:

| Cenário (tag) | O que falha | Bug |
|---|---|---|
| `@CT-FRE-02` (2 exemplos) | Subtotal R$ 200,00 cobra frete | BUG-001 |
| `@CT-FRE-05` (exemplo com subtotal 200,00) | Subtotal R$ 200,00 com cupom perde o frete grátis | BUG-001 |
| `@CT-CAL-01` (2 Mochilas, com e sem cupom) | Regra do frete nas invariantes | BUG-001 |
| `@CT-QTD-05` (5 cenários) | API aceita mais de 5 unidades | BUG-002 |

- Toda falha foi **reproduzida manualmente** (API e interface) antes de virar bug; os relatos têm passos, esperado × obtido e evidências.
- As mensagens de falha listam todos os campos divergentes de uma vez (`expect.soft`), o que ajuda a montar o report.
- Quando os bugs forem corrigidos, esses cenários devem passar sem nenhuma alteração.

---

## 6. Como adicionar ou alterar um cenário

1. Escreva o cenário em um `.feature` (ou edite um existente), usando as frases do vocabulário acima. Exemplo:

   ```gherkin
   @CT-FRE-09 @CA06 @api @auto
   Cenário: Subtotal de R$ 299,50 tem frete grátis
     Dado que o carrinho contém 5 unidades de "Camiseta Essencial"
     Quando eu calculo o carrinho sem cupom
     Então o subtotal é R$ 299,50
     E o frete é R$ 0,00
     E o frete grátis está ativo
   ```

2. Coloque a tag `@auto` para que o cenário rode em `npm test` (sem ela, é só documentação).
3. Se precisar de uma frase nova, acrescente a definição em `steps/api/api.steps.ts` (formato `Given/When/Then(/regex/, async ({ request, mundo }, ...args) => { ... })`).
4. Rode `npm test` (ele regenera os testes automaticamente).
5. Registre o cenário em `docs/02` e o resultado em `docs/03`.

---

## 7. Estratégia de testes

1. **Leitura da documentação** e registro de premissas e ambiguidades (`docs/01`).
2. **Cenários** derivados dos critérios de aceite CA01–CA11, das regras de cálculo, das regras de cliente já existentes e do contrato da API, com **matriz de rastreabilidade** (requisito → cenário) em `docs/02`.
3. **Técnicas:** classes de equivalência e **análise de valor-limite** (frete em R$ 199,80 / 199,90 / 200,00; 5 e 6 unidades), tabela de decisão cupom × subtotal, testes de contrato da API, **invariantes** de cálculo e 4 sessões exploratórias (`docs/04`).
4. **Automação na camada de API**, onde as regras de negócio vivem ("os cálculos são feitos pela API e a interface apenas exibe o resultado"): rápida, estável e adequada a um ambiente compartilhado.
5. **Interface verificada manualmente**, com evidência em prints, e conferida contra o JSON da API (aba Network do navegador).

---

## 8. Estrutura do repositório

```
.
├── README.md
├── package.json / package-lock.json
├── playwright.config.ts        # projetos "api" (@auto) e "ui" (@rascunho-auto)
├── tsconfig.json
├── features/                   # cenários Gherkin em português
│   ├── cupom.feature  frete.feature  quantidade.feature  calculo.feature
│   ├── pedido.feature  api.feature  carrinho.feature  ui.feature
├── steps/
│   ├── fixtures.ts             # "mundo" de cada cenário (carrinho, resposta, ...)
│   ├── api/api.steps.ts        # frases ↔ código (API)
│   └── ui/ui.steps.ts          # frases ↔ código (UI, rascunho)
├── support/
│   ├── api.ts                  # dados da documentação, chamadas HTTP e verificações
│   ├── gherkin.ts              # leitura de valores e itens escritos nos cenários
│   └── loja.page.ts            # page object da interface (rascunho)
└── docs/
    ├── 01-premissas-e-ambiguidades.md
    ├── 02-cenarios-e-rastreabilidade.md
    ├── 03-execucao.md
    ├── 04-sessoes-exploratorias.md
    ├── 05-uso-de-ia.md
    ├── bugs/                   # BUG-001, BUG-002, BUG-003 + template e índice
    └── evidencias/             # prints e saídas da automação
```

---

## 9. Limitações e cuidados

- **Automação de interface é rascunho.** `features/ui.feature` e `support/loja.page.ts` foram escritos a partir das telas, mas os seletores **não foram validados no navegador**; por isso ficam fora do `npm test`. Para finalizar: `npx playwright install chromium`, `npm run codegen`, ajustar os seletores e trocar `SELETORES_CONFIRMADOS` para `true` em `support/loja.page.ts`. A interface foi verificada **manualmente** (evidências em `docs/evidencias/`).
- **Ambiente compartilhado:** a execução usa 2 workers, sem retries; **não há testes de carga, estresse ou segurança** (fora do escopo definido no enunciado), nem payloads de XSS ou injeção.
- **Comportamentos esperados do ambiente** (carrinho guardado só na aba, pedidos não armazenados etc.) **não foram reportados como bugs**, conforme a seção "Sobre este ambiente" da documentação.
- O ambiente muda: se a loja for corrigida, o resultado da automação muda; os relatos e as evidências refletem o comportamento em 06–08/10/2026.

---

## 10. Problemas comuns

| Sintoma | O que fazer |
|---|---|
| `npm` bloqueado no PowerShell ("execução de scripts desabilitada") | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, ou use `npm.cmd` |
| `npm ci` diz que não há `package-lock.json` | Você está numa pasta acima da certa (o zip pode criar pasta dentro de pasta). Entre na pasta que contém o `package.json` |
| Erro de "step não definido" ao rodar | A frase do `.feature` não casa com nenhuma definição em `steps/`; confira o vocabulário da seção 4 |
| Muitos testes falham com erro de conexão | Verifique a internet/VPN e se a loja abre no navegador |
| Acentos quebrados no arquivo de evidência | Use o bloco da seção 3 (`[Console]::OutputEncoding = ...`) antes do `npm test` |

---

## 11. Uso de IA

O uso de IA está declarado em [`docs/05-uso-de-ia.md`](docs/05-uso-de-ia.md): o Claude (Anthropic) foi usado como assistente para levantar cenários, rascunhar o Gherkin e as definições de passos, estruturar o repositório e rascunhar os relatórios; a execução manual e exploratória, a captura das evidências e a confirmação dos bugs foram feitas por mim na loja real.
