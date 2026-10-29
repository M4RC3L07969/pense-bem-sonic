# Plano de implementação — Pense Bem: Uma Aventura Científica com Sonic

Roteiro para o **Claude executar**. O Marcelo aprova o plano, manda executar cada fase e autoriza os commits.

Entrega e apresentação: **17/11/2026**. Grupo: Marcelo de Moura Maia Júnior, Pedro Augusto Pereira da Silva, Yago Amaro Zamborlini.

## Regras de execução

1. **Nunca fazer commit, push ou qualquer outra operação que altere o Git sem autorização explícita do Marcelo.** Ao fim de cada fase, propor as mensagens de commit e esperar o "pode commitar".
2. Executar **uma fase por vez**, só quando o Marcelo mandar. Ao terminar, parar no **ponto de parada** da fase e apresentar o resultado.
3. Ninguém do grupo faz tarefa técnica. O Marcelo só: aprova, testa no iPhone quando pedido, envia os RAs, faz o push (ou autoriza) e apresenta.
4. Definição de pronto de toda fase:
   - `npm test`, `npm run lint` e `npm run format:check` passando;
   - app aberto no navegador (Playwright) e conferido por screenshot, quando a fase mexer em tela;
   - teste no Snack (SDK 55) quando a fase mexer em código do app;
   - README ("Andamento") e este plano atualizados (sem commitar).
5. Seguir o `CLAUDE.md`: JavaScript, JSDoc nas funções exportadas, sem comentário linha a linha, `StyleSheet` + tokens do tema, só peças que rodam no Expo Go/Snack.
6. Direitos autorais: não desenhar o Sonic nem nenhum personagem, não usar logotipos (Pense Bem, Tectoy, SEGA), não copiar imagens do livro. O PDF fica em `referencias/` e nunca é versionado.

## Decisões já tomadas

| Tema        | Decisão                                                                                                                                                |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Modo do app | Igual ao aparelho: a pergunta é lida no livro; o app é o aparelho (visor, `LIVRO`, números, `ENTER`, 4 teclas coloridas). O app não mostra enunciados. |
| Respostas   | Cores: `vermelho`, `amarelo`, `azul`, `verde` (ordem do livro e da tabela do documento).                                                               |
| Gabarito    | O Claude resolve as 150 perguntas sozinho, com conferência dupla. Só as dúvidas reais vão para o Marcelo decidir.                                      |
| Programa 6  | Código `026`: sorteia 30 das 150 perguntas; o visor mostra o número original da pergunta.                                                              |
| Extras      | Sons de acerto/erro, cor certa revelada após 3 erros, animações no visor e nas teclas, recorde por programa.                                           |
| Telas       | Uma tela só (o aparelho); o que muda é o estado. Sem Expo Router.                                                                                      |
| Versão      | Projeto no SDK 58; entrega no Snack (SDK 55). Usar `Animated` do React Native, não Reanimated.                                                         |

## Fase 1 — Gabarito (29/10 – 31/10) — concluída

**Objetivo:** `src/data/gabarito.json` com as 150 respostas em cores, confiáveis.

1. Trocar o formato do gabarito de letras para cores:
   - `src/logic/gabarito.js`: `ALTERNATIVAS` vira `CORES = ['vermelho', 'amarelo', 'azul', 'verde']`; remover os campos opcionais `enunciado` e `alternativas` (o app não mostra texto).
   - Atualizar os testes, a seção "Formato do gabarito" do README e o `CLAUDE.md`.
2. Resolver as perguntas:
   - Renderizar cada página do PDF em boa resolução (150 dpi) e ler as perguntas do programa.
   - Para cada pergunta, registrar a cor, uma justificativa curta e a confiança (alta / média / baixa).
   - Atenção especial às perguntas de figura, labirinto (51–56), cruzadinha (81–86), quebra-cabeça (27–30) e sequências: ler com zoom na região.
3. Conferência dupla: segunda leitura de todas as perguntas, sem olhar a primeira resposta; comparar. Divergência vira dúvida.
4. Gerar `docs/gabarito-revisao.md` (número, cor, justificativa, confiança) — serve para a apresentação e para o grupo estudar.
5. Os testes de `__tests__/dados-do-gabarito.test.js` deixam de ser "todo" e passam a exigir os 5 programas completos.

**Ponto de parada 1:** mostrar o resumo (quantas de confiança alta/média/baixa) e a lista curta de dúvidas reais para o Marcelo decidir. Propor o commit.

## Fase 2 — Lógica do aparelho (31/10 – 02/11)

**Objetivo:** toda a regra do jogo em funções puras, testadas, sem nada de interface.

1. `src/logic/aparelho.js` — máquina de estados no formato _reducer_ (`reduzir(estado, acao) → novoEstado`, usado depois com `useReducer`):
   - Fases do aparelho: `inicio` → `codigo` → `pergunta` → `revelando` (mostra a cor certa após 3 erros) → `resultado`.
   - Ações: `LIVRO`, `DIGITO` (0–9), `APAGAR`, `ENTER`, `COR` (uma das 4 cores), `AVANCAR` (disparada pela tela depois da animação de acerto/erro/revelação).
   - Regras: `LIVRO` a qualquer momento recomeça a digitação do código; `ENTER` só aceita 3 dígitos de um código válido (021–026), senão o visor mostra erro e limpa; tecla sem efeito na fase atual é ignorada (estado não muda); pontos sempre via `pontosDaPergunta`.
