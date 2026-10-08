# language: pt
@VZS-142 @calculo
Funcionalidade: Cálculo do carrinho
  total = subtotal - desconto + frete, com todos os valores arredondados para 2 casas decimais (CA11).

  @CT-CAL-01 @api @auto
  Cenário: A fórmula do total e as regras de frete valem para qualquer carrinho
    Dado vários carrinhos diferentes, com e sem cupom
    Quando eu calculo cada carrinho
    Então "total" é igual a "subtotal" menos "desconto" mais "frete"
    E "subtotal" é a soma dos totais dos itens
    E o frete é R$ 0,00 se e somente se o subtotal é maior ou igual a R$ 200,00
    E o faltante é R$ 200,00 menos o subtotal, nunca menor que zero

  @CT-CAL-02 @CA11 @api @auto
  Esquema do Cenário: Valores com no máximo 2 casas decimais, sem artefato de ponto flutuante
    # 59,90 × 3 = 179.70000000000002 em ponto flutuante: um cálculo sem arredondamento vazaria isso
    Dado que o carrinho contém 3 unidades de "Camiseta Essencial"
    Quando eu calculo o carrinho com o cupom <cupom>
    Então o subtotal é R$ 179,70
    E o desconto é <desconto>
    E o valor faltante para o frete grátis é R$ 20,30
    E o total é <total>

    Exemplos:
      | cupom        | desconto  | total     |
      | nenhum       | R$ 0,00   | R$ 199,60 |
      | "BEMVINDO10" | R$ 17,97  | R$ 181,63 |

  @CT-CAL-03 @CA11 @ui @manual
  Cenário: Formatação monetária no padrão brasileiro
    Dado que o carrinho contém 5 unidades de cada um dos 8 produtos
    Então os valores aparecem como "R$ 4.247,00" (ponto no milhar, vírgula nos centavos)

  @CT-CAL-04 @ui @manual @rascunho-auto
  Cenário: Os valores exibidos na interface são os calculados pela API
    Dado que o carrinho contém 1 unidade de "Mochila Urbana 20L"
    Quando eu aplico o cupom "bemvindo10"
    Então subtotal, desconto, frete e total exibidos são iguais aos da resposta de /api/carrinho/calcular

  @CT-CAL-05 @api @auto
  Cenário: O cálculo não guarda estado entre chamadas
    Quando eu calculo o mesmo carrinho duas vezes seguidas
    Então as duas respostas são idênticas
