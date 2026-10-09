# Cenários de teste e rastreabilidade

Cenários levantados a partir da documentação do card **VZS-142** (v2.3.0). Cada cenário tem um ID (`CT-…`) usado de forma consistente em: este documento, nos arquivos Gherkin (`features/*.feature`, como tag), nos cenários automatizados (Playwright BDD: `features/` + `steps/`), na planilha de execução ([03-execucao.md](03-execucao.md)) e nos bugs (`docs/bugs/`).

- **Gherkin:** `features/cupom.feature`, `frete.feature`, `quantidade.feature`, `calculo.feature`, `pedido.feature`, `api.feature`, `carrinho.feature`, `ui.feature` (em português, `# language: pt`).
- **Premissas e interpretações:** [01-premissas-e-ambiguidades.md](01-premissas-e-ambiguidades.md) (IDs `AMB-xx` citados abaixo).

## Matriz de rastreabilidade (requisito → cenários)

| Requisito | Descrição | Cenários |
|---|---|---|
| CA01 | BEMVINDO10 = 10% sobre o subtotal | CT-CUP-01, CT-CUP-09 |
| CA02 | Código sem distinção de maiúsculas; trim | CT-CUP-02, CT-CUP-08 |
| CA03 | Cupom inexistente → "Cupom inválido." | CT-CUP-03, CT-CUP-07, CT-CUP-08, CT-PED-07, CT-API-10 |
| CA04 | Cupom fora da validade → "Cupom expirado." | CT-CUP-04, CT-CUP-07, CT-PED-08, CT-API-10 |
| CA05 | Apenas um cupom por vez; trocar = remover + aplicar | CT-CUP-05, CT-CUP-06, CT-CUP-07, CT-CUP-10 |
| CA06 | Frete grátis a partir de R$ 200,00 (inclusive) | CT-FRE-02, CT-FRE-03, CT-FRE-04, EXP-02 |
| CA07 | Abaixo de R$ 200: frete R$ 19,90 e informa o faltante | CT-FRE-01, CT-FRE-03, CT-FRE-08 |
| CA08 | Frete grátis considera o subtotal antes do cupom | CT-FRE-05 |
| CA09 | Desconto não incide sobre o frete | CT-FRE-06 |
| CA10 | Máx. 5 unidades por produto (UI e API) | CT-QTD-01, CT-QTD-02, CT-QTD-03, CT-QTD-04, CT-QTD-05 |
| CA11 | Valores arredondados a 2 casas | CT-CAL-02, CT-CAL-03, EXP-02 |
| Regras de cálculo | Regras de cálculo (fórmula, frete, faltante) | CT-FRE-07, CT-CAL-01 |
| Regras existentes | Regras já existentes (nome, e-mail, CEP, pagamento na entrega) | CT-PED-03, CT-PED-04, CT-PED-05, CT-PED-06, CT-PED-10, EXP-04 |
| Pedidos | POST /api/pedidos | CT-PED-01, CT-PED-02, CT-PED-07, CT-PED-08, CT-PED-11, CT-PED-12 |
| Códigos de erro | Tabela de códigos de erro | CT-QTD-06, CT-QTD-07, CT-PED-09, CT-API-03, CT-API-04, CT-API-05, CT-API-06, CT-API-07, CT-API-08, CT-API-09 |
| Sobre este ambiente | Sobre este ambiente | CT-CAL-05, CT-CAR-03 |
| API | Endpoints GET /api/produtos* | CT-API-01, CT-API-02, CT-API-10 |

## Catálogo de cenários

Legenda — **Camada:** UI, API ou UI+API (verificado nas duas). **Automação:** o que existe no repositório hoje (os testes de UI estão em rascunho até os seletores serem confirmados). Os cenários sem automação são executados manualmente ou de forma exploratória.

### Cupom

