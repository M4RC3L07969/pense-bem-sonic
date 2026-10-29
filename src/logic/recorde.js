/**
 * Recorde (melhor pontuação) de cada programa.
 *
 * Formato: `{ "021": 72, "026": 54 }` — código do programa → maior total já feito.
 */

import { PERGUNTAS_POR_PROGRAMA } from './gabarito';
import { pontuacaoMaxima } from './pontuacao';

const FORMATO_DO_CODIGO = /^\d{3}$/;
const MAXIMO = pontuacaoMaxima(PERGUNTAS_POR_PROGRAMA);

function ehPontuacaoValida(valor) {
  return Number.isInteger(valor) && valor >= 0 && valor <= MAXIMO;
}

/**
 * Limpa recordes vindos de fora (do armazenamento do celular), descartando o que não fizer sentido.
 *
 * @param {unknown} valor Qualquer coisa lida do armazenamento.
 * @returns {Record<string, number>} Só as entradas com código de 3 dígitos e pontuação
 *   inteira de 0 a 90; `{}` se `valor` não for um objeto.
 */
export function normalizarRecordes(valor) {
  if (typeof valor !== 'object' || valor === null || Array.isArray(valor)) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(valor).filter(
      ([codigo, pontos]) => FORMATO_DO_CODIGO.test(codigo) && ehPontuacaoValida(pontos),
    ),
  );
}

/**
 * Registra o total de uma partida, subindo o recorde do programa se for o caso.
 *
 * @param {Record<string, number>} recordes Recordes atuais. Não são alterados.
 * @param {string} codigo Código do programa jogado.
 * @param {number} pontos Total da partida (inteiro de 0 a 90).
 * @returns {{ recordes: Record<string, number>, novoRecorde: boolean }} Os recordes atualizados e
 *   se a partida superou o recorde anterior (a primeira partida de um programa sempre conta).
 * @throws {RangeError} Se `pontos` não for um inteiro de 0 a 90.
 */
export function atualizarRecorde(recordes, codigo, pontos) {
  if (!ehPontuacaoValida(pontos)) {
    throw new RangeError(`pontuação inválida: ${String(pontos)} (use um inteiro de 0 a ${MAXIMO})`);
  }
  const anterior = recordes[codigo];
  if (anterior !== undefined && anterior >= pontos) {
    return { recordes, novoRecorde: false };
  }
  return { recordes: { ...recordes, [codigo]: pontos }, novoRecorde: true };
}
