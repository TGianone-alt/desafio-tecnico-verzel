import { test, expect } from '@playwright/test';
import {
  CUPOM_EXPIRADO,
  CUPOM_VALIDO,
  ItemReq,
  Resumo,
  calcular,
  expectInvariantes,
  expectResumo,
  item,
} from './support';

/* -------------------------------------------------------------------------- */
/* CUPOM (CA01 a CA05)                                                         */
/* -------------------------------------------------------------------------- */
test.describe('Cupom de desconto', () => {
  test('CT-CUP-01 | exemplo da documentação: P002 + 2×P004 com BEMVINDO10 (10% de 239,70)', async ({ request }) => {
    const resp = await calcular(request, [item('P002', 1), item('P004', 2)], CUPOM_VALIDO);
    expect(resp.status()).toBe(200);
    const corpo = await resp.json();
    expectResumo(corpo, { subtotal: 239.7, desconto: 23.97, frete: 0, freteGratis: true, valorFaltanteFreteGratis: 0, total: 215.73 });
    expect.soft(corpo.cupom.aplicado).toBe(true);
    expect.soft(corpo.cupom.mensagem).toBe('Cupom aplicado: 10% de desconto nos produtos.');
    expect.soft(corpo.itens).toHaveLength(2);
    expect.soft(corpo.itens[0]).toMatchObject({ produtoId: 'P002', nome: 'Calça Jeans Slim', precoUnitario: 139.9, quantidade: 1, total: 139.9 });
    expect.soft(corpo.itens[1]).toMatchObject({ produtoId: 'P004', nome: 'Boné Aba Curva', precoUnitario: 49.9, quantidade: 2, total: 99.8 });
  });

  for (const codigo of ['bemvindo10', 'BemVindo10', ' BEMVINDO10', 'BEMVINDO10 ', '   bemvindo10   ']) {
    test(`CT-CUP-02 | código ${JSON.stringify(codigo)} é aceito (sem distinção de maiúsculas e com trim)`, async ({ request }) => {
      const resp = await calcular(request, [item('P005', 1)], codigo);
      expect(resp.status()).toBe(200);
      const corpo = await resp.json();
      expect.soft(corpo.cupom.aplicado, 'cupom.aplicado').toBe(true);
      expectResumo(corpo, { subtotal: 100, desconto: 10, frete: 19.9, freteGratis: false, valorFaltanteFreteGratis: 100, total: 109.9 });
    });
  }

  for (const codigo of ['XPTO', 'BEMVINDO11', 'BEMVINDO 10', 'BEMVINDO100']) {
    test(`CT-CUP-03 | cupom inexistente ${JSON.stringify(codigo)}: 200, "Cupom inválido." e sem desconto`, async ({ request }) => {
      const resp = await calcular(request, [item('P005', 1)], codigo);
      expect(resp.status(), 'em /calcular, cupom inválido NÃO gera erro').toBe(200);
      const corpo = await resp.json();
      expect.soft(corpo.cupom.aplicado).toBe(false);
      expect.soft(corpo.cupom.mensagem).toBe('Cupom inválido.');
      expectResumo(corpo, { subtotal: 100, desconto: 0, frete: 19.9, freteGratis: false, valorFaltanteFreteGratis: 100, total: 119.9 });
    });
  }

  for (const codigo of [CUPOM_EXPIRADO, 'verao2026', ' VERAO2026 ']) {
    test(`CT-CUP-04 | cupom expirado ${JSON.stringify(codigo)}: 200, "Cupom expirado." e sem desconto`, async ({ request }) => {
      const resp = await calcular(request, [item('P005', 1)], codigo);
      expect(resp.status(), 'em /calcular, cupom expirado NÃO gera erro').toBe(200);
      const corpo = await resp.json();
      expect.soft(corpo.cupom.aplicado).toBe(false);
      expect.soft(corpo.cupom.mensagem).toBe('Cupom expirado.');
      expectResumo(corpo, { subtotal: 100, desconto: 0, frete: 19.9, freteGratis: false, valorFaltanteFreteGratis: 100, total: 119.9 });
    });
  }
});

