/**
 * Regras de pontuação do Pense Bem.
 *
 * Cada pergunta permite até 3 tentativas. Acertar na 1ª vale 3 pontos,
 * na 2ª vale 2, na 3ª vale 1 e errar as três vale 0.
 */

export const MAX_TENTATIVAS = 3;

const PONTOS_POR_TENTATIVA = Object.freeze({ 1: 3, 2: 2, 3: 1 });

/**
 * Calcula os pontos de uma pergunta.
 *
 * @param {number | null} tentativaDoAcerto Tentativa (1 a 3) em que o jogador acertou,
 *   ou `null` se ele errou as três.
 * @returns {number} 3, 2, 1 ou 0.
 * @throws {RangeError} Se o valor não for `null` nem um inteiro de 1 a 3.
 */
export function pontosDaPergunta(tentativaDoAcerto) {
  if (tentativaDoAcerto === null) {
    return 0;
  }
  if (
    !Number.isInteger(tentativaDoAcerto) ||
    tentativaDoAcerto < 1 ||
    tentativaDoAcerto > MAX_TENTATIVAS
  ) {
    throw new RangeError(
      `Tentativa inválida: ${String(tentativaDoAcerto)}. Use um inteiro de 1 a ${MAX_TENTATIVAS} ou null.`,
    );
  }
  return PONTOS_POR_TENTATIVA[tentativaDoAcerto];
}

/**
 * Soma os pontos de várias perguntas.
 *
 * @param {Array<number | null>} tentativasDosAcertos Uma posição por pergunta respondida,
 *   no mesmo formato aceito por {@link pontosDaPergunta}.
 * @returns {number} Total de pontos.
 * @throws {RangeError} Se alguma posição for inválida.
 */
export function totalDePontos(tentativasDosAcertos) {
  return tentativasDosAcertos.reduce((soma, tentativa) => soma + pontosDaPergunta(tentativa), 0);
}

/**
 * Pontuação máxima possível para uma quantidade de perguntas.
 *
 * @param {number} quantidadeDePerguntas Número de perguntas do programa.
 * @returns {number} Total de pontos se todas forem acertadas na 1ª tentativa.
 */
export function pontuacaoMaxima(quantidadeDePerguntas) {
  return quantidadeDePerguntas * PONTOS_POR_TENTATIVA[1];
}
