import { describe, expect, it } from '@jest/globals';

import {
  MAX_TENTATIVAS,
  pontosDaPergunta,
  pontuacaoMaxima,
  totalDePontos,
} from '../src/logic/pontuacao';

describe('pontosDaPergunta', () => {
  it.each([
    [1, 3],
    [2, 2],
    [3, 1],
  ])('acerto na tentativa %i vale %i pontos', (tentativa, pontos) => {
    expect(pontosDaPergunta(tentativa)).toBe(pontos);
  });

  it('errar as três tentativas vale 0 pontos', () => {
    expect(pontosDaPergunta(null)).toBe(0);
  });

  it('permite no máximo 3 tentativas', () => {
    expect(MAX_TENTATIVAS).toBe(3);
  });

  it.each([0, 4, -1, 1.5, NaN, Infinity, undefined, '1', [1], {}])(
    'rejeita tentativa inválida: %p',
    (tentativa) => {
      expect(() => pontosDaPergunta(tentativa)).toThrow(RangeError);
    },
  );
});

describe('totalDePontos', () => {
  it('lista vazia soma 0', () => {
    expect(totalDePontos([])).toBe(0);
  });

  it('soma acertos e erros misturados', () => {
    expect(totalDePontos([1, 2, 3, null, 1])).toBe(3 + 2 + 1 + 0 + 3);
  });

  it('30 acertos de primeira somam 90', () => {
    expect(totalDePontos(Array(30).fill(1))).toBe(90);
  });

  it('30 erros somam 0', () => {
    expect(totalDePontos(Array(30).fill(null))).toBe(0);
  });

  it('falha se alguma tentativa for inválida', () => {
    expect(() => totalDePontos([1, 5])).toThrow(RangeError);
  });
});

describe('pontuacaoMaxima', () => {
  it('é 3 pontos por pergunta', () => {
    expect(pontuacaoMaxima(30)).toBe(90);
    expect(pontuacaoMaxima(0)).toBe(0);
  });
});
