import { expect } from '@playwright/test';
import type { APIRequestContext, APIResponse } from '@playwright/test';
import { Given, When, Then } from '../fixtures';
import type { Mundo } from '../fixtures';
import { PRODUTOS, calcular, criarPedido, expectInvariantes, postBruto } from '../../support/api';
import { brl, interpretarItens } from '../../support/gherkin';

/* ----------------------------- utilitários ----------------------------- */

/** Guarda status e corpo da resposta para os passos "Então". */
async function registrar(mundo: Mundo, resp: APIResponse) {
  mundo.resp = resp;
  mundo.status = resp.status();
  mundo.texto = await resp.text();
  try {
    mundo.corpo = JSON.parse(mundo.texto);
  } catch {
    mundo.corpo = undefined;
  }
}

async function calcularMundo(request: APIRequestContext, mundo: Mundo, cupom?: string) {
  await registrar(mundo, await calcular(request, mundo.itens, cupom));
  mundo.calculo = mundo.corpo;
}

async function pedirMundo(request: APIRequestContext, mundo: Mundo, extras: Record<string, unknown> = {}) {
  await registrar(mundo, await criarPedido(request, { cliente: mundo.cliente, itens: mundo.itens, ...extras }));
}

/* --------------------------------- DADO --------------------------------- */

Given(/^que o carrinho está vazio$/, async ({ mundo }) => {
  mundo.itens = [];
});

Given(/^que o carrinho contém 5 unidades de cada um dos 8 produtos$/, async ({ mundo }) => {
  mundo.itens = Object.keys(PRODUTOS).map((id) => ({ produtoId: id, quantidade: 5 }));
});

Given(/^que o carrinho contém (?!5 unidades de cada um)(.+)$/, async ({ mundo }, texto: string) => {
  mundo.itens = interpretarItens(texto).map(({ produtoId, quantidade }) => ({ produtoId, quantidade }));
});

/* --------------------------------- QUANDO -------------------------------- */

When(/^eu calculo o carrinho sem cupom$/, async ({ request, mundo }) => {
  await calcularMundo(request, mundo);
});

When(/^eu (?:calculo o carrinho com|aplico) o cupom "([^"]*)"$/, async ({ request, mundo }, cupom: string) => {
  await calcularMundo(request, mundo, cupom);
});

When(/^eu calculo o carrinho duas vezes com o cupom "([^"]*)"$/, async ({ request, mundo }, cupom: string) => {
  mundo.respostas = [];
  for (let i = 0; i < 2; i++) {
    await calcularMundo(request, mundo, cupom);
    mundo.respostas.push(mundo.corpo ?? {});
  }
});

When(/^eu confirmo o pedido$/, async ({ request, mundo }) => {
  await pedirMundo(request, mundo);
});

When(/^eu confirmo o pedido com o cupom "([^"]*)"$/, async ({ request, mundo }, cupom: string) => {
  await pedirMundo(request, mundo, { cupom });
});

When(/^eu confirmo o pedido com o nome "([^"]*)"$/, async ({ request, mundo }, nome: string) => {
  mundo.cliente.nome = nome;
  await pedirMundo(request, mundo);
});

When(/^eu confirmo o pedido com o e-mail "([^"]*)"$/, async ({ request, mundo }, email: string) => {
  mundo.cliente.email = email;
  await pedirMundo(request, mundo);
});

When(/^eu confirmo o pedido com o CEP "([^"]*)"$/, async ({ request, mundo }, cep: string) => {
  mundo.cliente.cep = cep;
  await pedirMundo(request, mundo);
});

When(/^eu confirmo o pedido com o mesmo carrinho sem cupom$/, async ({ request, mundo }) => {
  const calculo = mundo.calculo;
  await pedirMundo(request, mundo);
  mundo.calculo = calculo;
});

When(/^eu confirmo o pedido com o mesmo carrinho e o cupom "([^"]*)"$/, async ({ request, mundo }, cupom: string) => {
  const calculo = mundo.calculo;
  await pedirMundo(request, mundo, { cupom });
  mundo.calculo = calculo;
});

When(/^eu envio (GET|POST|PUT|DELETE) (\/\S*)$/, async ({ request, mundo }, metodo: string, rota: string) => {
  mundo.rota = rota;
  await registrar(mundo, await request.fetch(rota, { method: metodo }));
});

When(/^eu envio POST (\/\S+) com o corpo (.+)$/, async ({ request, mundo }, rota: string, corpo: string) => {
  mundo.rota = rota;
  await registrar(mundo, await postBruto(request, rota, corpo));
});

/* --------------------------------- ENTÃO --------------------------------- */

Then(/^a resposta é (\d{3})$/, async ({ mundo }, status: string) => {
  expect(mundo.status, `status HTTP (corpo recebido: ${mundo.texto})`).toBe(Number(status));
});