| ID | Cenário | Requisito | Camada | Prioridade | Automação |
|---|---|---|---|---|---|
| CT-CUP-01 | BEMVINDO10 aplica 10% sobre o subtotal dos produtos | CA01 | UI+API | Alta | `cupom.feature` (BDD/API) |
| CT-CUP-02 | Código do cupom ignora maiúsculas/minúsculas e espaços nas pontas | CA02 | UI+API | Alta | `cupom.feature` (BDD/API) |
| CT-CUP-03 | Cupom inexistente: "Cupom inválido." e nenhum desconto | CA03 | UI+API | Alta | `cupom.feature` (BDD/API)<br>`ui.feature` (BDD/UI rascunho) |
| CT-CUP-04 | Cupom expirado: "Cupom expirado." e nenhum desconto | CA04 | UI+API | Alta | `cupom.feature` (BDD/API) |
| CT-CUP-05 | Reaplicar o mesmo cupom não acumula desconto (único cupom válido disponível) | CA05 | UI | Alta | — |
| CT-CUP-06 | Para trocar de cupom: remover o atual e aplicar outro | CA05 | UI | Média | — |
| CT-CUP-07 | Cupom inválido/expirado digitado com BEMVINDO10 já aplicado | CA03, CA04, CA05 | UI | Média | — |
| CT-CUP-08 | Campo de cupom vazio ou só com espaços | CA02, CA03 | UI+API | Média | — |
| CT-CUP-09 | Desconto recalculado ao mudar itens com cupom aplicado | CA01 | UI | Alta | — |
| CT-CUP-10 | Remover o cupom limpa desconto e mensagem do resumo | CA05 | UI | Média | — |

### Frete

| ID | Cenário | Requisito | Camada | Prioridade | Automação |
|---|---|---|---|---|---|
| CT-FRE-01 | Subtotal abaixo de R$ 200: frete R$ 19,90 e valor faltante informado | CA07 | UI+API | Alta | `frete.feature` (BDD/API) |
| CT-FRE-02 | Subtotal exatamente R$ 200,00: frete grátis (limite inclusivo) | CA06 | UI+API | Alta | `frete.feature` (BDD/API)<br>`ui.feature` (BDD/UI rascunho) |
| CT-FRE-03 | Subtotal R$ 199,90 / 199,80: frete cobrado e faltante R$ 0,10 / 0,20 | CA06, CA07 | UI+API | Alta | `frete.feature` (BDD/API) |
| CT-FRE-04 | Subtotal acima de R$ 200: frete grátis e faltante zero | CA06 | UI+API | Média | `frete.feature` (BDD/API) |
| CT-FRE-05 | Frete grátis avalia o subtotal ANTES do desconto do cupom | CA08 | UI+API | Alta | `frete.feature` (BDD/API) |
| CT-FRE-06 | Desconto do cupom não incide sobre o frete | CA09 | UI+API | Alta | `frete.feature` (BDD/API) |
| CT-FRE-07 | Valor faltante nunca é negativo | Regras de cálculo | API | Média | `frete.feature` (BDD/API) |
| CT-FRE-08 | Aviso de "quanto falta" acompanha adições/remoções no carrinho | CA07 | UI | Média | — |

### Quantidade

| ID | Cenário | Requisito | Camada | Prioridade | Automação |
|---|---|---|---|---|---|
| CT-QTD-01 | 5 unidades do mesmo produto são aceitas | CA10 | UI+API | Alta | `quantidade.feature` (BDD/API) |
| CT-QTD-02 | Interface impede a 6ª unidade do mesmo produto | CA10 | UI | Alta | `ui.feature` (BDD/UI rascunho) |
| CT-QTD-03 | Limite é por produto (8 produtos × 5 unidades) | CA10 | API | Média | `quantidade.feature` (BDD/API) |
| CT-QTD-04 | Limite vale para adições acumuladas (3 + 3) e para edição no carrinho | CA10 | UI | Alta | — |
| CT-QTD-05 | API rejeita 6+ unidades (/calcular e /pedidos) | CA10 | API | Alta | `quantidade.feature` (BDD/API) |
| CT-QTD-06 | API rejeita quantidade 0, negativa e decimal | Códigos de erro | API | Média | `quantidade.feature` (BDD/API) |
| CT-QTD-07 | API rejeita o mesmo produto repetido na lista | Códigos de erro | API | Média | `quantidade.feature` (BDD/API) |

### Cálculo

