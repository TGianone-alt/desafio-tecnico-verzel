import { test as base, createBdd } from 'playwright-bdd';
import type { APIResponse } from '@playwright/test';
import { CLIENTE_VALIDO, type ItemReq } from '../support/api';

/**
 * "Mundo" de cada cenário: guarda o carrinho montado nos passos "Dado", a última resposta da API
 * e os valores já lidos, para que os passos "Então" possam conferi-los.
 */
export interface Mundo {
  itens: ItemReq[];
  cliente: { nome: string; email: string; cep: string };
  rota?: string;
  resp?: APIResponse;
  status?: number;
  texto?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  corpo?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  calculo?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  respostas?: Array<Record<string, any>>;
}

export const test = base.extend<{ mundo: Mundo }>({
  // eslint-disable-next-line no-empty-pattern
  mundo: async ({}, use) => {
    await use({ itens: [], cliente: { ...CLIENTE_VALIDO } });
  },
});

export const { Given, When, Then } = createBdd(test);
