import { describe, expect, it } from '@jest/globals';

import { sortearPerguntas } from '../src/logic/sorteio';

const LISTA = Array.from({ length: 150 }, (_, indice) => indice + 1);

function geradorFixo(valores) {
  let i = 0;
  return () => valores[i++ % valores.length];
}

describe('sortearPerguntas', () => {
  it('devolve a quantidade pedida, sem repetição e só com itens da lista', () => {
    const sorteadas = sortearPerguntas(LISTA, 30);
    expect(sorteadas).toHaveLength(30);
    expect(new Set(sorteadas).size).toBe(30);
    expect(sorteadas.every((item) => LISTA.includes(item))).toBe(true);
  });

  it('não altera a lista recebida', () => {
    const lista = [1, 2, 3, 4, 5];
    sortearPerguntas(lista, 3);
    expect(lista).toEqual([1, 2, 3, 4, 5]);
  });

  it('é previsível com um gerador fixo', () => {
    expect(sortearPerguntas([1, 2, 3, 4, 5], 3, () => 0)).toEqual([1, 2, 3]);
    expect(sortearPerguntas([1, 2, 3, 4, 5], 2, () => 0.999)).toEqual([5, 1]);
    expect(sortearPerguntas([1, 2, 3, 4], 4, geradorFixo([0.5, 0, 0.9, 0]))).toEqual([3, 2, 4, 1]);
  });

  it('aceita quantidade 0 e quantidade igual ao tamanho da lista', () => {
    expect(sortearPerguntas(LISTA, 0)).toEqual([]);
    expect([...sortearPerguntas(LISTA, 150)].sort((a, b) => a - b)).toEqual(LISTA);
  });

  it('consegue sortear qualquer item da lista', () => {
    const vistos = new Set();
    for (let i = 0; i < 400; i += 1) {
      sortearPerguntas([1, 2, 3, 4, 5], 1).forEach((item) => vistos.add(item));
    }
    expect([...vistos].sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it.each([-1, 151, 1.5, NaN, '30', null])('rejeita quantidade inválida: %p', (quantidade) => {
    expect(() => sortearPerguntas(LISTA, quantidade)).toThrow(RangeError);
  });

  it('rejeita lista que não é lista e gerador que não é função', () => {
    expect(() => sortearPerguntas('abc', 1)).toThrow(TypeError);
    expect(() => sortearPerguntas(LISTA, 1, 0.5)).toThrow(TypeError);
  });

  it.each([1, -0.1, NaN, 2])('rejeita gerador que devolve %p', (valor) => {
    expect(() => sortearPerguntas(LISTA, 1, () => valor)).toThrow(RangeError);
  });
});
