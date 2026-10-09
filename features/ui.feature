# language: pt
@VZS-142 @ui-draft
Funcionalidade: Interface da loja (automação em rascunho)
  Estes cenários espelham execuções manuais já feitas na loja real. A automação ainda é um RASCUNHO:
  os seletores estão em support/loja.page.ts e precisam ser confirmados com `npm run codegen`
  antes de rodar `npm run test:ui`.

  @CT-CUP-03 @CA03 @ui @rascunho-auto
  Cenário: Interface mostra "Cupom inválido." para um cupom inexistente
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    Quando eu aplico o cupom "XPTO"
    Então a tela mostra a mensagem "Cupom inválido."
    E o desconto exibido é R$ 0,00
    E o total exibido é R$ 119,90

  @CT-FRE-02 @CA06 @ui @rascunho-auto
  Cenário: Interface exibe frete grátis com subtotal exatamente igual a R$ 200,00
    Dado que o carrinho contém 2 unidades de "Mochila Urbana 20L"
    Então o subtotal exibido é R$ 200,00
    E o frete exibido é grátis
    E o total exibido é R$ 200,00

  @CT-QTD-02 @CA10 @ui @rascunho-auto
  Cenário: Interface impede passar de 5 unidades do mesmo produto
    Dado que o carrinho contém 5 unidades de "Camiseta Essencial"
    Quando eu volto à listagem de produtos
    Então o botão de adicionar "Camiseta Essencial" está desabilitado
    E a listagem informa "Limite de 5 unidades atingido."
