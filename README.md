# Pense Bem — Uma Aventura Científica com Sonic

Versão em aplicativo do **Pense Bem**, o brinquedo eletrônico de perguntas e respostas da Tectoy, usando as perguntas do livro **"Pense Bem — Uma Aventura Científica com Sonic"** (Nova Cultural, 1993).

Feito em **React Native** com **Expo**, roda no Android, no iOS e no navegador (pelo [Expo Snack](https://snack.expo.dev)).

> Trabalho (G2) da disciplina **Desenvolvimento Mobile** — Sistemas de Informação.
> Competência: construir aplicativos híbridos (Android e iOS) com React Native.

## Como o jogo funciona

O livro tem 6 programas. Cada programa é aberto digitando o código dele, igual no aparelho original (`LIVRO` → código → `ENTER`):

| Programa | Código | Perguntas       |
| -------- | ------ | --------------- |
| 1        | `021`  | 1 a 30          |
| 2        | `022`  | 31 a 60         |
| 3        | `023`  | 61 a 90         |
| 4        | `024`  | 91 a 120        |
| 5        | `025`  | 121 a 150       |
| 6        | `026`  | avaliação geral |

Regras de pontuação:

- Cada programa tem **30 perguntas**. A pergunta é lida no livro, e cada alternativa tem uma cor: **vermelho, amarelo, azul ou verde**. O jogador responde apertando a tecla da cor.
- O jogador tem **3 tentativas** por pergunta.
- Acertou na 1ª tentativa: **3 pontos**. Na 2ª: **2 pontos**. Na 3ª: **1 ponto**. Errou as três: **0 pontos**.
- No fim das 30 perguntas, o app mostra o **total de pontos** (máximo de 90 por programa).

## Como rodar

Pré-requisitos: [Node.js](https://nodejs.org) (versão LTS) e o app **Expo Go** no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779)).

```bash
git clone https://github.com/M4RC3L07969/pense-bem-sonic.git
cd pense-bem-sonic
npm install
npx expo start
```

Depois é só escanear o QR code com o Expo Go (Android) ou com a câmera (iOS). Para abrir no navegador, aperte `w` no terminal.

O Expo Go exige que o celular e o computador estejam logados na **mesma conta da Expo**. Faça login no terminal antes do primeiro `npx expo start` (veja abaixo se der erro).

## Problemas comuns

### `npx expo login` dá erro no Windows (`cmd.exe ... exited with non-zero code: 1`)

É um bug do Expo CLI: ao abrir o navegador, ele passa o link de login sem aspas para o `cmd.exe`, que se confunde com os `&` do link, e o processo morre antes de receber a resposta do login. Solução no PowerShell:

```powershell
$env:BROWSER="none"
npx expo login
```

O terminal mostra o link e fica esperando. Copie o link, abra no navegador, faça o login e confira com `npx expo whoami`.

Alternativa sem navegador (só se a conta tiver senha): `npx expo login --no-browser -u SEU_USUARIO`.

### iPhone: a câmera não reconhece o QR code

- O app **Expo Go** precisa estar instalado; sem ele, a câmera ignora o link `exp://`.
- Celular e computador no **mesmo Wi-Fi**.
- Se o app abrir mas ficar carregando para sempre, o firewall do Windows está bloqueando: permita o Node.js em **Redes privadas** e confira se o Wi-Fi está marcado como rede privada.

### `You're signed in to Expo Go as "...", but not signed in to Expo CLI`

Falta o login no terminal. Veja o primeiro item desta seção.

## Comandos

| Comando                | O que faz                                                 |
| ---------------------- | --------------------------------------------------------- |
| `npm start`            | Abre o app (Expo)                                         |
| `npm test`             | Roda os testes (pontuação e gabarito)                     |
| `npm run lint`         | Procura erros e maus hábitos no código (ESLint)           |
| `npm run format`       | Formata todos os arquivos no padrão do projeto (Prettier) |
| `npm run format:check` | Só confere a formatação, sem alterar nada                 |

## Estrutura

```
pense-bem-sonic/
├── App.js              # componente raiz (fica na raiz por causa do Expo Snack)
├── index.js            # ponto de entrada (registra o App no Expo)
├── app.json            # configuração do Expo (nome, ícone, splash)
├── assets/             # ícones e imagens do app
├── src/
│   ├── components/     # peças de interface reutilizáveis (botões, visor...)
│   ├── screens/        # telas do app
│   ├── data/           # gabarito.json: respostas de cada programa
│   ├── logic/          # regras do jogo, sem interface (aparelho, pontuação, sorteio, recorde, gabarito)
│   ├── services/       # acesso ao celular (recordes salvos com AsyncStorage)
│   └── theme/          # cores, fontes e espaçamentos
└── __tests__/          # testes automatizados (Jest)
```

As pastas `components`, `screens` e `theme` são criadas quando o primeiro arquivo delas for escrito.

### Formato do gabarito

Cada programa em `src/data/gabarito.json` tem número, código, a primeira pergunta e a lista de respostas:

```json
{
  "numero": 1,
  "codigo": "021",
  "primeiraPergunta": 1,
  "perguntas": [{ "numero": 1, "resposta": "vermelho" }]
}
```

O `numero` segue a numeração do livro (1 a 150) e a `resposta` é uma das cores `vermelho`, `amarelo`, `azul` ou `verde`. O `npm test` confere se cada programa tem 30 perguntas em sequência e se toda resposta é uma dessas cores.

## Andamento

- [x] Repositório e projeto Expo criados
- [x] Regras de pontuação e validação do gabarito, com testes
- [x] Gabarito dos programas 021 a 025 (em cores, com revisão em `docs/gabarito-revisao.md`)
- [x] Lógica do aparelho (teclas, 3 tentativas, Programa 6 sorteado, recorde), com testes
- [ ] Visual do aparelho (visor e teclas)
- [ ] Aparelho funcionando de ponta a ponta
- [ ] Sons, animações e recorde na tela
- [ ] Versão no Expo Snack para a entrega

## Entrega

- Apresentação: **17/11/2026**
- Entregar no Google Classroom o PDF da atividade (com o gabarito preenchido) + o link do Snack.

## Direitos autorais

Projeto acadêmico, sem fins lucrativos. _Sonic the Hedgehog_ é marca registrada da SEGA. O livro _Pense Bem_ é da Editora Nova Cultural / Tectoy (licenciado da VTech). O PDF e as imagens do livro **não** fazem parte deste repositório — se for guardar uma cópia local, use a pasta `referencias/`, que é ignorada pelo Git.

## Licença

O código deste repositório está sob a licença [MIT](LICENSE).