| ID | Cenário | Requisito | Camada | Prioridade | Automação |
|---|---|---|---|---|---|
| CT-CAL-01 | total = subtotal − desconto + frete (invariantes em vários carrinhos) | Regras de cálculo | API | Alta | `calculo.feature` (BDD/API) |
| CT-CAL-02 | Arredondamento a 2 casas, sem artefato de ponto flutuante (59,90 × 3) | CA11 | UI+API | Alta | `calculo.feature` (BDD/API) |
| CT-CAL-03 | Formatação monetária pt-BR (R$ 4.247,00) | CA11 | UI | Média | — |
| CT-CAL-04 | Valores exibidos na UI = resposta da API | Introdução (UI só exibe) | UI | Alta | — |
| CT-CAL-05 | Cálculo determinístico e sem estado | Sobre este ambiente | API | Baixa | `calculo.feature` (BDD/API) |

### Pedido

| ID | Cenário | Requisito | Camada | Prioridade | Automação |
|---|---|---|---|---|---|
| CT-PED-01 | Pedido válido: 201, número VZ-NNNNNN, CEP normalizado | Pedidos | UI+API | Alta | `pedido.feature` (BDD/API) |
| CT-PED-02 | Totais do pedido = totais do cálculo do carrinho | Pedidos | API | Alta | `pedido.feature` (BDD/API) |
| CT-PED-03 | Nome sem sobrenome é recusado | Regras existentes | UI+API | Média | `pedido.feature` (BDD/API) |
| CT-PED-04 | E-mail com formato inválido é recusado | Regras existentes | UI+API | Média | `pedido.feature` (BDD/API) |
| CT-PED-05 | CEP de 8 dígitos aceito com e sem hífen | Regras existentes | UI+API | Média | `pedido.feature` (BDD/API) |
| CT-PED-06 | CEP inválido (7/9 dígitos, letras, vazio) é recusado | Regras existentes | UI+API | Média | `pedido.feature` (BDD/API) |
| CT-PED-07 | Pedido com cupom inexistente → 422 CUPOM_INVALIDO | Pedidos, CA03 | API | Alta | `pedido.feature` (BDD/API) |
| CT-PED-08 | Pedido com cupom expirado → 422 CUPOM_EXPIRADO | Pedidos, CA04 | API | Alta | `pedido.feature` (BDD/API) |
| CT-PED-09 | Pedido sem itens (API 422 ITENS_OBRIGATORIOS; UI com carrinho vazio) | Códigos de erro | UI+API | Média | `pedido.feature` (BDD/API) |
| CT-PED-10 | Fluxo sem etapa de pagamento online (pagamento na entrega) | Regras existentes | UI | Baixa | — |
| CT-PED-11 | Fluxo completo: carrinho → cupom → dados do cliente → confirmação | Pedidos | UI | Alta | — |
| CT-PED-12 | Estado do carrinho após confirmar o pedido (comportamento não especificado) | Pedidos (AMB-12) | UI | Baixa | — |

### API

| ID | Cenário | Requisito | Camada | Prioridade | Automação |
|---|---|---|---|---|---|
| CT-API-01 | GET /api/produtos lista os 8 produtos | API | API | Média | `api.feature` (BDD/API) |
| CT-API-02 | GET /api/produtos/{id}: 200 e 404 | API | API | Média | `api.feature` (BDD/API) |
| CT-API-03 | Rota inexistente → 404 ROTA_NAO_ENCONTRADA | Códigos de erro | API | Baixa | `api.feature` (BDD/API) |
| CT-API-04 | Método não permitido → 405 METODO_NAO_PERMITIDO | Códigos de erro | API | Baixa | `api.feature` (BDD/API) |
| CT-API-05 | JSON malformado ou corpo que não é objeto → 400 JSON_INVALIDO | Códigos de erro | API | Média | `api.feature` (BDD/API) |
| CT-API-06 | Itens ausentes ou vazios → 422 ITENS_OBRIGATORIOS | Códigos de erro | API | Média | `api.feature` (BDD/API) |
| CT-API-07 | Item que não é objeto → 422 ITEM_INVALIDO | Códigos de erro | API | Média | `api.feature` (BDD/API) |
| CT-API-08 | Produto inexistente no item → 422 PRODUTO_NAO_ENCONTRADO | Códigos de erro | API | Média | `api.feature` (BDD/API) |
| CT-API-09 | Formato padrão do erro (codigo, mensagem, campo) | Códigos de erro | API | Média | `api.feature` (BDD/API) |
| CT-API-10 | /calcular tolera cupom inválido (200); /pedidos não (422) | API, CA03, CA04 | API | Alta | `api.feature` (BDD/API)<br>`pedido.feature` (BDD/API) |

