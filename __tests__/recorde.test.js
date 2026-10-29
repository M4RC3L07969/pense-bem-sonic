import { describe, expect, it } from '@jest/globals';

import { atualizarRecorde, normalizarRecordes } from '../src/logic/recorde';

describe('atualizarRecorde', () => {
  it('a primeira partida de um programa é sempre recorde', () => {
    expect(atualizarRecorde({}, '021', 50)).toEqual({
      recordes: { '021': 50 },
      novoRecorde: true,
    });
  });

  it('sobe quando a partida supera o recorde', () => {
    expect(atualizarRecorde({ '021': 50 }, '021', 51)).toEqual({
      recordes: { '021': 51 },
      novoRecorde: true,
    });
  });

  it('não muda quando empata ou fica abaixo', () => {
    const recordes = { '021': 50 };
    expect(atualizarRecorde(recordes, '021', 50)).toEqual({ recordes, novoRecorde: false });
    expect(atualizarRecorde(recordes, '021', 10)).toEqual({ recordes, novoRecorde: false });
  });

  it('não mexe nos recordes de outros programas', () => {
    expect(atualizarRecorde({ '022': 90 }, '021', 30).recordes).toEqual({ '021': 30, '022': 90 });
  });

  it('não altera o objeto recebido', () => {
    const recordes = { '021': 50 };
    atualizarRecorde(recordes, '021', 80);
    expect(recordes).toEqual({ '021': 50 });
  });

  it('aceita os limites 0 e 90', () => {
    expect(atualizarRecorde({}, '026', 0).recordes).toEqual({ '026': 0 });
    expect(atualizarRecorde({}, '026', 90).recordes).toEqual({ '026': 90 });
  });

  it.each([-1, 91, 1.5, NaN, '50', null])('rejeita pontuação inválida: %p', (pontos) => {
    expect(() => atualizarRecorde({}, '021', pontos)).toThrow(RangeError);
  });
});

describe('normalizarRecordes', () => {
  it('mantém recordes válidos', () => {
    expect(normalizarRecordes({ '021': 72, '026': 0 })).toEqual({ '021': 72, '026': 0 });
  });

  it('descarta entradas inválidas e mantém as boas', () => {
    expect(
      normalizarRecordes({
        '021': 72,
        '022': -1,
        '023': 91,
        '024': 10.5,
        '025': '40',
        abc: 10,
        21: 10,
        '0210': 10,
      }),
    ).toEqual({ '021': 72 });
  });

  it.each([null, undefined, 'texto', 42, [], [['021', 10]], true])(
    'devolve {} para valor que não é objeto: %p',
    (valor) => {
      expect(normalizarRecordes(valor)).toEqual({});
    },
  );
});
