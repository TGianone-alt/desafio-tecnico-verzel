# Evidências da execução

Convenção de nomes: `<ID do cenário ou bug>_<nn>-<descrição curta>.<ext>`
Exemplos: `CT-FRE-02_01-carrinho-subtotal-200.png`, `BUG-001_02-resposta-api.png`, `CT-CUP-03_01-mensagem-cupom-invalido.png`.

O que registrar em cada cenário (o suficiente para outra pessoa reproduzir e conferir):
- **UI:** captura da tela com o carrinho, o resumo (subtotal, desconto, frete, total) e a mensagem exibida; para fluxos longos, um vídeo/GIF curto.
- **API:** requisição enviada + resposta (status e corpo), pelo DevTools (aba Network → Copy as cURL / Response) ou pelo `curl`.
- **Automação:** salvar a saída do comando em `automacao/execucao-AAAA-MM-DD.txt`:

  ```bash
  npm test > docs/evidencias/automacao/execucao-bdd-AAAA-MM-DD.txt   (PowerShell: npm test | Out-File -Encoding utf8 docs\evidencias\automacao\execucao-bdd-AAAA-MM-DD.txt)
  ```
  e, se quiser publicar o relatório HTML, copiar a pasta `playwright-report/` para `docs/evidencias/automacao/relatorio/`.

Cada evidência deve estar referenciada na coluna **Evidência** de [`../03-execucao.md`](../03-execucao.md) ou no bug correspondente.
