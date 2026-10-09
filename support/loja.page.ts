import { expect, Locator, Page } from '@playwright/test';

/**
 * ⚠️  RASCUNHO — seletores escritos a partir das telas da loja (textos e rótulos), mas AINDA NÃO
 * validados no navegador. Para finalizar:
 *   1. npm run codegen          (grave: adicionar produto → carrinho → cupom)
 *   2. ajuste os seletores desta classe com o que o codegen mostrar
 *   3. troque SELETORES_CONFIRMADOS para true
 */
export const SELETORES_CONFIRMADOS = false;

export class LojaPage {
  constructor(readonly page: Page) {}

  async abrir(): Promise<void> {
    await this.page.goto('/');
  }

  /** Cartão do produto na listagem: o ancestral mais próximo do título que contém o botão de adicionar. */
  cartaoProduto(nome: string): Locator {
    return this.page
      .getByText(nome, { exact: true })
      .locator('xpath=ancestor::*[.//button[contains(., "Adicionar")]][1]');
  }

  botaoAdicionar(nome: string): Locator {
    return this.cartaoProduto(nome).getByRole('button', { name: /Adicionar ao carrinho/ });
  }

  async adicionar(nome: string, vezes = 1): Promise<void> {
    for (let i = 0; i < vezes; i++) {
      await this.botaoAdicionar(nome).click();
    }
  }

  async irParaProdutos(): Promise<void> {
    await this.page.getByRole('link', { name: 'Produtos' }).click();
  }

  async abrirCarrinho(): Promise<void> {
    await this.page.getByRole('link', { name: /Carrinho/ }).click();
  }

  async aplicarCupom(codigo: string): Promise<void> {
    await this.page.getByLabel('Cupom de desconto').fill(codigo);
    await this.page.getByRole('button', { name: 'Aplicar cupom' }).click();
  }

  /** Texto do valor da linha do resumo (ex.: "R$ 119,90" ou "Grátis") para o rótulo informado. */
  async valorResumo(rotulo: 'Subtotal' | 'Desconto' | 'Frete' | 'Total'): Promise<string> {
    const linha = this.page.getByText(new RegExp(`^${rotulo}`)).first().locator('xpath=..');
    const texto = (await linha.innerText()).replace(/\s+/g, ' ').trim();
    return texto.replace(new RegExp(`^${rotulo}( \\([^)]*\\))?`), '').trim();
  }

  async esperarValor(rotulo: 'Subtotal' | 'Desconto' | 'Frete' | 'Total', esperado: string): Promise<void> {
    await expect.poll(() => this.valorResumo(rotulo)).toContain(esperado);
  }
}
