# language: pt
@VZS-142 @api
Funcionalidade: Contrato da API (catálogo, rotas e erros)

  @CT-API-01 @api @auto
  Cenário: Listar produtos
    Quando eu envio GET /api/produtos
    Então a resposta é 200 com 8 produtos
    E cada produto tem id, nome, descricao, categoria e preco conforme a tabela da documentação

  @CT-API-02 @api @auto
  Esquema do Cenário: Consultar produto por id existente
    Quando eu envio GET /api/produtos/<id>
    Então a resposta é 200
    E o produto retornado é "<nome>" com preço R$ <preco>

    Exemplos:
      | id   | nome                     | preco   |
      | P001 | Camiseta Essencial       | 59,90   |
      | P002 | Calça Jeans Slim         | 139,90  |
      | P003 | Tênis Casual Urbano      | 189,90  |
      | P004 | Boné Aba Curva           | 49,90   |
      | P005 | Mochila Urbana 20L       | 100,00  |
      | P006 | Kit 3 Pares de Meias     | 29,90   |
      | P007 | Jaqueta Corta-Vento      | 229,90  |
      | P008 | Garrafa Térmica 750ml    | 50,00   |

  @CT-API-02 @api @auto
  Cenário: Consultar produto inexistente
    Quando eu envio GET /api/produtos/P999
    Então a resposta é 404 com o código "PRODUTO_NAO_ENCONTRADO"

  @CT-API-03 @api @auto
  Cenário: Rota inexistente com GET
    Quando eu envio GET /api/rota-que-nao-existe
    Então a resposta é 404 com o código "ROTA_NAO_ENCONTRADA"

  @CT-API-03 @api @auto
  Cenário: Rota inexistente com POST
    Quando eu envio POST /api/carrinho/inexistente com o corpo {}
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
  Esquema do Cenário: JSON malformado
    Quando eu envio POST <rota> com o corpo <corpo>
    Então a resposta é 400 com o código "JSON_INVALIDO"

    Exemplos:
      | rota                   | corpo              |
      | /api/carrinho/calcular | {                  |
      | /api/carrinho/calcular | {"itens": [        |
      | /api/carrinho/calcular | isto não é json    |
      | /api/pedidos           | {                  |
      | /api/pedidos           | {"itens": [        |
      | /api/pedidos           | isto não é json    |

  @CT-API-05 @api @auto
  Esquema do Cenário: Corpo que não é um objeto JSON
    Quando eu envio POST <rota> com o corpo <corpo>
    Então a resposta é 400 com o código "JSON_INVALIDO"

    Exemplos:
      | rota                   | corpo   |
      | /api/carrinho/calcular | []      |
      | /api/carrinho/calcular | null    |
      | /api/carrinho/calcular | 123     |
      | /api/carrinho/calcular | "texto" |
      | /api/pedidos           | []      |
      | /api/pedidos           | null    |
      | /api/pedidos           | 123     |
      | /api/pedidos           | "texto" |

  @CT-API-06 @api @auto
  Esquema do Cenário: Lista de itens ausente ou vazia
    Quando eu envio POST /api/carrinho/calcular com o corpo <corpo>
    Então a resposta é 422 com o código "ITENS_OBRIGATORIOS"

    Exemplos:
      | corpo          |
      | {}             |
      | {"itens": []}  |

  @CT-API-07 @api @auto
  Esquema do Cenário: Item que não é um objeto
    Quando eu envio POST /api/carrinho/calcular com o corpo <corpo>
    Então a resposta é 422 com o código "ITEM_INVALIDO"

    Exemplos:
      | corpo               |
      | {"itens": ["P001"]} |
      | {"itens": [42]}     |

  @CT-API-08 @api @auto
  Cenário: Produto inexistente na lista de itens
    Dado que o carrinho contém 1 unidade de "P999"
    Quando eu calculo o carrinho sem cupom
    Então a resposta é 422 com o código "PRODUTO_NAO_ENCONTRADO"

  @CT-API-09 @api @auto
  Cenário: Formato padrão de erro (exemplo da documentação)
    Dado que o carrinho contém 0 unidades de "Camiseta Essencial"
    Quando eu calculo o carrinho sem cupom
    Então a resposta é 422 com o código "QUANTIDADE_INVALIDA"
    E a mensagem de erro é "A quantidade deve ser um número inteiro maior ou igual a 1."
    E o campo apontado é "itens[0].quantidade"

  @CT-API-09 @api @auto
  Cenário: O campo do erro aponta o índice correto do item
    Dado que o carrinho contém 1 unidade de "Camiseta Essencial" e 0 unidades de "Calça Jeans Slim"
    Quando eu calculo o carrinho sem cupom
    Então a resposta é 422 com o código "QUANTIDADE_INVALIDA"
    E o campo apontado é "itens[1].quantidade"

  @CT-API-10 @api @auto
  Cenário: Cálculo tolera cupom inválido (200); pedido não (422)
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    Quando eu aplico o cupom "XPTO"
    Então a resposta é 200
    E o cupom não está aplicado
    E a mensagem do cupom é "Cupom inválido."
    # contraparte em pedido.feature (CT-PED-07 e CT-PED-08)
