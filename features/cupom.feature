# language: pt
@VZS-142 @cupom
Funcionalidade: Cupom de desconto no carrinho
  Como cliente da Verzel Store
  Quero aplicar um cupom de desconto
  Para pagar menos nas minhas compras

  # Legenda de tags: @CT-xxx = ID do cenário | @CAxx = critério de aceite
  #                  @api / @ui = camada | @auto = automatizado (Playwright, camada de API) | @manual = execução manual
  #                  @rascunho-auto = automação de UI em rascunho (tests/e2e)
  Contexto:
    Dado que o carrinho está vazio

  @CT-CUP-01 @CA01 @api @ui @auto
  Cenário: BEMVINDO10 aplica 10% de desconto sobre o subtotal dos produtos
    Dado que o carrinho contém 1 unidade de "Calça Jeans Slim" e 2 unidades de "Boné Aba Curva"
    Quando eu aplico o cupom "BEMVINDO10"
    Então a mensagem exibida é "Cupom aplicado: 10% de desconto nos produtos."
    E o subtotal é R$ 239,70
    E o desconto é R$ 23,97
    E o frete é R$ 0,00
    E o total é R$ 215,73

  @CT-CUP-02 @CA02 @api @ui @auto
  Esquema do Cenário: O código do cupom ignora maiúsculas/minúsculas e espaços nas pontas
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    Quando eu aplico o cupom <codigo>
    Então o desconto é R$ 10,00
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
    Então a mensagem exibida é "Cupom inválido."
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
    Então a mensagem exibida é "Cupom expirado."
    E o desconto é R$ 0,00
    E o total é R$ 119,90

    Exemplos:
      | codigo         |
      | "VERAO2026"    |
      | "verao2026"    |
      | " VERAO2026 "  |

  @CT-CUP-05 @CA05 @ui @manual
  Cenário: Reaplicar o mesmo cupom não acumula desconto
    # Só existe um cupom válido (BEMVINDO10), então "dois cupons válidos" não é testável;
    # o que se observa é que o desconto não dobra. Ver AMB-01.
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    E o cupom "BEMVINDO10" está aplicado
    Quando eu tento aplicar o cupom "BEMVINDO10" novamente
    Então o desconto continua sendo R$ 10,00
    E o resumo mostra um único cupom

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

  @CT-CUP-07 @CA05 @CA03 @CA04 @ui @manual
  Esquema do Cenário: Cupom inválido ou expirado digitado com um cupom válido já aplicado
    # Interpretação (AMB-02): o cupom rejeitado não altera o cupom vigente.
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    E o cupom "BEMVINDO10" está aplicado
    Quando eu aplico o cupom "<codigo>"
    Então a mensagem exibida é "<mensagem>"
    E o desconto continua sendo R$ 10,00

    Exemplos:
      | codigo    | mensagem          |
      | XPTO      | Cupom inválido.   |
      | VERAO2026 | Cupom expirado.   |

  @CT-CUP-08 @CA02 @CA03 @ui @manual
  Esquema do Cenário: Campo de cupom vazio ou apenas com espaços
    # Interpretação (AMB-03): nenhum desconto, sem erro técnico e sem quebrar o carrinho.
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    Quando eu aplico o cupom <codigo>
    Então nenhum desconto é aplicado
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
    E o frete passa a ser R$ 0,00
    E o total passa a ser R$ 180,00
    Quando eu removo "Mochila Urbana 20L" do carrinho
    Então o desconto é R$ 0,00

  @CT-CUP-10 @CA05 @ui @manual
  Cenário: Remover o cupom limpa a mensagem e o desconto do resumo
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    E o cupom "BEMVINDO10" está aplicado
    Quando eu removo o cupom atual
    Então o resumo não exibe mais linha de desconto nem a mensagem do cupom
