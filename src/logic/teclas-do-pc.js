/**
 * Teclas do teclado do computador que também comandam o aparelho (no navegador).
 */

import { ACOES } from './aparelho';

const TECLAS = Object.freeze({
  Enter: Object.freeze({ tipo: ACOES.ENTER }),
  Backspace: Object.freeze({ tipo: ACOES.APAGAR }),
  Escape: Object.freeze({ tipo: ACOES.LIVRO }),
});

/**
 * Ação do aparelho para uma tecla do computador.
 *
 * @param {{ key: string, ctrlKey?: boolean, metaKey?: boolean, altKey?: boolean }} evento
 *   O evento `keydown` do navegador (só esses campos são lidos).
 * @returns {{ tipo: string, digito?: number } | null} A ação, ou `null` se a tecla não comanda nada.
 */
export function acaoDaTeclaDoPc({ key, ctrlKey = false, metaKey = false, altKey = false }) {
  if (ctrlKey || metaKey || altKey) {
    return null;
  }
  if (/^[0-9]$/.test(key)) {
    return { tipo: ACOES.DIGITO, digito: Number(key) };
  }
  return TECLAS[key] ?? null;
}
