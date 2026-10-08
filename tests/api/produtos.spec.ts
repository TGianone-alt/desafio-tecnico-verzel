import { test, expect } from '@playwright/test';
import { PRODUTOS, expectErro } from './support';

test.describe('Catálogo de produtos (GET /api/produtos)', () => {
  test('CT-API-01 | lista os 8 produtos com id, nome, descricao, categoria e preco', async ({ request }) => {
    const resp = await request.get('/api/produtos');
    expect(resp.status()).toBe(200);
    const lista = await resp.json();
    expect(Array.isArray(lista)).toBe(true);
    expect(lista).toHaveLength(Object.keys(PRODUTOS).length);
    for (const [id, esperado] of Object.entries(PRODUTOS)) {
      const p = lista.find((x: { id: string }) => x.id === id);
      expect.soft(p, `produto ${id} presente`).toBeDefined();
      expect.soft(p?.nome, `${id}.nome`).toBe(esperado.nome);
      expect.soft(p?.preco, `${id}.preco`).toBe(esperado.preco);
      expect.soft(typeof p?.descricao, `${id}.descricao`).toBe('string');
      expect.soft(typeof p?.categoria, `${id}.categoria`).toBe('string');
    }
  });

  for (const [id, esperado] of Object.entries(PRODUTOS)) {
    test(`CT-API-02 | GET /api/produtos/${id} retorna 200 com o produto`, async ({ request }) => {
      const resp = await request.get(`/api/produtos/${id}`);
      expect(resp.status()).toBe(200);
      const p = await resp.json();
      expect.soft(p.id).toBe(id);
      expect.soft(p.nome).toBe(esperado.nome);
      expect.soft(p.preco).toBe(esperado.preco);
    });
  }

  test('CT-API-02 | GET /api/produtos/P999 retorna 404 PRODUTO_NAO_ENCONTRADO', async ({ request }) => {
    await expectErro(await request.get('/api/produtos/P999'), 404, 'PRODUTO_NAO_ENCONTRADO');
  });
});
