import { describe, expect, test } from '@jest/globals';

import { CORES } from '../src/logic/gabarito';
import { TEMA } from '../src/theme';
import { contraste } from '../src/theme/contraste';
import { FONTES } from '../src/theme/fontes';

const TEXTO_PEQUENO = 4.5;
const DIGITO_GRANDE = 3;
const { cores } = TEMA;

const PARES_DE_TEXTO = [
  ['título', cores.carcacaTexto, cores.carcaca],
  ['subtítulo', cores.carcacaTextoSuave, cores.carcaca],
  ['legenda do visor', cores.visorTexto, cores.visorFundo],
  ['tecla de número', cores.teclaTexto, cores.tecla],
  ['tecla de função', cores.teclaFuncaoTexto, cores.teclaFuncao],
  ['tecla de confirmar', cores.teclaConfirmarTexto, cores.teclaConfirmar],
  ['aviso de acerto', cores.sinalTexto, cores.acerto],
  ['aviso de erro', cores.sinalTexto, cores.erro],
  ['aviso de recorde', cores.teclaConfirmarTexto, cores.detalhe],
  ...CORES.map((cor) => [`tecla ${cor}`, cores.respostaTexto[cor], cores.resposta[cor]]),
];

describe('tema', () => {
  test('tem as 4 cores de resposta, com fundo e texto', () => {
    expect(Object.keys(cores.resposta).sort()).toEqual([...CORES].sort());
    expect(Object.keys(cores.respostaTexto).sort()).toEqual([...CORES].sort());
  });

  test.each(PARES_DE_TEXTO)('%s tem contraste de texto pequeno', (_, texto, fundo) => {
    expect(contraste(texto, fundo)).toBeGreaterThanOrEqual(TEXTO_PEQUENO);
  });

  test('os dígitos acesos se destacam no visor', () => {
    expect(contraste(cores.visorAceso, cores.visorFundo)).toBeGreaterThanOrEqual(DIGITO_GRANDE);
    expect(contraste(cores.visorAceso, cores.visorApagado)).toBeGreaterThanOrEqual(DIGITO_GRANDE);
  });

  test('usa só fontes carregadas pelo app', () => {
    for (const fonte of Object.values(TEMA.fontes)) {
      expect(Object.keys(FONTES)).toContain(fonte);
    }
  });

  test('não pode ser alterado sem querer', () => {
    expect(Object.isFrozen(TEMA)).toBe(true);
    expect(Object.isFrozen(TEMA.cores.resposta)).toBe(true);
  });
});