Then(/^a resposta é (\d{3}) com o código "([A-Z_]+)"$/, async ({ mundo }, status: string, codigo: string) => {
  expect(mundo.status, `status HTTP (corpo recebido: ${mundo.texto})`).toBe(Number(status));
  expect(mundo.corpo?.erro, 'o corpo de erro deve ter a chave "erro"').toBeDefined();
  expect(mundo.corpo?.erro.codigo).toBe(codigo);
  expect(typeof mundo.corpo?.erro.mensagem, 'erro.mensagem deve ser texto').toBe('string');
});

Then(/^o campo apontado é "(.+)"$/, async ({ mundo }, campo: string) => {
  expect(mundo.corpo?.erro?.campo).toBe(campo);
});

Then(/^a mensagem de erro é "(.+)"$/, async ({ mundo }, mensagem: string) => {
  expect(mundo.corpo?.erro?.mensagem).toBe(mensagem);
});

Then(/^o (subtotal|desconto|frete|total) é R\$ ([\d.]+,\d{2})$/, async ({ mundo }, campo: string, valor: string) => {
  expect(mundo.corpo?.[campo], `${campo} (corpo recebido: ${mundo.texto})`).toBe(brl(valor));
});

Then(/^o valor faltante para o frete grátis é R\$ ([\d.]+,\d{2})$/, async ({ mundo }, valor: string) => {
  expect(mundo.corpo?.valorFaltanteFreteGratis).toBe(brl(valor));
});

Then(/^o frete grátis está (ativo|inativo)$/, async ({ mundo }, estado: string) => {
  expect(mundo.corpo?.freteGratis).toBe(estado === 'ativo');
});

Then(/^o cupom (está|não está) aplicado$/, async ({ mundo }, estado: string) => {
  expect(mundo.corpo?.cupom?.aplicado === true, 'cupom.aplicado').toBe(estado === 'está');
});

Then(/^a mensagem do cupom é "(.+)"$/, async ({ mundo }, mensagem: string) => {
  expect(mundo.corpo?.cupom?.mensagem).toBe(mensagem);
});

Then(/^os valores respeitam as regras de cálculo$/, async ({ mundo }) => {
  const rotulo = mundo.itens.map((i) => `${i.quantidade}×${i.produtoId}`).join(' + ');
  expectInvariantes(mundo.corpo ?? {}, rotulo);
});

Then(/^as duas respostas são idênticas$/, async ({ mundo }) => {
  expect(mundo.respostas).toHaveLength(2);
  expect(mundo.respostas?.[1]).toEqual(mundo.respostas?.[0]);
});

Then(/^os valores do pedido são iguais aos do cálculo$/, async ({ mundo }) => {
  expect(mundo.status, `status do pedido (corpo recebido: ${mundo.texto})`).toBe(201);
  for (const campo of ['subtotal', 'desconto', 'frete', 'freteGratis', 'valorFaltanteFreteGratis', 'total']) {
    expect.soft(mundo.corpo?.[campo], campo).toBe(mundo.calculo?.[campo]);
  }
});

Then(/^o número do pedido segue o formato VZ-NNNNNN$/, async ({ mundo }) => {
  expect(mundo.corpo?.numero).toMatch(/^VZ-\d{6}$/);
  expect(Number.isNaN(Date.parse(mundo.corpo?.criadoEm)), 'criadoEm deve ser uma data ISO válida').toBe(false);
});

Then(/^o CEP do cliente é devolvido como "(\d{8})"$/, async ({ mundo }, cep: string) => {
  expect(mundo.corpo?.cliente?.cep).toBe(cep);
});

Then(/^a resposta é 200 com 8 produtos$/, async ({ mundo }) => {
  expect(mundo.status).toBe(200);
  expect(Array.isArray(mundo.corpo)).toBe(true);
  expect(mundo.corpo).toHaveLength(Object.keys(PRODUTOS).length);
});

Then(/^cada produto tem id, nome, descricao, categoria e preco conforme a tabela da documentação$/, async ({ mundo }) => {
  const lista = mundo.corpo as unknown as Array<Record<string, unknown>>;
  for (const [id, esperado] of Object.entries(PRODUTOS)) {
    const p = lista.find((x) => x.id === id);
    expect.soft(p, `produto ${id} presente`).toBeDefined();
    expect.soft(p?.nome, `${id}.nome`).toBe(esperado.nome);
    expect.soft(p?.preco, `${id}.preco`).toBe(esperado.preco);
    expect.soft(typeof p?.descricao, `${id}.descricao`).toBe('string');
    expect.soft(typeof p?.categoria, `${id}.categoria`).toBe('string');
  }
});

Then(/^o produto retornado é "(.+)" com preço R\$ ([\d.]+,\d{2})$/, async ({ mundo }, nome: string, preco: string) => {
  expect(mundo.corpo?.id).toBe(mundo.rota?.split('/').pop());
  expect(mundo.corpo?.nome).toBe(nome);
  expect(mundo.corpo?.preco).toBe(brl(preco));
});
