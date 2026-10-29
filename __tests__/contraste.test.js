import { describe, expect, test } from '@jest/globals';

import { contraste, luminancia } from '../src/theme/contraste';

describe('luminancia', () => {
  test('preto é 0 e branco é 1', () => {
    expect(luminancia('#000000')).toBe(0);
    expect(luminancia('#FFFFFF')).toBe(1);
  });

  test('aceita letras minúsculas', () => {
    expect(luminancia('#ffffff')).toBe(1);
  });

  test('recusa cor fora do formato #rrggbb', () => {
    expect(() => luminancia('vermelho')).toThrow(TypeError);
    expect(() => luminancia('#FFF')).toThrow(TypeError);
  });
});

describe('contraste', () => {
  test('preto com branco dá 21', () => {
    expect(contraste('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
  });

  test('a ordem das cores não importa', () => {
    expect(contraste('#FFFFFF', '#0F6FD6')).toBeCloseTo(contraste('#0F6FD6', '#FFFFFF'), 10);
  });

  test('uma cor com ela mesma dá 1', () => {
    expect(contraste('#777777', '#777777')).toBe(1);
  });

  test('bate com um valor conhecido (cinza #777777 no branco ≈ 4,48)', () => {
    expect(contraste('#777777', '#FFFFFF')).toBeCloseTo(4.48, 2);
  });
});
