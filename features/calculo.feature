# language: pt
@VZS-142 @calculo
Funcionalidade: Cálculo do carrinho
  total = subtotal - desconto + frete, com todos os valores arredondados para 2 casas decimais (CA11).

  @CT-CAL-01 @api @auto
  Esquema do Cenário: A fórmula do total e as regras de frete valem para qualquer carrinho (sem cupom)
    Dado que o carrinho contém <itens>
    Quando eu calculo o carrinho sem cupom
    Então a resposta é 200
    E os valores respeitam as regras de cálculo

    Exemplos:
      | itens                                                           |
      | 1 unidade de "Camiseta Essencial"                               |
      | 3 unidades de "Camiseta Essencial"                              |
      | 1 "Tênis Casual Urbano" e 1 "Kit 3 Pares de Meias"              |
      | 5 unidades de "Jaqueta Corta-Vento"                             |
      | 4 unidades de "Boné Aba Curva"                                  |
      | 2 unidades de "Mochila Urbana 20L"                              |
      | 1 "Garrafa Térmica 750ml" e 2 "Kit 3 Pares de Meias"            |
      | 1 "Camiseta Essencial", 1 "Calça Jeans Slim" e 1 "Boné Aba Curva" |

  @CT-CAL-01 @api @auto
  Esquema do Cenário: A fórmula do total e as regras de frete valem para qualquer carrinho (com cupom)
    Dado que o carrinho contém <itens>
    Quando eu aplico o cupom "BEMVINDO10"
    Então a resposta é 200
    E os valores respeitam as regras de cálculo

    Exemplos:
      | itens                                                           |
      | 1 unidade de "Camiseta Essencial"                               |
      | 3 unidades de "Camiseta Essencial"                              |
      | 1 "Tênis Casual Urbano" e 1 "Kit 3 Pares de Meias"              |
      | 5 unidades de "Jaqueta Corta-Vento"                             |
      | 4 unidades de "Boné Aba Curva"                                  |
      | 2 unidades de "Mochila Urbana 20L"                              |
      | 1 "Garrafa Térmica 750ml" e 2 "Kit 3 Pares de Meias"            |
      | 1 "Camiseta Essencial", 1 "Calça Jeans Slim" e 1 "Boné Aba Curva" |

  # 59,90 × 3 = 179.70000000000002 em ponto flutuante: um cálculo sem arredondamento vazaria isso (CA11)
  @CT-CAL-02 @CA11 @api @ui @auto
  Cenário: Valores com no máximo 2 casas decimais, sem artefato de ponto flutuante (sem cupom)
    Dado que o carrinho contém 3 unidades de "Camiseta Essencial"
    Quando eu calculo o carrinho sem cupom
    Então o subtotal é R$ 179,70
    E o desconto é R$ 0,00
    E o frete é R$ 19,90
    E o valor faltante para o frete grátis é R$ 20,30
    E o total é R$ 199,60

  @CT-CAL-02 @CA11 @api @ui @auto
  Cenário: Valores com no máximo 2 casas decimais, sem artefato de ponto flutuante (com cupom)
    Dado que o carrinho contém 3 unidades de "Camiseta Essencial"
    Quando eu aplico o cupom "BEMVINDO10"
    Então o subtotal é R$ 179,70
    E o desconto é R$ 17,97
    E o frete é R$ 19,90
    E o valor faltante para o frete grátis é R$ 20,30
    E o total é R$ 181,63

  @CT-CAL-03 @CA11 @ui @manual
  Cenário: Formatação monetária no padrão brasileiro
    Dado que o carrinho contém 5 unidades de cada um dos 8 produtos
    Então os valores aparecem como "R$ 4.247,00" (ponto no milhar, vírgula nos centavos)

  @CT-CAL-04 @ui @manual
  Cenário: Os valores exibidos na interface são os calculados pela API
    Dado que o carrinho contém 2 unidades de "Mochila Urbana 20L"
    Quando eu aplico o cupom "bemvindo10"
    Então subtotal, desconto, frete e total exibidos são iguais aos da resposta de /api/carrinho/calcular

  @CT-CAL-05 @api @auto
  Cenário: O cálculo não guarda estado entre chamadas
    Dado que o carrinho contém 1 unidade de "Calça Jeans Slim" e 2 unidades de "Boné Aba Curva"
    Quando eu calculo o carrinho duas vezes com o cupom "BEMVINDO10"
    Então as duas respostas são idênticas
