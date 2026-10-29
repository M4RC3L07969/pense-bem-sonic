import { describe, expect, test } from '@jest/globals';

import { SEGMENTOS, segmentosDoCaractere } from '../src/components/sete-segmentos';

const ordenados = (caractere) => [...segmentosDoCaractere(caractere)].sort().join('');

describe('segmentosDoCaractere', () => {
  test.each([
    ['0', 'abcdef'],
    ['1', 'bc'],
    ['2', 'abdeg'],
    ['3', 'abcdg'],
    ['4', 'bcfg'],
    ['5', 'acdfg'],
    ['6', 'acdefg'],
    ['7', 'abc'],
    ['8', 'abcdefg'],
    ['9', 'abcdfg'],
    ['-', 'g'],
    [' ', ''],
  ])('o caractere "%s" acende %s', (caractere, esperado) => {
    expect(ordenados(caractere)).toBe(esperado);
  });

  test('as letras usadas no visor acendem só segmentos válidos', () => {
    for (const letra of ['E', 'r', 'o', 'P', 'L']) {
      const acesos = segmentosDoCaractere(letra);
      expect(acesos.size).toBeGreaterThan(0);
      for (const segmento of acesos) {
        expect(SEGMENTOS).toContain(segmento);
      }
    }
  });

  test('caractere desconhecido fica todo apagado', () => {
    expect(segmentosDoCaractere('?').size).toBe(0);
    expect(segmentosDoCaractere('').size).toBe(0);
  });
});
