# language: pt
@VZS-142 @pedido
Funcionalidade: Confirmação do pedido
  O pagamento é feito na entrega; não existe etapa de pagamento online.

  @CT-PED-01 @api @auto
  Cenário: Pedido válido com cupom é criado com número no formato VZ-000000
    Quando eu envio POST /api/pedidos com cliente "Maria Silva", "maria@exemplo.com", CEP "01310-100", 1 "Mochila Urbana 20L" e cupom "BEMVINDO10"
    Então a resposta é 201
    E o número do pedido segue o formato "VZ-" seguido de 6 dígitos
    E o CEP é devolvido normalizado como "01310100"
    E o subtotal é R$ 100,00, o desconto R$ 10,00, o frete R$ 19,90 e o total R$ 109,90

  @CT-PED-02 @api @auto
  Cenário: Os totais do pedido são iguais aos do cálculo do carrinho
    Dado um carrinho calculado em /api/carrinho/calcular
    Quando eu confirmo o mesmo carrinho em /api/pedidos
    Então subtotal, desconto, frete, freteGratis, faltante e total são idênticos

  @CT-PED-03 @api @ui @auto
  Esquema do Cenário: O nome precisa ter nome e sobrenome
    Quando eu confirmo o pedido com o nome <nome>
    Então o pedido é recusado com "DADOS_INVALIDOS"

    Exemplos:
      | nome    |
      | "Maria" |
      | ""      |

  @CT-PED-04 @api @ui @auto
  Esquema do Cenário: O e-mail precisa ter formato válido
    Quando eu confirmo o pedido com o e-mail <email>
    Então o pedido é recusado com "DADOS_INVALIDOS"

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
    Quando eu confirmo o pedido com o CEP <cep>
    Então o pedido é criado com o CEP "01310100"

    Exemplos:
      | cep         |
      | "01310-100" |
      | "01310100"  |

  @CT-PED-06 @api @ui @auto
  Esquema do Cenário: CEP inválido é recusado
    Quando eu confirmo o pedido com o CEP <cep>
    Então o pedido é recusado com "DADOS_INVALIDOS"

    Exemplos:
      | cep           |
      | "1234567"     |
      | "123456789"   |
      | "01310-10"    |
      | "ABCDE-FGH"   |
      | ""            |

  @CT-PED-07 @CT-PED-08 @CT-API-10 @api @auto
  Esquema do Cenário: No pedido, cupom inválido ou expirado é erro (diferente do cálculo, que responde 200)
    Quando eu confirmo o pedido com o cupom <cupom>
    Então a resposta é 422 com o código "<codigo>"

    Exemplos:
      | cupom       | codigo          |
      | "XPTO"      | CUPOM_INVALIDO  |
      | "VERAO2026" | CUPOM_EXPIRADO  |

  @CT-PED-09 @api @auto
  Cenário: Pedido sem itens é recusado
    Quando eu confirmo um pedido com a lista de itens vazia
    Então a resposta é 422 com o código "ITENS_OBRIGATORIOS"

  @CT-PED-10 @ui @manual
  Cenário: O fluxo não tem etapa de pagamento online
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    Quando eu avanço até a confirmação do pedido
    Então não é solicitado cartão, PIX ou qualquer dado de pagamento
    E a tela informa que o pagamento é feito na entrega (se houver essa informação)

  @CT-PED-11 @ui @manual
  Cenário: Fluxo completo: carrinho, cupom, dados do cliente e confirmação
    Dado que o carrinho contém 1 unidade de "Jaqueta Corta-Vento"
    E o cupom "BEMVINDO10" está aplicado
    Quando eu preencho "Maria Silva", "maria@exemplo.com" e "01310-100" e confirmo
    Então vejo o número do pedido no formato "VZ-NNNNNN"
    E o resumo mostra subtotal R$ 229,90, desconto R$ 22,99, frete R$ 0,00 e total R$ 206,91
