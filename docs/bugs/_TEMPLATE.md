# BUG-XXX — [o que acontece] em [onde]

| Campo | Valor |
|---|---|
| **Severidade** | Crítica / Alta / Média / Baixa |
| **Prioridade sugerida** | Alta / Média / Baixa |
| **Classificação** | Bug / Divergência da documentação / Ambiguidade-melhoria |
| **Camada** | UI / API |
| **Cenário relacionado** | CT-XXX-NN (critério de aceite: CAxx) |
| **Ambiente** | URL · versão 2.3.0 · navegador/versão · SO · data e hora |
| **Status** | Aberto |
| **Reproduzível?** | Sempre / Às vezes (n de m tentativas) |

## Pré-condições
(estado do carrinho, dados usados)

## Passos para reproduzir
1.
2.
3.

## Resultado esperado
(cite o trecho da documentação / critério de aceite)

## Resultado obtido

## Evidências
- `docs/evidencias/BUG-XXX_01-....png`
- Requisição/resposta (copie do DevTools → Network ou `curl`):

```http
POST /api/carrinho/calcular
{ ... }
```

```json
{ ... }
```

## Observações
(impacto para o cliente, workaround, teste automatizado relacionado — ex.: `tests/api/calculo.spec.ts` marcado com `test.fail()`)
