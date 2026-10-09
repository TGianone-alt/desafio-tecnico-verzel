# language: pt
@VZS-142 @pedido
Funcionalidade: Confirmação do pedido
  O pagamento é feito na entrega; não existe etapa de pagamento online.

  @CT-PED-01 @api @auto
  Cenário: Pedido válido com cupom é criado com número no formato VZ-000000
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    Quando eu confirmo o pedido com o cupom "BEMVINDO10"
    Então a resposta é 201
    E o número do pedido segue o formato VZ-NNNNNN
    E o CEP do cliente é devolvido como "01310100"
    E o cupom está aplicado
    E o subtotal é R$ 100,00
    E o desconto é R$ 10,00
    E o frete é R$ 19,90
    E o frete grátis está inativo
    E o valor faltante para o frete grátis é R$ 100,00
    E o total é R$ 109,90

  @CT-PED-01 @api @auto
  Cenário: Pedido válido sem cupom e com frete grátis
    Dado que o carrinho contém 1 unidade de "Jaqueta Corta-Vento"
    Quando eu confirmo o pedido
    Então a resposta é 201
    E o número do pedido segue o formato VZ-NNNNNN
    E o subtotal é R$ 229,90
    E o desconto é R$ 0,00
    E o frete é R$ 0,00
    E o frete grátis está ativo
    E o total é R$ 229,90

  @CT-PED-02 @api @auto
  Esquema do Cenário: Os totais do pedido são iguais aos do cálculo do carrinho (com cupom)
    Dado que o carrinho contém <itens>
    Quando eu aplico o cupom "BEMVINDO10"
    E eu confirmo o pedido com o mesmo carrinho e o cupom "BEMVINDO10"
    Então os valores do pedido são iguais aos do cálculo

    Exemplos:
      | itens                                                  |
      | 1 unidade de "Calça Jeans Slim" e 2 unidades de "Boné Aba Curva" |
      | 2 unidades de "Mochila Urbana 20L"                     |

  @CT-PED-02 @api @auto
  Cenário: Os totais do pedido são iguais aos do cálculo do carrinho (sem cupom)
    Dado que o carrinho contém 3 unidades de "Camiseta Essencial"
    Quando eu calculo o carrinho sem cupom
    E eu confirmo o pedido com o mesmo carrinho sem cupom
    Então os valores do pedido são iguais aos do cálculo

  @CT-PED-02 @CA02 @api @auto
  Cenário: Cupom em minúsculas e com espaços também é aceito no pedido
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    Quando eu confirmo o pedido com o cupom "  bemvindo10 "
    Então a resposta é 201
    E o cupom está aplicado
    E o desconto é R$ 10,00

  @CT-PED-03 @api @ui @auto
  Esquema do Cenário: O nome precisa ter nome e sobrenome
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    Quando eu confirmo o pedido com o nome <nome>
    Então a resposta é 422 com o código "DADOS_INVALIDOS"

    Exemplos:
      | nome    |
      | "Maria" |
      | ""      |

  @CT-PED-04 @api @ui @auto
  Esquema do Cenário: O e-mail precisa ter formato válido
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    Quando eu confirmo o pedido com o e-mail <email>
    Então a resposta é 422 com o código "DADOS_INVALIDOS"

    Exemplos:
      | email                  |
      | "maria"                |
      | "maria@"               |
      | "@exemplo.com"         |
      | "maria.exemplo.com"    |
      | "maria@@exemplo.com"   |
      | ""                     |

  @CT-PED-05 @api @ui @auto
  Esquema do Cenário: CEP com 8 dígitos é aceito com ou sem hífen
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    Quando eu confirmo o pedido com o CEP <cep>
    Então a resposta é 201
    E o CEP do cliente é devolvido como "01310100"

    Exemplos:
      | cep         |
      | "01310-100" |
      | "01310100"  |

  @CT-PED-06 @api @ui @auto
  Esquema do Cenário: CEP inválido é recusado
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    Quando eu confirmo o pedido com o CEP <cep>
    Então a resposta é 422 com o código "DADOS_INVALIDOS"

    Exemplos:
      | cep           |
      | "1234567"     |
      | "123456789"   |
      | "01310-10"    |
      | "ABCDE-FGH"   |
      | ""            |

  @CT-PED-07 @CT-PED-08 @CT-API-10 @api @auto
  Esquema do Cenário: No pedido, cupom inválido ou expirado é erro (diferente do cálculo, que responde 200)
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    Quando eu confirmo o pedido com o cupom <cupom>
    Então a resposta é 422 com o código "<codigo>"

    Exemplos:
      | cupom         | codigo          |
      | "XPTO"        | CUPOM_INVALIDO  |
      | "VERAO2026"   | CUPOM_EXPIRADO  |
      | " verao2026 " | CUPOM_EXPIRADO  |

  @CT-PED-09 @api @auto
  Cenário: Pedido sem itens é recusado
    Dado que o carrinho está vazio
    Quando eu confirmo o pedido
    Então a resposta é 422 com o código "ITENS_OBRIGATORIOS"

  @CT-PED-10 @ui @manual
  Cenário: O fluxo não tem etapa de pagamento online
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    Quando eu avanço até a tela "Finalizar compra"
    Então o formulário pede apenas nome, e-mail e CEP
    E a tela informa que "O pagamento é feito na entrega."

  @CT-PED-11 @ui @manual
  Cenário: Fluxo completo: carrinho, cupom, dados do cliente e confirmação
    Dado que o carrinho contém 1 unidade de "Jaqueta Corta-Vento"
    E o cupom "BEMVINDO10" está aplicado
    Quando eu preencho "Maria Silva", "maria@exemplo.com" e "01310-100" e confirmo o pedido
    Então vejo o número do pedido no formato "VZ-NNNNNN"
    E o resumo mostra subtotal R$ 229,90, desconto R$ 22,99, frete Grátis e total R$ 206,91

  @CT-PED-12 @ui @manual
  Cenário: Estado do carrinho depois de confirmar o pedido
    # Comportamento não especificado: apenas registrar o que acontece.
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    Quando eu confirmo o pedido com "Maria Silva", "maria@exemplo.com" e "01310-100"
    Então o carrinho é esvaziado e o contador volta a 0
    E o botão voltar do navegador mostra o carrinho vazio
