# language: pt
@VZS-142 @quantidade
Funcionalidade: Limite de 5 unidades por produto
  Cada produto pode ter no máximo 5 unidades por pedido.
  A regra vale para a interface e para a API (CA10).

  @CT-QTD-01 @CA10 @api @ui @auto
  Cenário: 5 unidades do mesmo produto são aceitas
    Dado que o carrinho contém 5 unidades de "Garrafa Térmica 750ml"
    Quando eu calculo o carrinho sem cupom
    Então a resposta é 200
    E o subtotal é R$ 250,00
    E o frete é R$ 0,00
    E o total é R$ 250,00

  @CT-QTD-01 @CA10 @api @ui @auto
  Cenário: 5 unidades do mesmo produto com cupom
    Dado que o carrinho contém 5 unidades de "Camiseta Essencial"
    Quando eu aplico o cupom "BEMVINDO10"
    Então o subtotal é R$ 299,50
    E o desconto é R$ 29,95
    E o frete é R$ 0,00
    E o total é R$ 269,55

  @CT-QTD-02 @CA10 @ui @manual
  Cenário: A interface impede a 6ª unidade do mesmo produto
    Dado que o carrinho contém 5 unidades de "Camiseta Essencial"
    Quando eu tento aumentar a quantidade no carrinho
    Então o botão + fica desabilitado
    E a tela informa "Limite de 5 unidades por produto."

  @CT-QTD-03 @CA10 @api @auto
  Cenário: O limite é por produto, não pelo carrinho
    Dado que o carrinho contém 5 unidades de cada um dos 8 produtos
    Quando eu aplico o cupom "BEMVINDO10"
    Então a resposta é 200
    E o subtotal é R$ 4.247,00
    E o desconto é R$ 424,70
    E o frete é R$ 0,00
    E o total é R$ 3.822,30

  @CT-QTD-04 @CA10 @ui @manual
  Cenário: O limite vale também pela listagem de produtos e a quantidade não é editável
    Dado que o carrinho contém 5 unidades de "Camiseta Essencial"
    Quando eu volto à listagem de produtos
    Então o botão "Adicionar ao carrinho" da Camiseta fica desabilitado
    E a listagem informa "Limite de 5 unidades atingido."
    E o número da quantidade no carrinho não é editável

  @CT-QTD-05 @CA10 @api @auto
  Esquema do Cenário: A API rejeita mais de 5 unidades no cálculo
    Dado que o carrinho contém <quantidade> unidades de "Camiseta Essencial"
    Quando eu calculo o carrinho sem cupom
    Então a resposta é 422 com o código "QUANTIDADE_MAXIMA_EXCEDIDA"

    Exemplos:
      | quantidade |
      | 6          |
      | 10         |
      | 100        |

  @CT-QTD-05 @CA10 @api @auto
  Cenário: A API rejeita mais de 5 unidades ao confirmar o pedido
    Dado que o carrinho contém 6 unidades de "Camiseta Essencial"
    Quando eu confirmo o pedido
    Então a resposta é 422 com o código "QUANTIDADE_MAXIMA_EXCEDIDA"

  @CT-QTD-05 @CA10 @api @auto
  Cenário: Basta um item acima do limite para rejeitar o carrinho todo
    Dado que o carrinho contém 1 unidade de "Camiseta Essencial" e 6 unidades de "Calça Jeans Slim"
    Quando eu calculo o carrinho sem cupom
    Então a resposta é 422 com o código "QUANTIDADE_MAXIMA_EXCEDIDA"

  @CT-QTD-06 @api @auto
  Esquema do Cenário: A API rejeita quantidades que não são inteiros maiores ou iguais a 1
    Dado que o carrinho contém <quantidade> unidades de "Camiseta Essencial"
    Quando eu calculo o carrinho sem cupom
    Então a resposta é 422 com o código "QUANTIDADE_INVALIDA"

    Exemplos:
      | quantidade |
      | 0          |
      | -1         |
      | 1.5        |

  @CT-QTD-07 @api @auto
  Cenário: A API rejeita o mesmo produto repetido na lista
    Dado que o carrinho contém 1 unidade de "Camiseta Essencial" e 1 unidade de "Camiseta Essencial"
    Quando eu calculo o carrinho sem cupom
    Então a resposta é 422 com o código "ITEM_DUPLICADO"
