import { describe, expect, it } from '@jest/globals';

import gabarito from '../src/data/gabarito.json';
import { PERGUNTAS_POR_PROGRAMA, validarGabarito, validarPrograma } from '../src/logic/gabarito';

describe('src/data/gabarito.json', () => {
  it('tem estrutura válida (aceitando programas ainda em digitação)', () => {
    expect(validarGabarito(gabarito, { exigirCompleto: false })).toEqual([]);
  });

  it('tem os programas 1 a 5 com códigos 021 a 025', () => {
    expect(gabarito.programas.map(({ numero, codigo }) => [numero, codigo])).toEqual([
      [1, '021'],
      [2, '022'],
      [3, '023'],
      [4, '024'],
      [5, '025'],
    ]);
  });

  it('numera as perguntas em sequência entre os programas', () => {
    gabarito.programas.forEach((programa, indice) => {
      expect(programa.primeiraPergunta).toBe(indice * PERGUNTAS_POR_PROGRAMA + 1);
    });
  });

  for (const programa of gabarito.programas) {
    const nome = `Programa ${programa.numero} (${programa.codigo})`;
    if (programa.perguntas.length < PERGUNTAS_POR_PROGRAMA) {
      it.todo(
        `${nome}: digitar gabarito (${programa.perguntas.length}/${PERGUNTAS_POR_PROGRAMA} perguntas)`,
      );
    } else {
      it(`${nome}: gabarito completo e válido`, () => {
        expect(validarPrograma(programa)).toEqual([]);
      });
    }
  }
});
