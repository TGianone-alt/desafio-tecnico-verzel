import { test, expect } from '@playwright/test';
import { CLIENTE_VALIDO, calcular, criarPedido, expectErro, item, postBruto } from './support';

/* -------------------------------------------------------------------------- */
/* QUANTIDADE (CA10) - lado "rejeitado"                                        */
/* -------------------------------------------------------------------------- */
test.describe('Quantidade: regras de rejeição', () => {
  for (const qtd of [6, 10, 100]) {
    test(`CT-QTD-05 | /calcular rejeita ${qtd} unidades do mesmo produto (CA10: vale para a API)`, async ({ request }) => {
      await expectErro(await calcular(request, [item('P001', qtd)]), 422, 'QUANTIDADE_MAXIMA_EXCEDIDA');
    });
  }

  test('CT-QTD-05 | /pedidos rejeita 6 unidades do mesmo produto', async ({ request }) => {
    const resp = await criarPedido(request, { cliente: CLIENTE_VALIDO, itens: [item('P001', 6)] });
    await expectErro(resp, 422, 'QUANTIDADE_MAXIMA_EXCEDIDA');
  });

  test('CT-QTD-05 | basta um item acima do limite para rejeitar o carrinho todo', async ({ request }) => {
    await expectErro(await calcular(request, [item('P001', 1), item('P002', 6)]), 422, 'QUANTIDADE_MAXIMA_EXCEDIDA');
  });

  for (const qtd of [0, -1, 1.5]) {
    test(`CT-QTD-06 | quantidade ${qtd} é rejeitada com QUANTIDADE_INVALIDA`, async ({ request }) => {
      await expectErro(await calcular(request, [item('P001', qtd)]), 422, 'QUANTIDADE_INVALIDA');
    });
  }

  test('CT-API-09 | formato do erro: codigo, mensagem e campo (exemplo da documentação)', async ({ request }) => {
    const erro = await expectErro(await calcular(request, [item('P001', 0)]), 422, 'QUANTIDADE_INVALIDA');
    expect.soft(erro.mensagem).toBe('A quantidade deve ser um número inteiro maior ou igual a 1.');
    expect.soft(erro.campo).toBe('itens[0].quantidade');
  });

  test('CT-API-09 | o campo do erro aponta o índice correto do item (itens[1].quantidade)', async ({ request }) => {
    const erro = await expectErro(await calcular(request, [item('P001', 1), item('P002', 0)]), 422, 'QUANTIDADE_INVALIDA');
    expect.soft(erro.campo).toBe('itens[1].quantidade');
  });

  test('CT-QTD-07 | o mesmo produto duas vezes na lista é rejeitado com ITEM_DUPLICADO', async ({ request }) => {
    await expectErro(await calcular(request, [item('P001', 1), item('P001', 1)]), 422, 'ITEM_DUPLICADO');
  });
});

/* -------------------------------------------------------------------------- */
/* ESTRUTURA DA REQUISIÇÃO                                                     */
/* -------------------------------------------------------------------------- */
test.describe('Estrutura da requisição', () => {
  for (const rota of ['/api/carrinho/calcular', '/api/pedidos']) {
    for (const corpo of ['{', '{"itens": [', 'isto não é json']) {
      test(`CT-API-05 | ${rota} com JSON malformado ${JSON.stringify(corpo)} → 400 JSON_INVALIDO`, async ({ request }) => {
        await expectErro(await postBruto(request, rota, corpo), 400, 'JSON_INVALIDO');
      });
    }
    for (const corpo of ['[]', 'null', '123', '"texto"']) {
      test(`CT-API-05 | ${rota} com corpo que não é um objeto JSON ${corpo} → 400 JSON_INVALIDO`, async ({ request }) => {
        await expectErro(await postBruto(request, rota, corpo), 400, 'JSON_INVALIDO');
      });
    }
  }

  test('CT-API-06 | /calcular sem a chave itens → 422 ITENS_OBRIGATORIOS', async ({ request }) => {
    await expectErro(await postBruto(request, '/api/carrinho/calcular', '{}'), 422, 'ITENS_OBRIGATORIOS');
  });

  test('CT-API-06 | /calcular com itens vazio → 422 ITENS_OBRIGATORIOS', async ({ request }) => {
    await expectErro(await calcular(request, []), 422, 'ITENS_OBRIGATORIOS');
  });

  test('CT-PED-09 | /pedidos com itens vazio → 422 ITENS_OBRIGATORIOS', async ({ request }) => {
    await expectErro(await criarPedido(request, { cliente: CLIENTE_VALIDO, itens: [] }), 422, 'ITENS_OBRIGATORIOS');
  });

  for (const valor of ['P001', 42]) {
    test(`CT-API-07 | item que não é objeto (${JSON.stringify(valor)}) → 422 ITEM_INVALIDO`, async ({ request }) => {
      await expectErro(await calcular(request, [valor]), 422, 'ITEM_INVALIDO');
    });
  }

  test('CT-API-08 | produto inexistente no item → 422 PRODUTO_NAO_ENCONTRADO', async ({ request }) => {
    await expectErro(await calcular(request, [item('P999', 1)]), 422, 'PRODUTO_NAO_ENCONTRADO');
  });
});

/* -------------------------------------------------------------------------- */
/* ROTAS E MÉTODOS                                                             */
/* -------------------------------------------------------------------------- */
test.describe('Rotas e métodos HTTP', () => {
  test('CT-API-03 | GET em rota inexistente → 404 ROTA_NAO_ENCONTRADA', async ({ request }) => {
    await expectErro(await request.get('/api/rota-que-nao-existe'), 404, 'ROTA_NAO_ENCONTRADA');
  });

  test('CT-API-03 | POST em rota inexistente → 404 ROTA_NAO_ENCONTRADA', async ({ request }) => {
    await expectErro(await request.post('/api/carrinho/inexistente', { data: {} }), 404, 'ROTA_NAO_ENCONTRADA');
  });

  const metodosNaoPermitidos: Array<[string, string]> = [
    ['GET', '/api/carrinho/calcular'],
    ['GET', '/api/pedidos'],
    ['PUT', '/api/pedidos'],
    ['DELETE', '/api/produtos'],
    ['POST', '/api/produtos'],
  ];
  for (const [metodo, rota] of metodosNaoPermitidos) {
    test(`CT-API-04 | ${metodo} ${rota} → 405 METODO_NAO_PERMITIDO`, async ({ request }) => {
      await expectErro(await request.fetch(rota, { method: metodo }), 405, 'METODO_NAO_PERMITIDO');
    });
  }
});