2. `src/logic/sorteio.js` — `sortearPerguntas(perguntas, quantidade, aleatorio = Math.random)`: embaralhamento de Fisher-Yates (todas as ordens com a mesma chance), sem repetição, gerador de números injetável para os testes.
3. `src/logic/recorde.js` — `atualizarRecorde(recordes, codigo, pontos)` puro (só sobe, nunca desce).
4. `src/services/armazenamento.js` — ler/gravar os recordes com `@react-native-async-storage/async-storage` (instalar com `npx expo install`). Se falhar, o app segue sem recorde, sem quebrar.
5. Testes: jogo completo de 30 perguntas (tudo na 1ª = 90, tudo errado = 0, misto); código inválido; menos de 3 dígitos; `APAGAR`; `LIVRO` no meio do jogo; teclas ignoradas na fase errada; revelação após 3 erros; programa 6 com 30 perguntas distintas vindas dos programas 1–5; recorde só subindo; armazenamento com falha simulada.
6. Teste rápido no Snack de que o AsyncStorage funciona no SDK 55.

**Ponto de parada 2:** resumo dos testes e de qualquer decisão de regra que surgiu. Propor o commit.

## Fase 3 — Visual (02/11 – 05/11)

**Objetivo:** identidade visual escolhida pelo Marcelo e componentes prontos.

1. Carregar as skills `frontend-design` e `expo-native-ui`.
2. Criar **3 propostas** de visual do aparelho (direções diferentes de cor, forma e tipografia), renderizadas como imagens a partir do próprio app no navegador.
3. **Ponto de parada 3a:** o Marcelo escolhe uma proposta (ou pede ajustes).
4. `src/theme/index.js`: tokens de cor (incluindo as 4 cores das teclas, com contraste conferido), tipografia, espaçamento, raios e sombras.
5. Componentes em `src/components/`:
   - `Visor` — visor estilo LCD; dígitos de 7 segmentos desenhados com `View` (sem depender de fonte externa).
   - `Tecla` — tecla genérica (número, `LIVRO`, `ENTER`, `APAGAR`).
   - `TeclaCor` — tecla colorida de resposta.
   - `Teclado` — organiza as teclas.
6. Conferir em larguras de iPhone pequeno e grande e no navegador.

**Ponto de parada 3b:** screenshots dos componentes. Propor o commit.

## Fase 4 — Aparelho funcionando (05/11 – 08/11)

**Objetivo:** jogo completo de ponta a ponta.

1. `src/screens/Aparelho.js`: `useReducer(reduzir)`, desenha o estado no `Visor`, envia as teclas; temporizadores para `AVANCAR` (limpos ao desmontar a tela).
2. `App.js` passa a só mostrar a tela `Aparelho`.
3. O visor mostra: número da pergunta (numeração do livro), tentativa atual, acerto/erro, pontos no fim.
4. Teste automatizado no navegador (Playwright): jogar um programa inteiro clicando nas teclas e conferir o total.
5. Teste no Snack.

**Ponto de parada 4:** o Marcelo testa no iPhone. Propor o commit.

## Fase 5 — Extras (08/11 – 11/11)

1. **Sons:** gerar bipes próprios (ondas simples criadas por script, sem direitos autorais) em `assets/sons/`; tocar com `expo-audio` (instalar com `npx expo install`). Testar no Snack; se não funcionar lá, o app segue sem som.
2. **Animações** (`Animated`): visor pisca no acerto/erro, tecla afunda ao tocar, revelação da cor certa pisca a tecla correta.
3. **Recorde:** mostrar no visor ao entrar no programa e na tela de resultado; avisar "novo recorde".
4. Testes do que for lógica; screenshots do resto; Snack.

**Ponto de parada 5:** o Marcelo testa no iPhone. Propor o commit.

## Fase 6 — Entrega (12/11 – 14/11)

1. **Snack:** criar o Snack na conta Expo do Marcelo pelo Chrome dele (ele já está logado). Se o "Import git repository" continuar falhando, enviar os arquivos pelo "Import files". Testar nas prévias Web, Android e iOS do Snack.
2. **Documento:** gerar o `.docx` preenchido por script (`python-docx`): nomes e RAs, livro escolhido, códigos 021–025 e o gabarito marcado nas células da cor certa, tudo a partir do `gabarito.json`. Converter para PDF.
3. **Ponto de parada 6:** o Marcelo confere o Snack e o PDF. Entregar no Classroom só ele, ou o Claude com autorização explícita.

**Folga:** 15/11 – 16/11 para correções.

## Riscos

| Risco                                        | Plano                                                                                |
| -------------------------------------------- | ------------------------------------------------------------------------------------ |
| Resposta errada no gabarito                  | Conferência dupla + dúvidas levadas ao Marcelo; testes garantem formato e sequência. |
| Algo do SDK 58 não rodar no Snack (SDK 55)   | Testar no Snack ao fim das fases 2, 4 e 5; evitar bibliotecas extras.                |
| Som ou AsyncStorage não funcionarem no Snack | Testar cedo; app funciona sem som e sem recorde.                                     |
| Import do repositório no Snack falhou        | Usar "Import files"; deixar a fase 6 com folga.                                      |
| RAs do grupo                                 | Marcelo envia antes da fase 6.                                                       |

## Pendências do Marcelo

- [ ] Aprovar este plano.
- [ ] Enviar os RAs dos três integrantes (até a fase 6).
- [ ] Decidir as dúvidas do gabarito (ponto de parada 1).
- [ ] Escolher o visual (ponto de parada 3a).
- [ ] Testar no iPhone (pontos de parada 4 e 5).
