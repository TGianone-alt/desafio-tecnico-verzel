import { test, expect } from '@playwright/test';
import { LojaPage, SELETORES_CONFIRMADOS } from './pages/loja.page';

/**
 * Testes de UI — RASCUNHO. Ficam como "fixme" (pulados e sinalizados no relatório) até os seletores de
 * pages/loja.page.ts serem confirmados com `npm run codegen`. Os valores esperados vêm da documentação
 * e já são validados pelos testes de API (tests/api).
 */
test.describe('UI | cupom e frete (rascunho)', () => {
  test.fixme(!SELETORES_CONFIRMADOS, 'Seletores ainda não confirmados — ver tests/e2e/pages/loja.page.ts');

  test('CT-CUP-01 / CT-CAL-04 | BEMVINDO10 (em minúsculas) reduz 10% e o resumo exibido bate com a API', async ({ page, request }) => {
    const loja = new LojaPage(page);
    await loja.abrir();
    await loja.adicionar('Mochila Urbana 20L');
    await loja.abrirCarrinho();
    await loja.aplicarCupom('  bemvindo10 ');

    const api = await (await request.post('/api/carrinho/calcular', {
      data: { itens: [{ produtoId: 'P005', quantidade: 1 }], cupom: 'BEMVINDO10' },
    })).json();

    expect(await loja.valorResumo(/desconto/i)).toBe(api.desconto); // 10,00
    expect(await loja.valorResumo(/frete/i)).toBe(api.frete);       // 19,90
    expect(await loja.valorResumo(/total/i)).toBe(api.total);       // 109,90
  });

  test('CT-FRE-02 | subtotal exatamente R$ 200,00 (2× Mochila) tem frete grátis', async ({ page }) => {
    const loja = new LojaPage(page);
    await loja.abrir();
    await loja.adicionar('Mochila Urbana 20L', 2);
    await loja.abrirCarrinho();

    expect(await loja.valorResumo(/subtotal/i)).toBe(200);
    expect(await loja.valorResumo(/frete/i)).toBe(0);
    expect(await loja.valorResumo(/total/i)).toBe(200);
  });

  test('CT-QTD-02 | a interface não permite passar de 5 unidades do mesmo produto', async ({ page }) => {
    const loja = new LojaPage(page);
    await loja.abrir();
    await loja.adicionar('Camiseta Essencial', 6);
    await loja.abrirCarrinho();

    expect(await loja.quantidadeNoCarrinho('Camiseta Essencial')).toBeLessThanOrEqual(5);
  });
});
