# Plano — Pense Bem: Uma Aventura Científica com Sonic

Entrega e apresentação: **17/11/2026**. Grupo: Marcelo de Moura Maia Júnior, Pedro Augusto Pereira da Silva, Yago Amaro Zamborlini.

## O que o professor cobra

- App em React Native que joga os programas do livro: **30 perguntas** por programa, **3 tentativas** por pergunta, **3/2/1/0 pontos** e o **total no fim**.
- Entrega no Classroom: documento com nomes e RAs, nome do livro, **códigos dos programas** (021 a 025), **gabarito marcado nas cores** e o **link do Snack**, salvo em PDF.
- Apresentação obrigatória de pelo menos um integrante.

## Decisões

| Tema        | Decisão                                                                                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modo do app | Igual ao aparelho: a pessoa lê a pergunta no livro e responde no app. O app é o "aparelho": visor, teclas `LIVRO`, números, `ENTER` e as 4 teclas coloridas.              |
| Respostas   | **Cores**, como no livro e no documento: vermelho, amarelo, azul, verde (nessa ordem). O gabarito troca A/B/C/D por cores.                                                |
| Gabarito    | O Claude lê as páginas e propõe a cor de cada resposta, marcando as que tiver dúvida; o grupo confere.                                                                    |
| Programa 6  | Código 026: sorteia 30 das 150 perguntas dos programas 1 a 5. O visor mostra o número original da pergunta, para achar no livro.                                          |
| Extras      | Sons de acerto/erro, mostrar a cor certa depois de 3 erros, animações no visor e nas teclas, recorde por programa salvo no celular.                                       |
| Telas       | **Uma tela só**, que é o aparelho. O que muda é o estado do aparelho (esperando livro → digitando código → pergunta → resultado), não a tela. Sem Expo Router.            |
| Versão      | Projeto no Expo SDK 58; a entrega roda no Snack (SDK 55). Testar no Snack ao fim de cada fase. Só peças básicas do React Native (`Animated` nativo em vez de Reanimated). |

## Como o aparelho funciona (máquina de estados)

```
DESLIGADO/INICIO ──LIVRO──▶ DIGITANDO_CODIGO ──3 dígitos + ENTER──▶ PERGUNTA
                                 │ código inválido → visor mostra erro e volta a esperar
PERGUNTA ──tecla colorida──▶ certo?  sim → pontos da tentativa → próxima PERGUNTA
                                     não → tentativa 2, 3 → depois da 3ª, mostra a cor certa → próxima
última pergunta respondida ──▶ RESULTADO (total, recorde) ──LIVRO──▶ novo programa
```

Toda essa lógica fica em `src/logic/` como funções puras (um _reducer_: recebe o estado atual e uma ação, devolve o próximo estado), testada com Jest. A tela só desenha o estado e envia as teclas apertadas.

## Fases

Cada fase termina com `npm test`, `npm run lint`, `npm run format:check` e um teste no Snack.

| #   | Fase                 | O que sai                                                                                                                                                         | Quando        |
| --- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| 0   | Configuração         | Repo, Expo, padrões, testes, README. **Feito.**                                                                                                                   | 28/10         |
| 1   | Gabarito             | Gabarito em cores no `gabarito.json`; proposta do Claude para os programas 1 a 5 com dúvidas marcadas; revisão do grupo.                                          | 29/10 – 03/11 |
| 2   | Lógica do aparelho   | Máquina de estados, sorteio do programa 6, recorde (com o armazenamento separado da lógica). Tudo testado.                                                        | 29/10 – 01/11 |
| 3   | Visual               | 2 ou 3 propostas de visual do aparelho para o grupo escolher (skill frontend-design); depois tema (cores, fontes) e componentes: visor, tecla, teclado.           | 02/11 – 05/11 |
| 4   | Aparelho funcionando | Tela única ligando visual e lógica; jogo completo de ponta a ponta no celular e no navegador.                                                                     | 05/11 – 08/11 |
| 5   | Extras               | Sons próprios (bipes gerados por nós, sem direitos autorais), animações, cor certa após 3 erros, recorde.                                                         | 08/11 – 11/11 |
| 6   | Entrega              | Snack salvo na conta Expo e link testado; documento preenchido (nomes, RAs, livro, códigos e gabarito marcado nas cores gerado a partir do `gabarito.json`); PDF. | 12/11 – 14/11 |
| —   | Folga                | Correções e ensaio da apresentação.                                                                                                                               | 15/11 – 16/11 |

As fases 1 e 2 andam juntas: o gabarito depende do grupo revisar, então começa primeiro.

## Riscos

| Risco                                                     | O que fazer                                                                                      |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Gabarito errado (pontuação errada no jogo e no documento) | Dúvidas marcadas pelo Claude; o grupo confere todas as 150; testes garantem formato e sequência. |
| Algo do SDK 58 não rodar no Snack (SDK 55)                | Testar no Snack ao fim de cada fase; evitar bibliotecas extras.                                  |
| Sons ou armazenamento não funcionarem no Snack            | Testar cedo (fase 2/5); o app tem que funcionar sem som, e o recorde é extra.                    |
| "Import git repository" do Snack falhou com o repo        | Enviar os arquivos para o Snack de outro jeito na fase 6 (deixar folga para isso).               |
| RAs do grupo                                              | Marcelo envia antes da fase 6.                                                                   |

## Pendências

- [ ] RAs dos três integrantes.
- [ ] Revisão do gabarito pelo grupo (fase 1).
- [ ] Escolha do visual (fase 3).
