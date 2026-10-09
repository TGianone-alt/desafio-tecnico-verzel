import { PRODUTOS } from './api';

/** "1.234,56" (já sem o "R$ ") -> 1234.56 */
export const brl = (texto: string): number => Number(texto.replace(/\./g, '').replace(',', '.'));

export const idDoProduto = (nomeOuId: string): string => {
  if (/^P\d{3}$/.test(nomeOuId)) return nomeOuId; // permite citar o id direto (ex.: "P999")
  const achado = Object.entries(PRODUTOS).find(([, p]) => p.nome === nomeOuId);
  if (!achado) throw new Error(`Produto desconhecido no cenário: "${nomeOuId}"`);
  return achado[0];
};

/** Lê frases como: 1 unidade de "Calça Jeans Slim" e 2 unidades de "Boné Aba Curva" */
export function interpretarItens(texto: string): Array<{ produtoId: string; nome: string; quantidade: number }> {
  const re = /(-?\d+(?:\.\d+)?)\s*(?:unidades?\s+de\s+)?"([^"]+)"/g;
  const itens = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(texto)) !== null) {
    const produtoId = idDoProduto(m[2]);
    itens.push({ produtoId, nome: m[2], quantidade: Number(m[1]) });
  }
  if (itens.length === 0) throw new Error(`Não consegui interpretar os itens do carrinho: ${texto}`);
  return itens;
}
