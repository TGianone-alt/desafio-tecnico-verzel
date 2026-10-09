# Uso de IA neste teste

O enunciado permite o uso de IA e pede que se conte **onde e como** ela foi usada. Este arquivo registra isso; o mesmo texto foi usado no campo "Onde e como você usou IA" do formulário de envio.

**Ferramenta:** Claude (Anthropic), em conversa de chat, ao longo de todo o teste.

## O que a IA fez
- Leitura da documentação e levantamento inicial de cenários, valores-limite e ambiguidades (`docs/01`, `docs/02`).
- Rascunho dos cenários em Gherkin (`features/`) e das definições de passos que os executam com Playwright BDD (`steps/`, `support/`).
- Estrutura do repositório, configuração do Playwright e geração das tabelas e templates (`docs/03`, `docs/04`, templates de bug e de evidências).
- Rascunho dos reports de bug e do README, a partir das evidências que eu fui trazendo (respostas da API, prints e resultados dos testes).
- Rascunho do page object e do cenário de UI (`support/loja.page.ts`, `features/ui.feature`). **Esta parte é rascunho e não foi validada contra a interface real**; por isso fica fora da execução padrão.

## O que eu fiz (sem delegar)
- Executei todos os testes manuais e exploratórios na loja real, pela interface e pela API, e registrei os resultados.
- Capturei todas as evidências (prints do terminal, do navegador e do DevTools).
- Rodei a automação na loja real, reproduzi manualmente cada falha antes de tratá-la como bug e confirmei os bugs na interface.
- Conferi o material gerado com a documentação, ajustei o que não batia e criei o repositório.

## Como o material gerado por IA foi validado
- A suíte BDD de API foi executada contra um simulador local escrito a partir da documentação (119 cenários passando) e contra versões dele com bugs plantados (limite do frete exclusivo, frete calculado depois do desconto, ausência de arredondamento e cupom sensível a maiúsculas): todos foram detectados. O simulador não faz parte do repositório.
- Os valores esperados vêm exclusivamente da documentação. As falhas encontradas na loja real foram reproduzidas manualmente (API e interface) antes de virarem bug.
- Interpretações de trechos ambíguos estão em `docs/01-premissas-e-ambiguidades.md`.

## Texto usado no formulário
> Usei o Claude (Anthropic) como assistente durante todo o teste. Ele me ajudou a levantar cenários e valores-limite a partir da documentação, a rascunhar os cenários em Gherkin e as definições de passos em Playwright/TypeScript (BDD), a estruturar o repositório e a rascunhar os reports de bug, o README e as tabelas de execução. A execução manual e exploratória na loja real, a captura das evidências, a reprodução e confirmação dos bugs (pela API e pela interface) e a conferência de todo o material gerado foram feitas por mim. A parte de automação de UI está em rascunho e não foi validada contra a interface real.
