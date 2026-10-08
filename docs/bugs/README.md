# Bugs encontrados

Um arquivo por bug (`BUG-001.md`, `BUG-002.md`, …), usando o [template](_TEMPLATE.md).

**Severidade:** *Crítica* = impede a compra ou mostra/cobra valor errado em fluxos comuns · *Alta* = regra de negócio do card violada (inclui valor errado em caso de borda) · *Média* = comportamento incorreto com alternativa · *Baixa* = cosmético, texto, usabilidade ou inconsistência sem impacto financeiro.

| ID | Título | Severidade | Cenário | Classificação | Status |
|---|---|---|---|---|---|
| [BUG-001](BUG-001.md) | Frete de R$ 19,90 cobrado com subtotal exatamente R$ 200,00 (API, tela e pedido confirmado) | Alta | CT-FRE-02, CT-FRE-05 | Bug | Aberto |
| [BUG-002](BUG-002.md) | API não valida o limite de 5 unidades por produto (/calcular e /pedidos); a interface bloqueia | Alta | CT-QTD-05 | Bug | Aberto |
| [BUG-003](BUG-003.md) | Cupom permanece ao remover o último item, mas sai em "Esvaziar carrinho" (inconsistência) | Baixa | EXP-01 | Ambiguidade/melhoria | Aberto |
