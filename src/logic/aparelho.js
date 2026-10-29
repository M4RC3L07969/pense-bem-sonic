/**
 * Máquina de estados do aparelho Pense Bem.
 *
 * Toda regra do jogo fica aqui, sem nada de interface: a tela só desenha o estado e
 * repassa as teclas como ações para `reduzir` (no formato usado pelo `useReducer` do React).
 *
 * Fluxo: `inicio` → (LIVRO) → `codigo` → (3 dígitos + ENTER) → `pergunta` → (COR) →
 * `retorno` (acerto ou erro) ou `revelando` (errou as 3 tentativas) → (AVANCAR) →
 * próxima `pergunta` ou `resultado`. LIVRO, em qualquer fase, volta a pedir o código.
 */

import { CORES } from './gabarito';
import { MAX_TENTATIVAS, totalDePontos } from './pontuacao';
import { montarPrograma } from './programas';
import { atualizarRecorde, normalizarRecordes } from './recorde';

/** Tipos de ação aceitos por `reduzir`. */
export const ACOES = Object.freeze({
  LIVRO: 'LIVRO',
  DIGITO: 'DIGITO',
  APAGAR: 'APAGAR',
  ENTER: 'ENTER',
  COR: 'COR',
  AVANCAR: 'AVANCAR',
  RECORDES_CARREGADOS: 'RECORDES_CARREGADOS',
});

/** Fases possíveis do aparelho. */
export const FASES = Object.freeze({
  INICIO: 'inicio',
  CODIGO: 'codigo',
  PERGUNTA: 'pergunta',
  RETORNO: 'retorno',
  REVELANDO: 'revelando',
  RESULTADO: 'resultado',
});

/** Motivos de recusa do código digitado. */
export const ERROS_DE_CODIGO = Object.freeze({
  INCOMPLETO: 'incompleto',
  INVALIDO: 'invalido',
});

/** Tipos de retorno mostrados depois de uma tentativa. */
export const RETORNOS = Object.freeze({
  ACERTO: 'acerto',
  ERRO: 'erro',
});

const DIGITOS_DO_CODIGO = 3;

const ESTADO_INICIAL = Object.freeze({
  fase: FASES.INICIO,
  digitos: '',
  erroCodigo: null,
  programa: null,
  indice: 0,
  tentativa: 1,
  resultados: Object.freeze([]),
  retorno: null,
  recordes: Object.freeze({}),
  novoRecorde: false,
});

function ehDigito(valor) {
  return Number.isInteger(valor) && valor >= 0 && valor <= 9;
}

function juntarRecordes(atuais, carregados) {
  const juntos = { ...carregados };
  Object.entries(atuais).forEach(([codigo, pontos]) => {
    if (juntos[codigo] === undefined || pontos > juntos[codigo]) {
      juntos[codigo] = pontos;
    }
  });
  return juntos;
}

/**
 * Pergunta que está no visor.
 *
 * @param {object} estado Estado do aparelho.
 * @returns {{ numero: number, resposta: string } | null} A pergunta atual, ou `null` fora de um programa.
 */
export function perguntaAtual(estado) {
  return estado.programa?.perguntas[estado.indice] ?? null;
}

/**
 * Cor da resposta certa da pergunta atual (usada para revelá-la depois de 3 erros).
 *
 * @param {object} estado Estado do aparelho.
 * @returns {string | null} Uma das cores, ou `null` fora de um programa.
 */
export function corCerta(estado) {
  return perguntaAtual(estado)?.resposta ?? null;
}

/**
 * Pontos somados até agora no programa em andamento.
 *
 * @param {object} estado Estado do aparelho.
 * @returns {number} Total das perguntas já encerradas.
 */
export function pontosAteAgora(estado) {
  return totalDePontos(estado.resultados);
}

/**
 * Total do programa, disponível só quando ele termina.
 *
 * @param {object} estado Estado do aparelho.
 * @returns {number | null} O total, ou `null` se o programa ainda não terminou.
 */
export function totalFinal(estado) {
  return estado.fase === FASES.RESULTADO ? totalDePontos(estado.resultados) : null;
}

/**
 * Cria o aparelho para um gabarito.
 *
 * @param {{ gabarito: { programas: object[] }, aleatorio?: () => number }} opcoes
 *   `gabarito` é o conteúdo de `src/data/gabarito.json`; `aleatorio` (padrão `Math.random`)
 *   é usado no sorteio do Programa 6.
 * @returns {{ estadoInicial: object, reduzir: (estado: object, acao: object) => object }}
 *   O estado de quando o aparelho é ligado e a função que calcula o próximo estado.
 *   `reduzir` nunca altera o estado recebido e devolve o mesmo objeto quando a ação não tem efeito.
 * @throws {TypeError} Se o gabarito não tiver a lista de programas.
 */