/* -------------------------------------------------------------------------- */
/* FRETE (CA06 a CA09)                                                         */
/* -------------------------------------------------------------------------- */
const casosFrete: Array<{ ct: string; titulo: string; itens: ItemReq[]; esperado: Resumo }> = [
  {
    ct: 'CT-FRE-01',
    titulo: 'subtotal 100,00 (< 200): frete 19,90 e faltam 100,00',
    itens: [item('P005', 1)],
    esperado: { subtotal: 100, desconto: 0, frete: 19.9, freteGratis: false, valorFaltanteFreteGratis: 100, total: 119.9 },
  },
  {
    ct: 'CT-FRE-03',
    titulo: 'subtotal 199,90 (R$ 0,10 abaixo do limite): frete cobrado e faltam 0,10',
    itens: [item('P005', 1), item('P004', 1), item('P008', 1)],
    esperado: { subtotal: 199.9, desconto: 0, frete: 19.9, freteGratis: false, valorFaltanteFreteGratis: 0.1, total: 219.8 },
  },
  {
    ct: 'CT-FRE-03',
    titulo: 'subtotal 199,80 (P001 + P002): frete cobrado e faltam 0,20',
    itens: [item('P001', 1), item('P002', 1)],
    esperado: { subtotal: 199.8, desconto: 0, frete: 19.9, freteGratis: false, valorFaltanteFreteGratis: 0.2, total: 219.7 },
  },
  {
    ct: 'CT-FRE-02',
    titulo: 'subtotal exatamente 200,00 (2×P005): limite inclusivo, frete grátis',
    itens: [item('P005', 2)],
    esperado: { subtotal: 200, desconto: 0, frete: 0, freteGratis: true, valorFaltanteFreteGratis: 0, total: 200 },
  },
  {
    ct: 'CT-FRE-02',
    titulo: 'subtotal exatamente 200,00 por outra combinação (4×P008)',
    itens: [item('P008', 4)],
    esperado: { subtotal: 200, desconto: 0, frete: 0, freteGratis: true, valorFaltanteFreteGratis: 0, total: 200 },
  },
  {
    ct: 'CT-FRE-04',
    titulo: 'subtotal 229,90 (> 200): frete grátis e faltante 0 (nunca negativo)',
    itens: [item('P007', 1)],
    esperado: { subtotal: 229.9, desconto: 0, frete: 0, freteGratis: true, valorFaltanteFreteGratis: 0, total: 229.9 },
  },
];

test.describe('Frete grátis', () => {
  for (const c of casosFrete) {
    test(`${c.ct} | ${c.titulo}`, async ({ request }) => {
      const resp = await calcular(request, c.itens);
      expect(resp.status()).toBe(200);
      expectResumo(await resp.json(), c.esperado);
    });
  }

  test('CT-FRE-05 | CA08: subtotal 200,00 com cupom (desconto 20,00) continua com frete grátis', async ({ request }) => {
    const resp = await calcular(request, [item('P005', 2)], CUPOM_VALIDO);
    expect(resp.status()).toBe(200);
    expectResumo(await resp.json(), { subtotal: 200, desconto: 20, frete: 0, freteGratis: true, valorFaltanteFreteGratis: 0, total: 180 });
  });

  test('CT-FRE-05 | CA08: subtotal 219,80 com cupom (total < 200) continua com frete grátis', async ({ request }) => {
    const resp = await calcular(request, [item('P003', 1), item('P006', 1)], CUPOM_VALIDO);
    expect(resp.status()).toBe(200);
    expectResumo(await resp.json(), { subtotal: 219.8, desconto: 21.98, frete: 0, freteGratis: true, valorFaltanteFreteGratis: 0, total: 197.82 });
  });

  test('CT-FRE-05 | CA08: subtotal 199,90 com cupom NÃO ganha frete grátis; faltante usa o subtotal (0,10)', async ({ request }) => {
    const resp = await calcular(request, [item('P005', 1), item('P004', 1), item('P008', 1)], CUPOM_VALIDO);
    expect(resp.status()).toBe(200);
    expectResumo(await resp.json(), { subtotal: 199.9, desconto: 19.99, frete: 19.9, freteGratis: false, valorFaltanteFreteGratis: 0.1, total: 199.81 });
  });

  test('CT-FRE-06 | CA09: desconto de 10% incide só nos produtos (10,00 e não 11,99), exemplo da doc de /pedidos', async ({ request }) => {
    const resp = await calcular(request, [item('P005', 1)], CUPOM_VALIDO);
    expect(resp.status()).toBe(200);
    expectResumo(await resp.json(), { subtotal: 100, desconto: 10, frete: 19.9, freteGratis: false, valorFaltanteFreteGratis: 100, total: 109.9 });
  });
});

