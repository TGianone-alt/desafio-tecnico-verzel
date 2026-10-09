import { expect } from '@playwright/test';
import { Given, When, Then, test } from '../fixtures';
import { LojaPage, SELETORES_CONFIRMADOS } from '../../support/loja.page';
import { interpretarItens } from '../../support/gherkin';

/** Formata 119.9 como "R$ 119,90" (mesmo padrão da tela). */
const moeda = (valor: string) => `R$ ${valor}`;

Given(/^que o carrinho contém (.+)$/, async ({ page }, texto: string) => {
  test.fixme(!SELETORES_CONFIRMADOS, 'Seletores de UI ainda não confirmados — ver support/loja.page.ts');
  const loja = new LojaPage(page);
  await loja.abrir();
  for (const item of interpretarItens(texto)) {
    await loja.adicionar(item.nome, item.quantidade);
  }
  await loja.abrirCarrinho();
});

When(/^eu aplico o cupom "([^"]*)"$/, async ({ page }, codigo: string) => {
  await new LojaPage(page).aplicarCupom(codigo);
});

When(/^eu volto à listagem de produtos$/, async ({ page }) => {
  await new LojaPage(page).irParaProdutos();
});

Then(/^a tela mostra a mensagem "(.+)"$/, async ({ page }, mensagem: string) => {
  await expect(page.getByText(mensagem)).toBeVisible();
});

Then(/^o (subtotal|desconto|total) exibido é R\$ ([\d.]+,\d{2})$/, async ({ page }, campo: string, valor: string) => {
  const rotulo = (campo[0].toUpperCase() + campo.slice(1)) as 'Subtotal' | 'Desconto' | 'Total';
  await new LojaPage(page).esperarValor(rotulo, moeda(valor));
});

Then(/^o frete exibido é grátis$/, async ({ page }) => {
  await new LojaPage(page).esperarValor('Frete', 'Grátis');
});

Then(/^o botão de adicionar "(.+)" está desabilitado$/, async ({ page }, nome: string) => {
  await expect(new LojaPage(page).botaoAdicionar(nome)).toBeDisabled();
});

Then(/^a listagem informa "(.+)"$/, async ({ page }, mensagem: string) => {
  await expect(page.getByText(mensagem)).toBeVisible();
});
