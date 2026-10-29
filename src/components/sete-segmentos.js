/**
 * Mapa dos dígitos de 7 segmentos, como num visor de calculadora.
 *
 * Segmentos: `a` em cima, `b` em cima à direita, `c` embaixo à direita, `d` embaixo,
 * `e` embaixo à esquerda, `f` em cima à esquerda e `g` no meio.
 */

/** Os 7 segmentos, na ordem a–g. */
export const SEGMENTOS = Object.freeze(['a', 'b', 'c', 'd', 'e', 'f', 'g']);

const ACESOS = Object.freeze({
  0: 'abcdef',
  1: 'bc',
  2: 'abdeg',
  3: 'abcdg',
  4: 'bcfg',
  5: 'acdfg',
  6: 'acdefg',
  7: 'abc',
  8: 'abcdefg',
  9: 'abcdfg',
  '-': 'g',
  ' ': '',
  A: 'abcefg',
  C: 'adef',
  E: 'adefg',
  F: 'aefg',
  H: 'bcefg',
  L: 'def',
  P: 'abefg',
  U: 'bcdef',
  b: 'cdefg',
  c: 'deg',
  d: 'bcdeg',
  n: 'ceg',
  o: 'cdeg',
  r: 'eg',
  t: 'defg',
});

/**
 * Quais segmentos acendem para um caractere.
 *
 * @param {string} caractere Um dígito, `-`, espaço ou uma das letras do mapa.
 * @returns {Set<string>} Os segmentos acesos; vazio para caractere desconhecido.
 */
export function segmentosDoCaractere(caractere) {
  return new Set(ACESOS[caractere] ?? '');
}