/* -------------------------------------------------------------------------- */
/* QUANTIDADE (CA10) - lado "permitido"                                        */
/* -------------------------------------------------------------------------- */
test.describe('Quantidade máxima por produto (casos permitidos)', () => {
  test('CT-QTD-01 | 5 unidades do mesmo produto são aceitas (limite inclusivo)', async ({ request }) => {
    const resp = await calcular(request, [item('P008', 5)]);
    expect(resp.status()).toBe(200);
    const corpo = await resp.json();
    expect.soft(corpo.itens[0].quantidade).toBe(5);
    expectResumo(corpo, { subtotal: 250, desconto: 0, frete: 0, freteGratis: true, valorFaltanteFreteGratis: 0, total: 250 });
  });

  test('CT-QTD-01 | 5×P001 com cupom', async ({ request }) => {
    const resp = await calcular(request, [item('P001', 5)], CUPOM_VALIDO);
    expect(resp.status()).toBe(200);
    expectResumo(await resp.json(), { subtotal: 299.5, desconto: 29.95, frete: 0, freteGratis: true, valorFaltanteFreteGratis: 0, total: 269.55 });
  });

  test('CT-QTD-03 | o limite é por produto: os 8 produtos com 5 unidades cada são aceitos', async ({ request }) => {
    const itens = ['P001', 'P002', 'P003', 'P004', 'P005', 'P006', 'P007', 'P008'].map((id) => item(id, 5));
    const resp = await calcular(request, itens, CUPOM_VALIDO);
    expect(resp.status()).toBe(200);
    const corpo = await resp.json();
    expectResumo(corpo, { subtotal: 4247, desconto: 424.7, frete: 0, freteGratis: true, valorFaltanteFreteGratis: 0, total: 3822.3 });
    expectInvariantes(corpo, 'todos os produtos x5');
  });
});

/* -------------------------------------------------------------------------- */
/* ARREDONDAMENTO (CA11) e FÓRMULA                                             */
/* -------------------------------------------------------------------------- */
test.describe('Cálculo e arredondamento', () => {
  // 59,90 × 3 = 179.70000000000002 em ponto flutuante: detecta falta de arredondamento (CA11).
  test('CT-CAL-02 | 3×P001 sem cupom: valores com 2 casas, sem artefato de ponto flutuante', async ({ request }) => {
    const resp = await calcular(request, [item('P001', 3)]);
    expect(resp.status()).toBe(200);
    expectResumo(await resp.json(), { subtotal: 179.7, desconto: 0, frete: 19.9, freteGratis: false, valorFaltanteFreteGratis: 20.3, total: 199.6 });
  });

  test('CT-CAL-02 | 3×P001 com cupom: desconto 17,97 e total 181,63', async ({ request }) => {
    const resp = await calcular(request, [item('P001', 3)], CUPOM_VALIDO);
    expect(resp.status()).toBe(200);
    expectResumo(await resp.json(), { subtotal: 179.7, desconto: 17.97, frete: 19.9, freteGratis: false, valorFaltanteFreteGratis: 20.3, total: 181.63 });
  });

  const carrinhos: Array<{ nome: string; itens: ItemReq[] }> = [
    { nome: '1×P001', itens: [item('P001', 1)] },
    { nome: '3×P001', itens: [item('P001', 3)] },
    { nome: 'P003 + P006', itens: [item('P003', 1), item('P006', 1)] },
    { nome: '5×P007', itens: [item('P007', 5)] },
    { nome: '4×P004', itens: [item('P004', 4)] },
    { nome: '2×P005', itens: [item('P005', 2)] },
    { nome: 'P008 + 2×P006', itens: [item('P008', 1), item('P006', 2)] },
    { nome: 'P001 + P002 + P004', itens: [item('P001', 1), item('P002', 1), item('P004', 1)] },
  ];

  test('CT-CAL-01 | invariantes (fórmula do total, regra do frete, faltante, soma dos itens, 2 casas) em vários carrinhos, com e sem cupom', async ({ request }) => {
    for (const c of carrinhos) {
      for (const cupom of [undefined, CUPOM_VALIDO]) {
        const resp = await calcular(request, c.itens, cupom);
        expect(resp.status(), `${c.nome} (${cupom ?? 'sem cupom'})`).toBe(200);
        expectInvariantes(await resp.json(), `${c.nome} (${cupom ?? 'sem cupom'})`);
      }
    }
  });

  test('CT-CAL-05 | o cálculo é determinístico e sem estado: a mesma entrada repetida dá a mesma saída', async ({ request }) => {
    const entrada = [item('P002', 1), item('P004', 2)];
    const a = await (await calcular(request, entrada, CUPOM_VALIDO)).json();
    const b = await (await calcular(request, entrada, CUPOM_VALIDO)).json();
    expect(b).toEqual(a);
  });
});
