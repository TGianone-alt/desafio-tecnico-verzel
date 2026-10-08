# language: pt
@VZS-142 @quantidade
Funcionalidade: Limite de 5 unidades por produto
  Cada produto pode ter no máximo 5 unidades por pedido.
  A regra vale para a interface e para a API (CA10).

  @CT-QTD-01 @CA10 @api @ui @auto
  Cenário: 5 unidades do mesmo produto são aceitas
    Dado que o carrinho contém 5 unidades de "Garrafa Térmica 750ml"
    Quando eu calculo o carrinho sem cupom
    Então o subtotal é R$ 250,00
    E o frete é R$ 0,00

  @CT-QTD-02 @CA10 @ui @rascunho-auto
  Cenário: A interface impede a 6ª unidade do mesmo produto
    Dado que o carrinho contém 5 unidades de "Camiseta Essencial"
    Quando eu tento adicionar mais 1 unidade de "Camiseta Essencial"
    Então a quantidade continua sendo 5
    E a interface informa o limite ou desabilita a ação (AMB-04)

  @CT-QTD-03 @CA10 @api @auto
  Cenário: O limite é por produto, não pelo carrinho
    Dado que o carrinho contém 5 unidades de cada um dos 8 produtos
    Quando eu aplico o cupom "BEMVINDO10"
    Então o subtotal é R$ 4.247,00
    E o desconto é R$ 424,70
    E o total é R$ 3.822,30

  @CT-QTD-04 @CA10 @ui @manual
  Cenário: O limite vale para adições acumuladas, em telas diferentes
    Dado que o carrinho contém 3 unidades de "Boné Aba Curva"
    Quando eu adiciono mais 3 unidades de "Boné Aba Curva" pela listagem de produtos
    Então a quantidade final não ultrapassa 5
    # também tentar: digitar 6 ou 99 no campo de quantidade do carrinho (se for editável)

  @CT-QTD-05 @CA10 @api @auto
  Esquema do Cenário: A API rejeita mais de 5 unidades
    Quando eu envio <endpoint> com 6 unidades de "Camiseta Essencial"
    Então a resposta é 422 com o código "QUANTIDADE_MAXIMA_EXCEDIDA"

    Exemplos:
      | endpoint                 |
      | POST /api/carrinho/calcular |
      | POST /api/pedidos           |

  @CT-QTD-06 @api @auto
  Esquema do Cenário: A API rejeita quantidades que não são inteiros maiores ou iguais a 1
    Quando eu envio POST /api/carrinho/calcular com <quantidade> unidade(s) de "Camiseta Essencial"
    Então a resposta é 422 com o código "QUANTIDADE_INVALIDA"
    E o campo apontado é "itens[0].quantidade"

    Exemplos:
      | quantidade |
      | 0          |
      | -1         |
      | 1.5        |

  @CT-QTD-07 @api @auto
  Cenário: A API rejeita o mesmo produto repetido na lista
    Quando eu envio POST /api/carrinho/calcular com "Camiseta Essencial" duas vezes, 1 unidade cada
    Então a resposta é 422 com o código "ITEM_DUPLICADO"
