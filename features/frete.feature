# language: pt
@VZS-142 @frete
Funcionalidade: Frete grátis e frete fixo
  Como cliente da Verzel Store
  Quero ganhar frete grátis em compras maiores
  Para pagar menos nas minhas compras

  Regra: Frete grátis a partir de R$ 200,00 (inclusive); abaixo disso, frete fixo de R$ 19,90

    @CT-FRE-01 @CA07 @api @ui @auto
    Cenário: Subtotal abaixo de R$ 200,00 cobra frete fixo e informa quanto falta
      Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
      Quando eu calculo o carrinho sem cupom
      Então o subtotal é R$ 100,00
      E o frete é R$ 19,90
      E o valor faltante para o frete grátis é R$ 100,00
      E o total é R$ 119,90

    @CT-FRE-02 @CA06 @api @ui @auto
    Esquema do Cenário: Subtotal exatamente igual a R$ 200,00 tem frete grátis (limite inclusivo)
      Dado que o carrinho contém <itens>
      Quando eu calculo o carrinho sem cupom
      Então o subtotal é R$ 200,00
      E o frete é R$ 0,00
      E o valor faltante para o frete grátis é R$ 0,00
      E o total é R$ 200,00

      Exemplos:
        | itens                       |
        | 2 unidades de "Mochila Urbana 20L"       |
        | 4 unidades de "Garrafa Térmica 750ml"    |

    @CT-FRE-03 @CA06 @CA07 @api @ui @auto
    Esquema do Cenário: Subtotal logo abaixo do limite ainda cobra frete
      Dado que o carrinho contém <itens>
      Quando eu calculo o carrinho sem cupom
      Então o subtotal é <subtotal>
      E o frete é R$ 19,90
      E o valor faltante para o frete grátis é <faltante>
      E o total é <total>

      Exemplos:
        | itens                                                                   | subtotal  | faltante | total     |
        | 1 "Mochila Urbana 20L", 1 "Boné Aba Curva" e 1 "Garrafa Térmica 750ml" | R$ 199,90 | R$ 0,10  | R$ 219,80 |
        | 1 "Camiseta Essencial" e 1 "Calça Jeans Slim"                           | R$ 199,80 | R$ 0,20  | R$ 219,70 |

    @CT-FRE-04 @CA06 @api @ui @auto
    Cenário: Subtotal acima de R$ 200,00 tem frete grátis e faltante zero
      Dado que o carrinho contém 1 unidade de "Jaqueta Corta-Vento"
      Quando eu calculo o carrinho sem cupom
      Então o frete é R$ 0,00
      E o valor faltante para o frete grátis é R$ 0,00
      E o total é R$ 229,90

    @CT-FRE-07 @api @auto
    Cenário: O valor faltante nunca é negativo
      Dado que o carrinho contém 5 unidades de "Jaqueta Corta-Vento"
      Quando eu calculo o carrinho sem cupom
      Então o valor faltante para o frete grátis é R$ 0,00

    @CT-FRE-08 @CA07 @ui @manual
    Cenário: O aviso de "quanto falta" acompanha as mudanças do carrinho
      Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
      Então o carrinho informa que faltam R$ 100,00 para o frete grátis
      Quando eu adiciono mais 1 unidade de "Mochila Urbana 20L"
      Então o carrinho informa frete grátis e não exibe mais o faltante
      Quando eu removo 1 unidade de "Mochila Urbana 20L"
      Então o carrinho volta a informar que faltam R$ 100,00

  Regra: O frete grátis considera o subtotal ANTES do desconto, e o desconto não incide sobre o frete

    @CT-FRE-05 @CA08 @api @ui @auto
    Esquema do Cenário: O cupom não faz o cliente perder o frete grátis
      Dado que o carrinho contém <itens>
      Quando eu aplico o cupom "BEMVINDO10"
      Então o subtotal é <subtotal>
      E o desconto é <desconto>
      E o frete é R$ 0,00
      E o total é <total>

      Exemplos: (o total pode ficar abaixo de R$ 200,00 e ainda assim o frete é grátis)
        | itens                                                        | subtotal  | desconto | total     |
        | 2 unidades de "Mochila Urbana 20L"                           | R$ 200,00 | R$ 20,00 | R$ 180,00 |
        | 1 "Tênis Casual Urbano" e 1 "Kit 3 Pares de Meias"           | R$ 219,80 | R$ 21,98 | R$ 197,82 |

    @CT-FRE-05 @CA08 @api @ui @auto
    Cenário: O cupom não faz o cliente ganhar frete grátis
      Dado que o carrinho contém 1 "Mochila Urbana 20L", 1 "Boné Aba Curva" e 1 "Garrafa Térmica 750ml"
      Quando eu aplico o cupom "BEMVINDO10"
      Então o subtotal é R$ 199,90
      E o desconto é R$ 19,99
      E o frete é R$ 19,90
      E o valor faltante para o frete grátis é R$ 0,10
      E o total é R$ 199,81

    @CT-FRE-06 @CA09 @api @ui @auto
    Cenário: O desconto incide só sobre os produtos, nunca sobre o frete
      Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
      Quando eu aplico o cupom "BEMVINDO10"
      Então o desconto é R$ 10,00
      E o frete é R$ 19,90
      E o total é R$ 109,90
