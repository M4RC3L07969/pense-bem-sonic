/**
 * O que o aparelho mostra em cada fase do jogo.
 *
 * Funções puras: recebem o estado de `aparelho.js` e devolvem textos e tempos, sem React.
 * Todos os textos do visor ficam aqui; o componente `Visor` só desenha.
 */

import { FASES, ERROS_DE_CODIGO, RETORNOS, perguntaAtual, totalFinal } from './aparelho';
import { pontosDaPergunta, pontuacaoMaxima } from './pontuacao';

/** Quanto tempo (em milissegundos) cada aviso fica no visor antes de o jogo seguir. */
export const TEMPOS_DE_AVISO = Object.freeze({
  acerto: 900,
  erro: 1200,
  revelando: 2000,
});

const AVISOS_DE_CODIGO = Object.freeze({
  [ERROS_DE_CODIGO.INCOMPLETO]: 'digite os 3 números',
  [ERROS_DE_CODIGO.INVALIDO]: 'código inválido',
});

function visorDaPergunta(estado, aviso) {
  const { codigo, perguntas } = estado.programa;
  return {
    texto: String(perguntaAtual(estado).numero),
    legenda: `${codigo} · pergunta ${estado.indice + 1} de ${perguntas.length}`,
    tentativa: estado.tentativa,
    aviso,
  };
}

function avisoDoRetorno(estado) {
  if (estado.retorno === RETORNOS.ACERTO) {
    return { texto: `acertou! +${pontosDaPergunta(estado.tentativa)}`, tom: 'acerto' };
  }
  return { texto: 'errou, tente de novo', tom: 'erro' };
}

function avisoDoRecorde(estado) {
  if (estado.novoRecorde) {
    return { texto: 'novo recorde', tom: 'destaque' };
  }
  const recorde = estado.recordes[estado.programa.codigo];
  return recorde === undefined ? null : { texto: `recorde: ${recorde}`, tom: 'neutro' };
}

/**
 * Props do visor e cor destacada do teclado para o estado atual.
 *
 * @param {object} estado Estado do aparelho (de `criarAparelho`).
 * @returns {{
 *   visor: { texto: string, legenda: string, tentativa: number | null,
 *            aviso: { texto: string, tom: string } | null },
 *   corDestacada: string | null,
 * }} `tom` do aviso: `acerto`, `erro`, `destaque`, `neutro` ou uma das 4 cores.
 */
export function visorDoEstado(estado) {
  switch (estado.fase) {
    case FASES.CODIGO:
      return {
        visor: {
          texto: estado.digitos,
          legenda: 'código do programa',
          tentativa: null,
          aviso: estado.erroCodigo
            ? { texto: AVISOS_DE_CODIGO[estado.erroCodigo], tom: 'erro' }
            : null,
        },
        corDestacada: null,
      };
    case FASES.PERGUNTA:
      return { visor: visorDaPergunta(estado, null), corDestacada: null };
    case FASES.RETORNO:
      return { visor: visorDaPergunta(estado, avisoDoRetorno(estado)), corDestacada: null };
    case FASES.REVELANDO: {
      const cor = perguntaAtual(estado).resposta;
      return {
        visor: visorDaPergunta(estado, { texto: `a certa era ${cor}`, tom: cor }),
        corDestacada: cor,
      };
    }
    case FASES.RESULTADO:
      return {
        visor: {
          texto: String(totalFinal(estado)),
          legenda: `pontos de ${pontuacaoMaxima(estado.programa.perguntas.length)} · ENTER joga de novo`,
          tentativa: null,
          aviso: avisoDoRecorde(estado),
        },
        corDestacada: null,
      };
    default:
      return {
        visor: { texto: '---', legenda: 'aperte LIVRO para começar', tentativa: null, aviso: null },
        corDestacada: null,
      };
  }
}

/**
 * Quanto esperar até o jogo seguir sozinho (depois de um aviso de acerto, erro ou da cor revelada).
 *
 * @param {object} estado Estado do aparelho.
 * @returns {number | null} Milissegundos, ou `null` quando o jogo espera uma tecla.
 */
export function tempoAteAvancar(estado) {
  if (estado.fase === FASES.REVELANDO) {
    return TEMPOS_DE_AVISO.revelando;
  }
  if (estado.fase === FASES.RETORNO) {
    return estado.retorno === RETORNOS.ACERTO ? TEMPOS_DE_AVISO.acerto : TEMPOS_DE_AVISO.erro;
  }
  return null;
}