### Carrinho

| ID | Cenário | Requisito | Camada | Prioridade | Automação |
|---|---|---|---|---|---|
| CT-CAR-01 | Contador do cabeçalho reflete o carrinho | Geral (AMB-11) | UI | Média | — |
| CT-CAR-02 | Remover item atualiza itens, resumo e contador | Geral | UI | Média | — |
| CT-CAR-03 | Carrinho persiste ao recarregar a aba; outra aba/anônima começa vazia (esperado) | Sobre este ambiente (AMB-13) | UI | Baixa | — |
| CT-CAR-04 | Carrinho vazio: estado exibido e confirmação do pedido bloqueada | Geral (AMB-10) | UI | Média | — |
| CT-CAR-05 | Alterar quantidade atualiza item, subtotal, frete e total | Geral | UI | Alta | — |

### Exploratório

| ID | Cenário | Requisito | Camada | Prioridade | Automação |
|---|---|---|---|---|---|
| EXP-01 | Sequências de adicionar/remover/alterar quantidade/cupom (consistência do estado) | Todos | UI | Alta | — |
| EXP-02 | Limites monetários: 199,80 / 199,90 / 200,00 / 200,10 e valor máximo | CA06–CA11 | UI+API | Alta | — |
| EXP-03 | Usabilidade, responsividade, teclado, console e rede | Geral | UI | Média | — |
| EXP-04 | Entradas atípicas nos campos (acentos, espaços duplos, tamanhos) — sem payloads de segurança | Regras existentes | UI+API | Média | — |

## Charters dos testes exploratórios

Sessões com tempo definido (sugestão: 30–45 min cada), registrando o que foi feito e o que foi observado em [03-execucao.md](03-execucao.md).

**EXP-01 — Sequências no carrinho.** *Missão:* explorar combinações de adicionar, remover, alterar quantidade e aplicar/remover cupom, procurando inconsistências entre itens, resumo e contador. *Ideias:* aplicar cupom com carrinho vazio; aplicar cupom → esvaziar → adicionar item (o cupom permanece?); cruzar o limite de R$ 200 para cima e para baixo várias vezes; recarregar a página em cada passo; botão voltar; cliques rápidos/duplo clique em "Aplicar" e "Adicionar"; duas abas (carrinhos independentes é o esperado).

**EXP-02 — Limites monetários.** *Missão:* exercitar valores ao redor dos limites do frete e valores altos. *Ideias:* 199,80 · 199,90 · 200,00 · 200,10 (ex.: 4×P004 + P008 + …); 3×P001 (artefato de ponto flutuante); todos os produtos × 5 (R$ 4.247,00 — formatação e quebra de layout); desconto com centavos.

**EXP-03 — Usabilidade, responsividade e acessibilidade básica.** *Missão:* avaliar a experiência do fluxo de cupom e checkout. *Ideias:* viewport de celular (375 px); navegação só por teclado (Tab/Enter) no cupom; rótulos e foco; mensagens de erro legíveis e próximas do campo; acentuação e textos em português; console do navegador e aba Network (4xx/5xx inesperados, chamadas duplicadas); estados de carregamento.

**EXP-04 — Entradas atípicas (sem segurança).** *Missão:* verificar robustez dos campos com dados legítimos incomuns. *Ideias:* nomes com acento/apóstrofo/hífen ("D'Ávila", "Ana-Maria Souza"), espaços duplos, nome muito longo; e-mails válidos incomuns (`maria+teste@sub.exemplo.com.br`); CEP com espaços; cupom com símbolos ("BEM-VINDO10", "BEMVINDO10!") ou muito longo. **Não** usar payloads de XSS/SQL injection: segurança está fora do escopo e o ambiente é compartilhado.