export function criarAparelho({ gabarito, aleatorio = Math.random } = {}) {
  if (!gabarito || !Array.isArray(gabarito.programas)) {
    throw new TypeError('gabarito precisa ter a lista "programas"');
  }

  function pedirCodigo(estado) {
    return { ...ESTADO_INICIAL, fase: FASES.CODIGO, recordes: estado.recordes };
  }

  function iniciarPrograma(estado, programa) {
    return { ...ESTADO_INICIAL, fase: FASES.PERGUNTA, programa, recordes: estado.recordes };
  }

  function encerrarPergunta(estado) {
    if (estado.indice + 1 < estado.programa.perguntas.length) {
      return {
        ...estado,
        fase: FASES.PERGUNTA,
        indice: estado.indice + 1,
        tentativa: 1,
        retorno: null,
      };
    }
    const { recordes, novoRecorde } = atualizarRecorde(
      estado.recordes,
      estado.programa.codigo,
      totalDePontos(estado.resultados),
    );
    return { ...estado, fase: FASES.RESULTADO, retorno: null, recordes, novoRecorde };
  }

  function digitar(estado, digito) {
    if (estado.fase !== FASES.CODIGO || !ehDigito(digito)) {
      return estado;
    }
    if (estado.digitos.length >= DIGITOS_DO_CODIGO) {
      return estado;
    }
    return { ...estado, digitos: estado.digitos + String(digito), erroCodigo: null };
  }

  function apagar(estado) {
    if (estado.fase !== FASES.CODIGO || (estado.digitos === '' && estado.erroCodigo === null)) {
      return estado;
    }
    return { ...estado, digitos: estado.digitos.slice(0, -1), erroCodigo: null };
  }

  function confirmar(estado) {
    if (estado.fase === FASES.RESULTADO) {
      return iniciarPrograma(estado, montarPrograma(estado.programa.codigo, gabarito, aleatorio));
    }
    if (estado.fase !== FASES.CODIGO) {
      return estado;
    }
    if (estado.digitos.length < DIGITOS_DO_CODIGO) {
      return estado.erroCodigo === ERROS_DE_CODIGO.INCOMPLETO
        ? estado
        : { ...estado, erroCodigo: ERROS_DE_CODIGO.INCOMPLETO };
    }
    const programa = montarPrograma(estado.digitos, gabarito, aleatorio);
    if (!programa) {
      return { ...estado, digitos: '', erroCodigo: ERROS_DE_CODIGO.INVALIDO };
    }
    return iniciarPrograma(estado, programa);
  }

  function responder(estado, cor) {
    if (estado.fase !== FASES.PERGUNTA || !CORES.includes(cor)) {
      return estado;
    }
    if (cor === corCerta(estado)) {
      return {
        ...estado,
        fase: FASES.RETORNO,
        retorno: RETORNOS.ACERTO,
        resultados: [...estado.resultados, estado.tentativa],
      };
    }
    if (estado.tentativa < MAX_TENTATIVAS) {
      return {
        ...estado,
        fase: FASES.RETORNO,
        retorno: RETORNOS.ERRO,
        tentativa: estado.tentativa + 1,
      };
    }
    return { ...estado, fase: FASES.REVELANDO, resultados: [...estado.resultados, null] };
  }

  function avancar(estado) {
    if (estado.fase === FASES.REVELANDO) {
      return encerrarPergunta(estado);
    }
    if (estado.fase !== FASES.RETORNO) {
      return estado;
    }
    if (estado.retorno === RETORNOS.ACERTO) {
      return encerrarPergunta(estado);
    }
    return { ...estado, fase: FASES.PERGUNTA, retorno: null };
  }

  function carregarRecordes(estado, recordes) {
    return { ...estado, recordes: juntarRecordes(estado.recordes, normalizarRecordes(recordes)) };
  }

  function reduzir(estado, acao) {
    switch (acao?.tipo) {
      case ACOES.LIVRO:
        return pedirCodigo(estado);
      case ACOES.DIGITO:
        return digitar(estado, acao.digito);
      case ACOES.APAGAR:
        return apagar(estado);
      case ACOES.ENTER:
        return confirmar(estado);
      case ACOES.COR:
        return responder(estado, acao.cor);
      case ACOES.AVANCAR:
        return avancar(estado);
      case ACOES.RECORDES_CARREGADOS:
        return carregarRecordes(estado, acao.recordes);
      default:
        return estado;
    }
  }

  return { estadoInicial: ESTADO_INICIAL, reduzir };
}
