# language: pt
@VZS-142 @cupom
Funcionalidade: Cupom de desconto no carrinho
  Como cliente da Verzel Store
  Quero aplicar um cupom de desconto
  Para pagar menos nas minhas compras

  # Legenda de tags: @CT-xxx = ID do cenário | @CAxx = critério de aceite
  #                  @api / @ui = camada verificada | @manual = execução manual
  #                  @auto = automatizado com Playwright BDD (camada de API)
  #                  @rascunho-auto = automação de UI em rascunho (features/ui.feature)
  Contexto:
    Dado que o carrinho está vazio

  @CT-CUP-01 @CA01 @api @ui @auto
  Cenário: BEMVINDO10 aplica 10% de desconto sobre o subtotal dos produtos
    Dado que o carrinho contém 1 unidade de "Calça Jeans Slim" e 2 unidades de "Boné Aba Curva"
    Quando eu aplico o cupom "BEMVINDO10"
    Então a resposta é 200
    E o cupom está aplicado
    E a mensagem do cupom é "Cupom aplicado: 10% de desconto nos produtos."
    E o subtotal é R$ 239,70
    E o desconto é R$ 23,97
    E o frete é R$ 0,00
    E o frete grátis está ativo
    E o total é R$ 215,73

  @CT-CUP-02 @CA02 @api @ui @auto
  Esquema do Cenário: O código do cupom ignora maiúsculas/minúsculas e espaços nas pontas
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    Quando eu aplico o cupom <codigo>
    Então a resposta é 200
    E o cupom está aplicado
    E o desconto é R$ 10,00
    E o total é R$ 109,90

    Exemplos: (as aspas delimitam o texto digitado, incluindo os espaços)
      | codigo             |
      | "bemvindo10"       |
      | "BemVindo10"       |
      | " BEMVINDO10"      |
      | "BEMVINDO10 "      |
      | "   bemvindo10   " |

  @CT-CUP-03 @CA03 @api @ui @auto
  Esquema do Cenário: Cupom inexistente não gera desconto
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    Quando eu aplico o cupom <codigo>
    Então a resposta é 200
    E o cupom não está aplicado
    E a mensagem do cupom é "Cupom inválido."
    E o desconto é R$ 0,00
    E o total é R$ 119,90

    Exemplos: (inclui "BEMVINDO 10": espaço no MEIO não é ignorado)
      | codigo         |
      | "XPTO"         |
      | "BEMVINDO11"   |
      | "BEMVINDO 10"  |
      | "BEMVINDO100"  |

  @CT-CUP-04 @CA04 @api @ui @auto
  Esquema do Cenário: Cupom expirado não gera desconto
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    Quando eu aplico o cupom <codigo>
    Então a resposta é 200
    E o cupom não está aplicado
    E a mensagem do cupom é "Cupom expirado."
    E o desconto é R$ 0,00
    E o total é R$ 119,90

    Exemplos:
      | codigo         |
      | "VERAO2026"    |
      | "verao2026"    |
      | " VERAO2026 "  |

  @CT-CUP-05 @CA05 @ui @manual
  Cenário: Com um cupom aplicado não é possível aplicar outro
    # Só existe um cupom válido (BEMVINDO10); na tela, o campo de cupom é substituído pelo aviso de cupom aplicado.
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    E o cupom "BEMVINDO10" está aplicado
    Então o campo de cupom deixa de ser exibido
    E a tela oferece a ação "Remover cupom"
    E o desconto continua sendo R$ 10,00

  @CT-CUP-06 @CA05 @ui @manual
  Cenário: Para trocar de cupom, o cliente remove o atual e aplica outro
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    E o cupom "BEMVINDO10" está aplicado
    Quando eu removo o cupom atual
    Então o desconto volta a ser R$ 0,00
    E o total volta a ser R$ 119,90
    Quando eu aplico o cupom "VERAO2026"
    Então a mensagem exibida é "Cupom expirado."
    E o desconto continua sendo R$ 0,00

  @CT-CUP-07 @CA05 @CA03 @CA04 @ui @manual @nao-aplicavel
  Cenário: Cupom inválido digitado com um cupom válido já aplicado
    # Não executável pela interface: com cupom aplicado, o campo de digitação desaparece (ver CT-CUP-05).
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    E o cupom "BEMVINDO10" está aplicado
    Então não há campo para digitar outro cupom

  @CT-CUP-08 @CA02 @CA03 @ui @manual
  Esquema do Cenário: Campo de cupom vazio ou apenas com espaços
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    Quando eu aplico o cupom <codigo>
    Então a mensagem exibida é "Informe um cupom."
    E nenhum desconto é aplicado
    E a tela não exibe erro técnico

    Exemplos:
      | codigo |
      | ""     |
      | "   "  |

  @CT-CUP-09 @CA01 @ui @manual
  Cenário: O desconto é recalculado quando os itens mudam com o cupom aplicado
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    E o cupom "BEMVINDO10" está aplicado
    Quando eu aumento a quantidade de "Mochila Urbana 20L" para 2
    Então o desconto passa a ser R$ 20,00
    Quando eu reduzo a quantidade de "Mochila Urbana 20L" para 1
    Então o desconto volta a ser R$ 10,00
    E o total volta a ser R$ 109,90

  @CT-CUP-10 @CA05 @ui @manual
  Cenário: Remover o cupom limpa o desconto e a mensagem do resumo
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    E o cupom "BEMVINDO10" está aplicado
    Quando eu removo o cupom atual
    Então o desconto volta a ser R$ 0,00
    E o campo de cupom volta a ser exibido
