# language: pt
@VZS-142 @carrinho
Funcionalidade: Carrinho de compras
  O carrinho fica guardado apenas na aba do navegador (comportamento esperado do ambiente).
  Legenda de tags: @CT-xxx = ID do cenário | @ui = interface | @manual = execução manual

  @CT-CAR-01 @ui @manual
  Cenário: O contador do cabeçalho reflete o conteúdo do carrinho
    # Interpretação (AMB-11): o contador mostra a soma das unidades.
    Dado que o carrinho está vazio
    Então o contador do cabeçalho mostra 0
    Quando eu adiciono 2 unidades de "Mochila Urbana 20L" e 1 unidade de "Boné Aba Curva"
    Então o contador do cabeçalho mostra 3
    Quando eu removo "Boné Aba Curva" do carrinho
    Então o contador do cabeçalho mostra 2

  @CT-CAR-02 @ui @manual
  Cenário: Remover um item atualiza itens, resumo e contador
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L" e 1 unidade de "Boné Aba Curva"
    Quando eu removo "Mochila Urbana 20L" do carrinho
    Então o carrinho contém apenas "Boné Aba Curva"
    E o subtotal é R$ 49,90
    E o frete é R$ 19,90
    E o total é R$ 69,80
    E o contador do cabeçalho mostra 1

  @CT-CAR-03 @ui @manual
  Cenário: O carrinho sobrevive ao recarregar a aba, mas não é compartilhado com outras abas
    # Esperado pelo ambiente (AMB-13): outra aba, outro navegador ou janela anônima começam vazios.
    # Isso NÃO deve ser reportado como bug.
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    Quando eu recarrego a página
    Então o carrinho continua com 1 unidade de "Mochila Urbana 20L"
    Quando eu abro a loja em outra aba
    Então o carrinho dessa nova aba está vazio

  @CT-CAR-04 @ui @manual
  Cenário: Carrinho vazio não cobra frete e não permite confirmar o pedido
    # Interpretação (AMB-10): a documentação não define a tela de carrinho vazio.
    Dado que o carrinho está vazio
    Quando eu abro o carrinho
    Então a tela não exibe itens nem erro técnico
    E nenhum frete é cobrado
    E não há como confirmar o pedido

  @CT-CAR-05 @CA10 @ui @manual
  Cenário: Alterar a quantidade atualiza item, subtotal, frete e total
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    Quando eu altero a quantidade de "Mochila Urbana 20L" para 3
    Então o item mostra 3 unidades e total R$ 300,00
    E o subtotal é R$ 300,00
    E o frete é R$ 0,00
    E o total é R$ 300,00
    Quando eu altero a quantidade de "Mochila Urbana 20L" para 1
    Então o subtotal volta a ser R$ 100,00
    E o frete volta a ser R$ 19,90
    E o total volta a ser R$ 119,90

  @CT-PED-12 @ui @manual
  Cenário: Estado do carrinho depois de confirmar o pedido
    # Comportamento não especificado (AMB-12): registrar o que acontece, sem presumir erro.
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    Quando eu confirmo o pedido com "Maria Silva", "maria@exemplo.com" e "01310-100"
    Então vejo o número do pedido no formato "VZ-NNNNNN"
    E registro se o carrinho foi esvaziado e se o contador voltou a 0
    E nenhuma tela quebra ao voltar para a listagem de produtos
