/**
 * Sorteio de perguntas (usado pelo Programa 6, a avaliação geral).
 */

/**
 * Escolhe itens de uma lista, sem repetição e com a mesma chance para qualquer combinação
 * (embaralhamento de Fisher-Yates feito só até a quantidade pedida).
 *
 * @template T
 * @param {T[]} itens Lista de onde sortear. Não é alterada.
 * @param {number} quantidade Quantos itens sortear (inteiro de 0 até o tamanho da lista).
 * @param {() => number} [aleatorio] Gerador de números em [0, 1). Padrão: `Math.random`.
 * @returns {T[]} Os itens sorteados, na ordem do sorteio.
 * @throws {TypeError} Se `itens` não for uma lista ou `aleatorio` não for uma função.
 * @throws {RangeError} Se `quantidade` for inválida ou maior que a lista, ou se `aleatorio`
 *   devolver um valor fora de [0, 1).
 */
export function sortearPerguntas(itens, quantidade, aleatorio = Math.random) {
  if (!Array.isArray(itens)) {
    throw new TypeError('itens precisa ser uma lista');
  }
  if (typeof aleatorio !== 'function') {
    throw new TypeError('aleatorio precisa ser uma função');
  }
  if (!Number.isInteger(quantidade) || quantidade < 0 || quantidade > itens.length) {
    throw new RangeError(
      `quantidade inválida: ${String(quantidade)} (use um inteiro de 0 a ${itens.length})`,
    );
  }

  const copia = [...itens];
  for (let i = 0; i < quantidade; i += 1) {
    const sorteado = aleatorio();
    if (!(sorteado >= 0 && sorteado < 1)) {
      throw new RangeError(`aleatorio devolveu ${String(sorteado)} (esperado um número em [0, 1))`);
    }
    const j = i + Math.floor(sorteado * (copia.length - i));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia.slice(0, quantidade);
}
