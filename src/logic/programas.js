/**
 * Programas do livro: os de perguntas próprias (021 a 025, vindos do gabarito) e a
 * avaliação geral (026), que sorteia perguntas de todos eles.
 */

import { PERGUNTAS_POR_PROGRAMA } from './gabarito';
import { sortearPerguntas } from './sorteio';

/** Código do Programa 6, a avaliação geral. */
export const CODIGO_AVALIACAO = '026';

/**
 * Lista os códigos que o aparelho aceita.
 *
 * @param {{ programas: { codigo: string }[] }} gabarito Conteúdo de `src/data/gabarito.json`.
 * @returns {string[]} Códigos do gabarito seguidos de {@link CODIGO_AVALIACAO}.
 */
export function codigosValidos(gabarito) {
  return [...gabarito.programas.map((programa) => programa.codigo), CODIGO_AVALIACAO];
}

/**
 * Monta as perguntas de um programa a partir do código digitado.
 *
 * No {@link CODIGO_AVALIACAO}, sorteia {@link PERGUNTAS_POR_PROGRAMA} perguntas entre todas as
 * do gabarito e as devolve em ordem crescente de número, para a pessoa folhear o livro para frente.
 *
 * @param {string} codigo Código de 3 dígitos.
 * @param {{ programas: { codigo: string, perguntas: { numero: number, resposta: string }[] }[] }} gabarito
 *   Conteúdo de `src/data/gabarito.json`.
 * @param {() => number} [aleatorio] Gerador de números em [0, 1), usado só no sorteio.
 * @returns {{ codigo: string, perguntas: { numero: number, resposta: string }[] } | null}
 *   O programa, ou `null` se o código não existir.
 */
export function montarPrograma(codigo, gabarito, aleatorio = Math.random) {
  if (codigo === CODIGO_AVALIACAO) {
    const todas = gabarito.programas.flatMap((programa) => programa.perguntas);
    const sorteadas = sortearPerguntas(todas, PERGUNTAS_POR_PROGRAMA, aleatorio);
    return {
      codigo,
      perguntas: sorteadas
        .map(({ numero, resposta }) => ({ numero, resposta }))
        .sort((a, b) => a.numero - b.numero),
    };
  }

  const programa = gabarito.programas.find((item) => item.codigo === codigo);
  if (!programa) {
    return null;
  }
  return {
    codigo,
    perguntas: programa.perguntas.map(({ numero, resposta }) => ({ numero, resposta })),
  };
}
