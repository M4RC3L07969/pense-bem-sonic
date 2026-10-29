import { describe, expect, it } from '@jest/globals';

import gabarito from '../src/data/gabarito.json';
import {
  CORES,
  PERGUNTAS_POR_PROGRAMA,
  validarGabarito,
  validarPrograma,
} from '../src/logic/gabarito';

describe('src/data/gabarito.json', () => {
  it('está completo e válido', () => {
    expect(validarGabarito(gabarito)).toEqual([]);
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

  it('tem as 150 perguntas do livro, de 1 a 150', () => {
    const numeros = gabarito.programas.flatMap((programa) =>
      programa.perguntas.map((p) => p.numero),
    );
    expect(numeros).toEqual(Array.from({ length: 150 }, (_, indice) => indice + 1));
  });

  it.each(gabarito.programas.map((programa) => [programa.codigo, programa]))(
    'programa %s: 30 respostas válidas',
    (_, programa) => {
      expect(validarPrograma(programa)).toEqual([]);
      expect(programa.perguntas.every((pergunta) => CORES.includes(pergunta.resposta))).toBe(true);
    },
  );
});
