import { describe, expect, it } from '@jest/globals';

import gabarito from '../src/data/gabarito.json';
import { CORES } from '../src/logic/gabarito';
import { CODIGO_AVALIACAO, codigosValidos, montarPrograma } from '../src/logic/programas';

describe('codigosValidos', () => {
  it('tem os 5 programas do livro e a avaliação geral', () => {
    expect(codigosValidos(gabarito)).toEqual(['021', '022', '023', '024', '025', '026']);
    expect(CODIGO_AVALIACAO).toBe('026');
  });
});

describe('montarPrograma', () => {
  it.each(gabarito.programas.map((programa) => [programa.codigo, programa]))(
    'programa %s vem igual ao gabarito',
    (codigo, programa) => {
      expect(montarPrograma(codigo, gabarito)).toEqual({
        codigo,
        perguntas: programa.perguntas,
      });
    },
  );

  it('não devolve a mesma lista do gabarito (alterar o programa não altera o gabarito)', () => {
    const programa = montarPrograma('021', gabarito);
    programa.perguntas[0].resposta = 'roxo';
    expect(gabarito.programas[0].perguntas[0].resposta).not.toBe('roxo');
  });

  it('026 sorteia 30 perguntas distintas, das 150, em ordem crescente', () => {
    for (let vez = 0; vez < 20; vez += 1) {
      const { codigo, perguntas } = montarPrograma('026', gabarito);
      const numeros = perguntas.map((pergunta) => pergunta.numero);
      expect(codigo).toBe('026');
      expect(perguntas).toHaveLength(30);
      expect(new Set(numeros).size).toBe(30);
      expect(numeros.every((numero) => numero >= 1 && numero <= 150)).toBe(true);
      expect(numeros).toEqual([...numeros].sort((a, b) => a - b));
    }
  });

  it('026 mantém a resposta certa de cada pergunta sorteada', () => {
    const respostaDe = new Map(
      gabarito.programas.flatMap((programa) =>
        programa.perguntas.map((pergunta) => [pergunta.numero, pergunta.resposta]),
      ),
    );
    const { perguntas } = montarPrograma('026', gabarito);
    perguntas.forEach((pergunta) => {
      expect(CORES).toContain(pergunta.resposta);
      expect(pergunta.resposta).toBe(respostaDe.get(pergunta.numero));
    });
  });

  it('026 com gerador fixo sempre pega as mesmas perguntas', () => {
    const primeira = montarPrograma('026', gabarito, () => 0);
    const segunda = montarPrograma('026', gabarito, () => 0);
    expect(primeira).toEqual(segunda);
    expect(primeira.perguntas.map((p) => p.numero)).toEqual(
      Array.from({ length: 30 }, (_, i) => i + 1),
    );
  });

  it.each(['000', '020', '027', '21', '0210', 'abc', '', null, undefined])(
    'código inexistente devolve null: %p',
    (codigo) => {
      expect(montarPrograma(codigo, gabarito)).toBeNull();
    },
  );
});
