# language: pt
@VZS-142 @api
Funcionalidade: Contrato da API (catálogo, rotas e erros)

  @CT-API-01 @api @auto
  Cenário: Listar produtos
    Quando eu envio GET /api/produtos
    Então a resposta é 200 com 8 produtos
    E cada produto tem id, nome, descricao, categoria e preco conforme a tabela da documentação

  @CT-API-02 @api @auto
  Esquema do Cenário: Consultar produto por id
    Quando eu envio GET /api/produtos/<id>
    Então a resposta é <status>

    Exemplos:
      | id   | status                                |
      | P001 | 200 com o produto                     |
      | P008 | 200 com o produto                     |
      | P999 | 404 com o código PRODUTO_NAO_ENCONTRADO |

  @CT-API-03 @api @auto
  Cenário: Rota inexistente
    Quando eu envio GET /api/rota-que-nao-existe
    Então a resposta é 404 com o código "ROTA_NAO_ENCONTRADA"

  @CT-API-04 @api @auto
  Esquema do Cenário: Método HTTP não permitido
    Quando eu envio <metodo> <rota>
    Então a resposta é 405 com o código "METODO_NAO_PERMITIDO"

    Exemplos:
      | metodo | rota                   |
      | GET    | /api/carrinho/calcular |
      | GET    | /api/pedidos           |
      | PUT    | /api/pedidos           |
      | DELETE | /api/produtos          |
      | POST   | /api/produtos          |

  @CT-API-05 @api @auto
  Esquema do Cenário: Corpo que não é um objeto JSON válido
    Quando eu envio POST /api/carrinho/calcular com o corpo <corpo>
    Então a resposta é 400 com o código "JSON_INVALIDO"

    Exemplos:
      | corpo        |
      | {            |
      | isto não é json |
      | []           |
      | null         |
      | 123          |

  @CT-API-06 @api @auto
  Esquema do Cenário: Lista de itens ausente ou vazia
    Quando eu envio POST /api/carrinho/calcular com o corpo <corpo>
    Então a resposta é 422 com o código "ITENS_OBRIGATORIOS"

    Exemplos:
      | corpo          |
      | {}             |
      | {"itens": []}  |

  @CT-API-07 @api @auto
  Cenário: Item que não é um objeto
    Quando eu envio POST /api/carrinho/calcular com itens ["P001"]
    Então a resposta é 422 com o código "ITEM_INVALIDO"

  @CT-API-08 @api @auto
  Cenário: Produto inexistente na lista de itens
    Quando eu envio POST /api/carrinho/calcular com o produto "P999"
    Então a resposta é 422 com o código "PRODUTO_NAO_ENCONTRADO"

  @CT-API-09 @api @auto
  Cenário: Formato padrão de erro
    Quando eu envio POST /api/carrinho/calcular com quantidade 0 para o primeiro item
    Então o corpo tem "erro.codigo" = "QUANTIDADE_INVALIDA"
    E "erro.mensagem" = "A quantidade deve ser um número inteiro maior ou igual a 1."
    E "erro.campo" = "itens[0].quantidade"

  @CT-API-10 @api @auto
  Cenário: Cálculo tolera cupom inválido (200); pedido não (422)
    Quando eu calculo um carrinho com o cupom "XPTO"
    Então a resposta é 200, sem desconto, com a mensagem "Cupom inválido."
    # contraparte em pedido.feature (CT-PED-07 e CT-PED-08)
