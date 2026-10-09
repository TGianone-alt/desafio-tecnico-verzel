# Sessões de teste exploratório

Quatro sessões com missão definida (charters do [docs/02](02-cenarios-e-rastreabilidade.md)), de cerca de 30 minutos cada. O objetivo não é seguir um roteiro, e sim investigar com curiosidade e registrar **o que foi feito, o que foi observado e o que ficou em dúvida**.

**Como preencher:** cronometre cerca de 30 minutos por sessão. Enquanto explora, anote em poucas linhas. Se achar algo estranho, tire print (`EXP-0X_nn-descricao.png` em `docs/evidencias`) e confirme se é bug (abra `BUG-003.md`...) ou só observação. Apague as linhas de ideia que não usar.

**Ambiente:** Google Chrome, Windows. Datas: 06 e 07/10/2026.

---

## EXP-01 — Sequências no carrinho
**Missão:** explorar combinações de adicionar, remover, alterar quantidade e aplicar/remover cupom, procurando inconsistências entre itens, resumo e contador.

**Ideias:**
- Aplicar o cupom e depois esvaziar o carrinho. Adicionar um item de novo: o cupom continua aplicado?
- Aplicar o cupom e recarregar a página (F5): o cupom permanece?
- Cruzar o limite de R$ 200,00 várias vezes (adicionar e remover itens) e conferir frete e aviso em cada passo.
- Cliques rápidos (ou duplo clique) em "Aplicar cupom", "+" e "Confirmar pedido": gera comportamento duplicado?
- Abrir a página do formulário de finalizar compra com o carrinho vazio (pela URL) e usar o botão voltar do navegador depois de confirmar um pedido.
- "Esvaziar carrinho" pede confirmação ou esvazia direto?

| Campo | Anotações |
|---|---|
| Duração | não cronometrada |
| O que fiz | Apliquei cupom e esvaziei o carrinho de dois jeitos (Esvaziar carrinho e Remover o único item); recarreguei a página (F5) com cupom aplicado; cruzei o limite de R$ 200,00 várias vezes; dei cliques duplos nos botões; abri /checkout com o carrinho vazio; usei o botão voltar do navegador depois de confirmar um pedido. |
| O que observei | F5 mantém carrinho e cupom. Cruzar o limite de R$ 200,00 responde corretamente (exceto no valor exato, BUG-001). Cliques duplos não alteram nada. /checkout com carrinho vazio mostra 'Seu carrinho está vazio'. O botão voltar após o pedido mostra o carrinho vazio. 'Esvaziar carrinho' age sem pedir confirmação. O cupom sai em 'Esvaziar carrinho', mas permanece ao remover o último item e adicionar outro. |
| Bugs / dúvidas | BUG-003 (inconsistência do cupom ao esvaziar o carrinho). Observação: 'Esvaziar carrinho' sem confirmação. |
| Evidências | EXP-01_01-esvaziar-remove-cupom.png; EXP-01_02-remover-item-mantem-cupom.png |

---

## EXP-02 — Limites monetários
**Missão:** exercitar valores ao redor dos limites do frete e valores altos.

**Ideias:**
- 199,80 (Camiseta + Calça), 199,90 (Mochila + Boné + Garrafa), 200,00 (2 Mochilas), 219,80 (Tênis + Meias), 229,90 (Jaqueta): conferir frete, aviso e total, com e sem cupom.
- Valor máximo: 5 unidades de cada um dos 8 produtos (subtotal R$ 4.247,00, desconto R$ 424,70): o layout aguenta? A formatação mantém ponto de milhar?
- Valores com centavos no desconto (ex.: 3 Camisetas com cupom: R$ 17,97).

| Campo | Anotações |
|---|---|
| Duração | não cronometrada |
| O que fiz | Testei subtotais ao redor do limite (199,60; 199,80; 199,90; 200,00; 219,80; 229,90), o valor máximo (5 unidades de cada um dos 8 produtos) com e sem cupom e valores com centavos no desconto. |
| O que observei | Todos os valores responderam corretamente, com ponto de milhar e centavos certos, exceto o subtotal exato de R$ 200,00: a tela ainda cobra o frete e diz 'Faltam R$ 0,00 para o frete grátis'. |
| Bugs / dúvidas | BUG-001 (já reportado; sem bug novo). |
| Evidências | BUG-001_02; BUG-001_06 |

---

## EXP-03 — Usabilidade, responsividade e acessibilidade básica
**Missão:** avaliar a experiência do fluxo de cupom e checkout.

**Ideias:**
- Tela de celular (F12 → ícone de celular, largura 375 px): carrinho, cupom e formulário continuam usáveis? Algo é cortado ou sobrepõe?
- Navegar só com o teclado (Tab, Enter, Espaço): dá para adicionar produto, aplicar cupom e finalizar? O foco aparece nos elementos?
- As mensagens de erro ficam perto do campo e são claras? Textos com acentuação correta?
- Zoom em 200%: o layout quebra?
- Console do navegador (F12 → Console) e aba Network: erros inesperados ou chamadas repetidas?
- Já observado: 2 requisições de fonte falharam uma vez e não se repetiram após F5 (não é bug).

| Campo | Anotações |
|---|---|
| Duração | não cronometrada |
| O que fiz | Executei as ideias do charter: tela de celular, zoom, navegação, mensagens de erro e console do navegador. |
| O que observei | Tudo respondeu como esperado: nada sobreposto ou cortado em celular e com zoom; console sem erros relevantes (uma falha momentânea de fonte no primeiro carregamento não se repetiu). |
| Bugs / dúvidas | Nenhum bug. |
| Evidências | — |

---

## EXP-04 — Entradas atípicas (sem segurança)
**Missão:** verificar a robustez dos campos com dados legítimos incomuns.

**Ideias:**
- Nome: "João da Silva", "D'Ávila Souza", "Ana-Maria Souza", "Maria  Silva" (dois espaços), "Maria S", nome muito longo (uns 200 caracteres).
- E-mail: `maria+teste@sub.exemplo.com.br`, e-mail em maiúsculas, com espaço no começo ou no fim.
- CEP: `01310 100` (espaço), `01310-100 ` (espaço no fim), `00000-000`, letras (já visto: o campo deixa digitar letras; o que acontece ao confirmar?).
- Cupom: `BEM-VINDO10`, `BEMVINDO10!`, `bemvíndo10` (acento), código muito longo.
- **Não** usar payloads de segurança (XSS, SQL injection) nem carga: estão fora do escopo e o ambiente é compartilhado.

| Campo | Anotações |
|---|---|
| Duração | não cronometrada |
| O que fiz | Testei entradas atípicas em todos os campos de texto (nome, e-mail, CEP e cupom), sem payloads de segurança. |
| O que observei | Tudo respondeu como esperado. O campo de nome aceita vários espaços entre nome e sobrenome e os campos não aparentam ter limite de caracteres. Com 8 letras no CEP aparece 'Informe um CEP com 8 dígitos.'. |
| Bugs / dúvidas | Nenhum bug. Observações de melhoria (a documentação não define): limite de caracteres e normalização de espaços no nome. |
| Evidências | — |
