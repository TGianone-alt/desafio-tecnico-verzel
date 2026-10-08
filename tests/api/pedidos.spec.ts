import { test, expect } from '@playwright/test';
import {
  CLIENTE_VALIDO,
  CUPOM_EXPIRADO,
  CUPOM_VALIDO,
  ItemReq,
  calcular,
  criarPedido,
  expectErro,
  expectResumo,
  item,
} from './support';

test.describe('Pedidos (POST /api/pedidos)', () => {
  test('CT-PED-01 | pedido válido com cupom: 201, número VZ-NNNNNN, CEP normalizado e valores do exemplo da doc', async ({ request }) => {
    const resp = await criarPedido(request, { cliente: CLIENTE_VALIDO, itens: [item('P005', 1)], cupom: CUPOM_VALIDO });
    expect(resp.status(), await resp.text()).toBe(201);
    const corpo = await resp.json();
    expect.soft(corpo.numero, 'formato do número do pedido').toMatch(/^VZ-\d{6}$/);
    expect.soft(Number.isNaN(Date.parse(corpo.criadoEm)), 'criadoEm deve ser uma data ISO válida').toBe(false);
    expect.soft(corpo.cliente).toMatchObject({ nome: 'Maria Silva', email: 'maria@exemplo.com', cep: '01310100' });
    expect.soft(corpo.cupom.aplicado).toBe(true);
    expect.soft(corpo.itens).toHaveLength(1);
    expectResumo(corpo, { subtotal: 100, desconto: 10, frete: 19.9, freteGratis: false, valorFaltanteFreteGratis: 100, total: 109.9 });
  });

  test('CT-PED-01 | pedido válido sem cupom e com frete grátis', async ({ request }) => {
    const resp = await criarPedido(request, { cliente: CLIENTE_VALIDO, itens: [item('P007', 1)] });
    expect(resp.status(), await resp.text()).toBe(201);
    const corpo = await resp.json();
    expect.soft(corpo.numero).toMatch(/^VZ-\d{6}$/);
    expectResumo(corpo, { subtotal: 229.9, desconto: 0, frete: 0, freteGratis: true, valorFaltanteFreteGratis: 0, total: 229.9 });
  });

  const carrinhos: Array<{ nome: string; itens: ItemReq[]; cupom?: string }> = [
    { nome: 'P002 + 2×P004 com cupom', itens: [item('P002', 1), item('P004', 2)], cupom: CUPOM_VALIDO },
    { nome: '2×P005 com cupom (limite do frete grátis)', itens: [item('P005', 2)], cupom: CUPOM_VALIDO },
    { nome: '3×P001 sem cupom', itens: [item('P001', 3)] },
  ];
  for (const c of carrinhos) {
    test(`CT-PED-02 | totais do pedido = totais do cálculo (${c.nome})`, async ({ request }) => {
      const calc = await (await calcular(request, c.itens, c.cupom)).json();
      const resp = await criarPedido(request, { cliente: CLIENTE_VALIDO, itens: c.itens, ...(c.cupom ? { cupom: c.cupom } : {}) });
      expect(resp.status(), await resp.text()).toBe(201);
      const pedido = await resp.json();
      expectResumo(pedido, {
        subtotal: calc.subtotal,
        desconto: calc.desconto,
        frete: calc.frete,
        freteGratis: calc.freteGratis,
        valorFaltanteFreteGratis: calc.valorFaltanteFreteGratis,
        total: calc.total,
      });
    });
  }

  test('CT-PED-02 | cupom em minúsculas e com espaços também é aceito no pedido (CA02)', async ({ request }) => {
    const resp = await criarPedido(request, { cliente: CLIENTE_VALIDO, itens: [item('P005', 1)], cupom: '  bemvindo10 ' });
    expect(resp.status(), await resp.text()).toBe(201);
    const corpo = await resp.json();
    expect.soft(corpo.cupom.aplicado).toBe(true);
    expect.soft(corpo.desconto).toBe(10);
  });

  /* ---------------------------- Dados do cliente --------------------------- */
  for (const nome of ['Maria', '']) {
    test(`CT-PED-03 | nome sem sobrenome ${JSON.stringify(nome)} → 422 DADOS_INVALIDOS`, async ({ request }) => {
      const resp = await criarPedido(request, { cliente: { ...CLIENTE_VALIDO, nome }, itens: [item('P005', 1)] });
      await expectErro(resp, 422, 'DADOS_INVALIDOS');
    });
  }

  for (const email of ['maria', 'maria@', '@exemplo.com', 'maria.exemplo.com', 'maria@@exemplo.com', '']) {
    test(`CT-PED-04 | e-mail inválido ${JSON.stringify(email)} → 422 DADOS_INVALIDOS`, async ({ request }) => {
      const resp = await criarPedido(request, { cliente: { ...CLIENTE_VALIDO, email }, itens: [item('P005', 1)] });
      await expectErro(resp, 422, 'DADOS_INVALIDOS');
    });
  }

  for (const cep of ['01310-100', '01310100']) {
    test(`CT-PED-05 | CEP ${JSON.stringify(cep)} (8 dígitos, com/sem hífen) é aceito e normalizado para 01310100`, async ({ request }) => {
      const resp = await criarPedido(request, { cliente: { ...CLIENTE_VALIDO, cep }, itens: [item('P005', 1)] });
      expect(resp.status(), await resp.text()).toBe(201);
      expect((await resp.json()).cliente.cep).toBe('01310100');
    });
  }

  for (const cep of ['1234567', '123456789', '01310-10', 'ABCDE-FGH', '']) {
    test(`CT-PED-06 | CEP inválido ${JSON.stringify(cep)} → 422 DADOS_INVALIDOS`, async ({ request }) => {
      const resp = await criarPedido(request, { cliente: { ...CLIENTE_VALIDO, cep }, itens: [item('P005', 1)] });
      await expectErro(resp, 422, 'DADOS_INVALIDOS');
    });
  }

  /* ------------------------------ Cupom no pedido -------------------------- */
  test('CT-PED-07 | cupom inexistente no pedido → 422 CUPOM_INVALIDO (diferente de /calcular, que responde 200)', async ({ request }) => {
    const resp = await criarPedido(request, { cliente: CLIENTE_VALIDO, itens: [item('P005', 1)], cupom: 'XPTO' });
    await expectErro(resp, 422, 'CUPOM_INVALIDO');
  });

  test('CT-PED-08 | cupom expirado no pedido → 422 CUPOM_EXPIRADO', async ({ request }) => {
    const resp = await criarPedido(request, { cliente: CLIENTE_VALIDO, itens: [item('P005', 1)], cupom: CUPOM_EXPIRADO });
    await expectErro(resp, 422, 'CUPOM_EXPIRADO');
  });

  test('CT-PED-08 | cupom expirado em minúsculas no pedido → 422 CUPOM_EXPIRADO (CA02 + CA04)', async ({ request }) => {
    const resp = await criarPedido(request, { cliente: CLIENTE_VALIDO, itens: [item('P005', 1)], cupom: ' verao2026 ' });
    await expectErro(resp, 422, 'CUPOM_EXPIRADO');
  });
});
