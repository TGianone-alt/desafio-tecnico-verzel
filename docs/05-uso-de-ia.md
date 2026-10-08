# Uso de IA neste teste

## O que a IA (Claude, da Anthropic) fez

- [ ] Leitura da documentação e levantamento inicial de cenários, ambiguidades e valores-limite (`docs/01`, `docs/02`).
- [ ] Rascunho dos cenários em Gherkin (`features/`).
- [ ] Estrutura do repositório, configuração do Playwright e escrita da suíte de testes de API (`tests/api/`).
- [ ] Rascunho do page object e dos testes de UI (`tests/e2e/`) — **não validados contra a interface real** até os seletores serem confirmados.
- [ ] Templates de bug, de evidências e deste README.

Validação feita sobre o código gerado: a suíte de API foi executada contra um mock local escrito a partir da documentação (102 testes passando) e contra versões do mock com bugs plantados (limite do frete exclusivo, frete calculado após o desconto, ausência de arredondamento, cupom sensível a maiúsculas) para confirmar que os testes os detectam. O mock não faz parte do repositório.

## O que foi feito por mim (sem delegar à IA)

- [ ] Execução manual e exploratória na loja real, com os resultados em `docs/03-execucao.md`.
- [ ] Captura das evidências (`docs/evidencias/`).
- [ ] Confirmação de cada bug na aplicação real e redação final dos reports (`docs/bugs/`).
- [ ] Execução da automação no ambiente real e conferência dos resultados.
- [ ] Revisão e ajuste de todo o material gerado com IA.

> Usei o Claude (Anthropic) como assistente. Ele me ajudou a (1) estruturar o repositório, (2) levantar cenários e valores-limite a partir da documentação e rascunhar os cenários em Gherkin, (3) escrever a suíte de testes de API em Playwright/TypeScript e (4) montar os templates de bug e evidências. A execução manual e exploratória, a captura das evidências, a confirmação e o report dos bugs foram feitos por mim na loja real, e revisei/ajustei todo o material gerado.