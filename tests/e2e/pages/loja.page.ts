import { Page, Locator } from '@playwright/test';

/**
 * ⚠️  RASCUNHO — os seletores abaixo foram escritos SEM inspecionar o DOM real da loja.
 *
 * Para finalizar os testes de UI:
 *   1. npm run codegen            (abre o gravador; navegue: adicionar produto → carrinho → cupom)
 *   2. Ajuste os seletores desta classe com o que o codegen gerar (prefira getByRole / getByLabel / data-testid).
 *   3. Troque SELETORES_CONFIRMADOS para true.
 */
export const SELETORES_CONFIRMADOS = false;

/** 'R$ 1.234,56' -> 1234.56 */
export const brl = (texto: string): number => Number(texto.replace(/[^\d,-]/g, '').replace('.', '').replace(',', '.'));

export class LojaPage {
  constructor(readonly page: Page) {}

  async abrir(): Promise<void> {
    await this.page.goto('/');
  }

  /** Card do produto na listagem (AJUSTAR). */
  produto(nome: string): Locator {
    return this.page.locator('article, li, [data-testid^="produto"]').filter({ hasText: nome }).first();
  }

  /** Clica em "Adicionar" `vezes` vezes (AJUSTAR o nome do botão). */
  async adicionar(nome: string, vezes = 1): Promise<void> {
    for (let i = 0; i < vezes; i++) {
      await this.produto(nome).getByRole('button', { name: /adicionar/i }).click();
    }
  }

  async abrirCarrinho(): Promise<void> {
    await this.page.getByRole('link', { name: /carrinho/i }).click();
  }

  async aplicarCupom(codigo: string): Promise<void> {
    await this.page.getByLabel(/cupom/i).fill(codigo);
    await this.page.getByRole('button', { name: /aplicar/i }).click();
  }

  /** Valor monetário da linha do resumo cujo rótulo casa com `rotulo` (AJUSTAR conforme o layout). */
  async valorResumo(rotulo: RegExp): Promise<number> {
    const linha = this.page.locator('tr, li, div').filter({ hasText: rotulo }).last();
    const texto = (await linha.innerText()).match(/R\$\s?[\d.,]+/g)?.pop() ?? '';
    return brl(texto);
  }

  /** Quantidade exibida do item no carrinho (AJUSTAR: input de quantidade ou texto). */
  async quantidadeNoCarrinho(nome: string): Promise<number> {
    const linha = this.page.locator('tr, li, article').filter({ hasText: nome }).first();
    const input = linha.locator('input[type="number"]');
    if (await input.count()) return Number(await input.inputValue());
    return Number((await linha.innerText()).match(/\b(\d+)\b/)?.[1] ?? 0);
  }
}
