# Premissas, interpretações e observações sobre a documentação

Fonte única de requisitos: documentação do card **VZS-142 — Cupom de desconto e frete grátis** (versão 2.3.0, publicada em 30/09/2026), em `/documentacao` da Verzel Store. O enunciado pede que ambiguidades sejam registradas com a interpretação adotada; este documento faz isso. Cada item tem um ID (`AMB-xx`) citado nos cenários e nos bugs.

## 1. Comportamentos do ambiente que **não** foram reportados como bug

Conforme a seção "Sobre este ambiente" da documentação:

- O carrinho fica guardado só na aba do navegador (outra aba, outro navegador ou janela anônima começam vazios).
- Pedidos não são armazenados: o número gerado é fictício e não existe consulta de pedidos.
- Nenhum e-mail é enviado e nenhuma cobrança é feita.
- Produtos, preços e cupons são fixos e iguais para todos; não há controle de estoque.
- A API não guarda estado entre chamadas.
- Fora do escopo: login, cadastro de clientes, pagamento online, consulta de pedidos — e, pelo enunciado, testes de carga, estresse e segurança (o ambiente é compartilhado).

## 2. Ambiguidades e interpretação adotada

| ID | Trecho / tema | Ambiguidade | Interpretação adotada | Tratamento nos testes |
|
| AMB-01 | CA05 — um cupom por vez | Só existe **um** cupom válido (BEMVINDO10); o outro está expirado. Não dá para aplicar "dois cupons válidos". A UI ao tentar um 2º cupom (mensagem, bloqueio ou troca automática) não está definida. | O desconto nunca pode acumular (reaplicar BEMVINDO10 mantém 10%, não 20%). Para trocar, o cliente remove o atual e aplica outro. Se a UI só não tiver mensagem específica, registro como observação, não como bug. | CT-CUP-05, CT-CUP-06 (manuais) |
| AMB-02 | CA03/CA04 com cupom válido já aplicado | "Nenhum desconto é aplicado" pode ser lido como (a) o cupom rejeitado não é aplicado e o vigente permanece, ou (b) o desconto some. | (a): o cupom rejeitado não altera o cupom vigente. Divergência será reportada como "ambiguidade/melhoria", com severidade baixa. | CT-CUP-07 (manual) |
| AMB-03 | Campo de cupom vazio ou só com espaços | A documentação não diz se isso é "cupom inválido" ou "sem cupom". | Não pode haver desconto, erro técnico (5xx, tela quebrada) nem alteração do cupom vigente. A mensagem exata fica livre. | CT-CUP-08 (manual/exploratório) |
| AMB-04 | CA10 — limite de 5 unidades | Não define como a UI se comporta (botão desabilitado, aviso, truncamento) nem se `/calcular` também aplica o limite. | A UI deve impedir passar de 5 por produto, de forma cumulativa (listagem + carrinho). A API aplica o limite em **`/calcular` e `/pedidos`** (o CA10 diz que vale para a API e a tabela de erros não diferencia endpoint). | CT-QTD-02, 04, 05 |
| AMB-05 | Quantidade `"2"` (texto), `null` ou ausente | Pode ser `QUANTIDADE_INVALIDA` ou `ITEM_INVALIDO` (o item "não é um objeto com produtoId e quantidade"). | Qualquer um dos dois é aceitável (422); o que não pode é erro 5xx ou cálculo com valor estranho. | Exploratório (EXP-04), **não automatizado** |
| AMB-06 | Vários erros no mesmo pedido | A ordem de validação não é definida (ex.: item inválido + cliente inválido). | Apenas um erro é retornado e a ordem não é critério de aprovação. | Não asserido; cada teste automatizado provoca um erro por vez |
| AMB-07 | `DADOS_INVALIDOS` — "detalhes vêm em `campos`" | O formato geral do erro usa `campo` (singular); para `DADOS_INVALIDOS` a tabela cita `campos` (plural). | Esperar `campos` nesse caso. Se a resposta trouxer `campo`, ou nenhum dos dois, será registrado como divergência de documentação. | Verificação manual; os testes checam só o `codigo` |
| AMB-08 | "Nome e sobrenome" | Mínimo de caracteres? Espaços sobrando? Partículas ("da", "de")? | Válido: ao menos duas palavras separadas por espaço (ex.: "João da Silva"). Inválido: uma palavra ou vazio. Casos como `"Maria "` (espaço no fim) ficam para exploração. | CT-PED-03 (`Maria`, vazio) e EXP-04 |
| AMB-09 | E-mail "com formato válido" e CEP | Qual padrão de e-mail? `maria@exemplo` (sem domínio de topo) vale? CEP com hífen em posição errada (`0131-0100`)? | E-mail: `usuario@dominio.tld`. CEP: 8 dígitos, hífen opcional só na forma `00000-000`; a resposta devolve 8 dígitos sem hífen (exemplo da doc). Casos duvidosos não são automatizados. | CT-PED-04/05/06 + EXP-04 |
| AMB-10 | Carrinho vazio na UI | Não há critério sobre o que exibir nem se o frete é cobrado sem itens. | Sem itens: sem frete cobrado e sem possibilidade de confirmar pedido. Na API, lista vazia → `ITENS_OBRIGATORIOS`. | CT-CAR-04, CT-PED-09 |
| AMB-11 | Contador do carrinho no cabeçalho | Soma de unidades ou de produtos distintos? | Soma das unidades. Se for outra coisa, registrar como observação (não bug). | CT-CAR-01 |
| AMB-12 | Estado após confirmar o pedido | Não se sabe se o carrinho é esvaziado. | Sem expectativa fixa; apenas registrar o comportamento e verificar que não gera inconsistência. | CT-PED-12 (exploratório) |
| AMB-13 | Persistência do carrinho | "Guardado apenas na aba" não diz se sobrevive a recarregar a página. | Recarregar a mesma aba mantém o carrinho; outra aba/anônima começa vazia (esperado, não é bug). | CT-CAR-03 |
| AMB-14 | CA11 — arredondamento | Com os preços e o cupom da documentação (todos múltiplos de R$ 0,10), 10% do subtotal **sempre** resulta em centavos exatos: a regra de arredondamento (meio para cima?) não é observável pelo cupom válido. | CA11 é verificado como: todo valor monetário da API é um número com no máximo 2 casas decimais **na representação JSON**, e as contas fecham em centavos. O caso 3×P001 (59,90 × 3 = 179.70000000000002 em ponto flutuante) detecta falta de arredondamento. | CT-CAL-02, CT-CAL-01 |
| AMB-15 | Resposta de `/calcular` sem cupom; `Content-Type` | A doc não diz como vem o campo `cupom` quando não é enviado (ausente? `null`?), nem o que ocorre sem o cabeçalho `Content-Type`. | Não asserido. Qualquer das formas é aceita; sem `Content-Type` fica para exploração (esperado: 4xx, nunca 5xx). | Exploratório |

## 3. Observações sobre a própria documentação

Pontos que não são bugs da loja, mas que valem registro (e podem virar sugestões de melhoria):

1. **Só um cupom válido** limita a cobertura do CA05 (ver AMB-01).
2. **Mensagens da UI não estão especificadas** além de "Cupom inválido." e "Cupom expirado." (CA03/CA04); a mensagem de sucesso só aparece no JSON da API (`Cupom aplicado: 10% de desconto nos produtos.`). Textos de aviso do frete ("quanto falta") e do limite de 5 unidades também não são definidos.
3. **`campo` × `campos`** (AMB-07).
4. A doc de `/pedidos` traz `valorFaltanteFreteGratis: 100` para subtotal 100, consistente com a regra "R$ 200 menos o subtotal"; o exemplo foi usado como caso de teste (CT-PED-01 e CT-FRE-06).

## 4. Cuidados com o ambiente compartilhado

- Execução da automação com no máximo 2 workers, sem retries e sem laços de carga (`playwright.config.ts`).
- Nada de testes de segurança (XSS, injeção etc.), carga ou estresse — fora do escopo.
- O carrinho é por aba: testes manuais devem usar uma única aba por cenário.
