/**
 * Qual som tocar em cada mudança do aparelho.
 *
 * Função pura: compara o estado de antes com o de depois. O bipe de tecla não passa por aqui,
 * porque toca em todo toque, mude ou não o estado.
 */

import { FASES, RETORNOS } from './aparelho';

/** Nomes dos sons (iguais aos arquivos de `assets/sons/`). */
export const SONS = Object.freeze({
  TECLA: 'tecla',
  ACERTO: 'acerto',
  ERRO: 'erro',
  REVELADA: 'revelada',
  FIM: 'fim',
  RECORDE: 'recorde',
});

/**
 * Som de uma mudança de estado.
 *
 * @param {object} anterior Estado antes da ação.
 * @param {object} atual Estado depois da ação.
 * @returns {string | null} Um dos `SONS`, ou `null` quando a mudança não tem som próprio.
 */
export function somDaMudanca(anterior, atual) {
  if (anterior === atual || anterior.fase === atual.fase) {
    return null;
  }
  if (atual.fase === FASES.RETORNO) {
    return atual.retorno === RETORNOS.ACERTO ? SONS.ACERTO : SONS.ERRO;
  }
  if (atual.fase === FASES.REVELANDO) {
    return SONS.REVELADA;
  }
  if (atual.fase === FASES.RESULTADO) {
    return atual.novoRecorde ? SONS.RECORDE : SONS.FIM;
  }
  return null;
}
