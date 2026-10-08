import { APIRequestContext, APIResponse, expect } from '@playwright/test';

/** Dados fixos da documentação (seção "Dados para teste"). */
export const PRODUTOS = {
  P001: { nome: 'Camiseta Essencial', preco: 59.9 },
  P002: { nome: 'Calça Jeans Slim', preco: 139.9 },
  P003: { nome: 'Tênis Casual Urbano', preco: 189.9 },
  P004: { nome: 'Boné Aba Curva', preco: 49.9 },
  P005: { nome: 'Mochila Urbana 20L', preco: 100 },
  P006: { nome: 'Kit 3 Pares de Meias', preco: 29.9 },
  P007: { nome: 'Jaqueta Corta-Vento', preco: 229.9 },
  P008: { nome: 'Garrafa Térmica 750ml', preco: 50 },
} as const;

export const CUPOM_VALIDO = 'BEMVINDO10';
export const CUPOM_EXPIRADO = 'VERAO2026';

export const CLIENTE_VALIDO = { nome: 'Maria Silva', email: 'maria@exemplo.com', cep: '01310-100' };

export type ItemReq = { produtoId: string; quantidade: unknown };
export const item = (produtoId: string, quantidade: unknown): ItemReq => ({ produtoId, quantidade });

export interface Resumo {
  subtotal: number;
  desconto: number;
  frete: number;
  freteGratis: boolean;
  valorFaltanteFreteGratis: number;
  total: number;
}

/** POST /api/carrinho/calcular. `cupom` só é enviado quando informado. */
export function calcular(request: APIRequestContext, itens: unknown, cupom?: unknown): Promise<APIResponse> {
  const data: Record<string, unknown> = { itens };
  if (cupom !== undefined) data.cupom = cupom;
  return request.post('/api/carrinho/calcular', { data });
}

/** POST /api/pedidos com o corpo informado (objeto serializado como JSON). */
export function criarPedido(request: APIRequestContext, corpo: Record<string, unknown>): Promise<APIResponse> {
  return request.post('/api/pedidos', { data: corpo });
}

/** Envia o corpo EXATAMENTE como texto (para testar JSON malformado / não-objeto). */
export function postBruto(request: APIRequestContext, rota: string, corpo: string): Promise<APIResponse> {
  return request.post(rota, { data: corpo, headers: { 'Content-Type': 'application/json' } });
}

/** Valida status HTTP + `erro.codigo` + presença de `erro.mensagem`. Retorna o objeto `erro`. */
export async function expectErro(resp: APIResponse, status: number, codigo: string) {
  const texto = await resp.text();
  expect(resp.status(), `status HTTP (corpo recebido: ${texto})`).toBe(status);
  const corpo = JSON.parse(texto);
  expect(corpo.erro, 'o corpo de erro deve ter a chave "erro"').toBeDefined();
  expect(corpo.erro.codigo).toBe(codigo);
  expect(typeof corpo.erro.mensagem, 'erro.mensagem deve ser texto').toBe('string');
  return corpo.erro as { codigo: string; mensagem: string; campo?: string; campos?: unknown };
}

/**
 * Compara o resumo de valores com o esperado. Usa expect.soft para listar TODAS as
 * divergências de uma vez (útil para montar o report do bug).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function expectResumo(corpo: Record<string, any>, esperado: Resumo, rotulo = ''): void {
  const p = rotulo ? `${rotulo}: ` : '';
  expect.soft(corpo.subtotal, `${p}subtotal`).toBe(esperado.subtotal);
  expect.soft(corpo.desconto, `${p}desconto`).toBe(esperado.desconto);
  expect.soft(corpo.frete, `${p}frete`).toBe(esperado.frete);
  expect.soft(corpo.freteGratis, `${p}freteGratis`).toBe(esperado.freteGratis);
  expect.soft(corpo.valorFaltanteFreteGratis, `${p}valorFaltanteFreteGratis`).toBe(esperado.valorFaltanteFreteGratis);
  expect.soft(corpo.total, `${p}total`).toBe(esperado.total);
}

const centavos = (n: number): number => Math.round(n * 100);

/**
 * Invariantes que valem para QUALQUER resposta de cálculo, independentemente da entrada
 * (fórmula do total, regra do frete, faltante, soma dos itens e arredondamento - CA11).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function expectInvariantes(corpo: Record<string, any>, rotulo: string): void {
  for (const campo of ['subtotal', 'desconto', 'frete', 'valorFaltanteFreteGratis', 'total']) {
    // String(n) revela artefatos de ponto flutuante (ex.: 179.70000000000002)
    expect.soft(String(corpo[campo]), `${rotulo}: ${campo} deve ter no máximo 2 casas decimais`).toMatch(/^-?\d+(\.\d{1,2})?$/);
  }
  const itens = corpo.itens as Array<Record<string, number>>;
  for (const it of itens) {
    expect.soft(centavos(it.total), `${rotulo}: total do item ${it.produtoId} = preço × quantidade`).toBe(centavos(it.precoUnitario) * it.quantidade);
    expect.soft(String(it.total), `${rotulo}: total do item ${it.produtoId} com no máximo 2 casas`).toMatch(/^\d+(\.\d{1,2})?$/);
  }
  const somaItens = itens.reduce((acc, it) => acc + centavos(it.total), 0);
  expect.soft(centavos(corpo.subtotal), `${rotulo}: subtotal = soma dos itens`).toBe(somaItens);
  expect.soft(centavos(corpo.total), `${rotulo}: total = subtotal - desconto + frete`).toBe(centavos(corpo.subtotal) - centavos(corpo.desconto) + centavos(corpo.frete));
  const gratis = centavos(corpo.subtotal) >= 20000;
  expect.soft(corpo.freteGratis, `${rotulo}: freteGratis (subtotal >= 200,00)`).toBe(gratis);
  expect.soft(centavos(corpo.frete), `${rotulo}: frete`).toBe(gratis ? 0 : 1990);
  expect.soft(centavos(corpo.valorFaltanteFreteGratis), `${rotulo}: faltante = max(0, 200 - subtotal)`).toBe(Math.max(0, 20000 - centavos(corpo.subtotal)));
  if (corpo.cupom?.aplicado) {
    expect.soft(centavos(corpo.desconto), `${rotulo}: desconto = 10% do subtotal`).toBe(Math.round(centavos(corpo.subtotal) / 10));
  } else {
    expect.soft(corpo.desconto, `${rotulo}: sem cupom aplicado, desconto = 0`).toBe(0);
  }
}
