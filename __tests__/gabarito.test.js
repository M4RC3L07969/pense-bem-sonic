import { describe, expect, it } from '@jest/globals';

import {
  ALTERNATIVAS,
  PERGUNTAS_POR_PROGRAMA,
  validarGabarito,
  validarPrograma,
} from '../src/logic/gabarito';

function criarPrograma({ numero = 1, codigo = '021', primeiraPergunta = 1, quantidade = 30 } = {}) {
  return {
    numero,
    codigo,
    primeiraPergunta,
    perguntas: Array.from({ length: quantidade }, (_, indice) => ({
      numero: primeiraPergunta + indice,
      resposta: ALTERNATIVAS[indice % ALTERNATIVAS.length],
    })),
  };
}

describe('validarPrograma', () => {
  it('aceita um programa completo e correto', () => {
    expect(validarPrograma(criarPrograma())).toEqual([]);
  });

  it('aceita programa que não começa na pergunta 1', () => {
    expect(
      validarPrograma(criarPrograma({ numero: 2, codigo: '022', primeiraPergunta: 31 })),
    ).toEqual([]);
  });

  it(`exige ${PERGUNTAS_POR_PROGRAMA} perguntas por padrão`, () => {
    expect(validarPrograma(criarPrograma({ quantidade: 29 }))).toEqual([
      'tem 29 perguntas (esperado 30)',
    ]);
  });

  it('aceita programa incompleto quando exigirCompleto é false', () => {
    expect(validarPrograma(criarPrograma({ quantidade: 5 }), { exigirCompleto: false })).toEqual(
      [],
    );
    expect(validarPrograma(criarPrograma({ quantidade: 0 }), { exigirCompleto: false })).toEqual(
      [],
    );
  });

  it('rejeita mais de 30 perguntas mesmo sem exigir completo', () => {
    expect(validarPrograma(criarPrograma({ quantidade: 31 }), { exigirCompleto: false })).toEqual([
      'tem 31 perguntas (máximo 30)',
    ]);
  });

  it.each(['E', 'a', '', null, undefined, 1])('rejeita resposta inválida: %p', (resposta) => {
    const programa = criarPrograma();
    programa.perguntas[0].resposta = resposta;
    expect(validarPrograma(programa)).toHaveLength(1);
    expect(validarPrograma(programa)[0]).toMatch(/^pergunta 1: resposta/);
  });

  it('detecta pergunta fora de ordem', () => {
    const programa = criarPrograma();
    programa.perguntas[4].numero = 99;
    expect(validarPrograma(programa)).toEqual(['pergunta 5: número 99 fora de ordem (esperado 5)']);
  });

  it('detecta pergunta duplicada (que também sai da ordem)', () => {
    const programa = criarPrograma();
    programa.perguntas[1].numero = 1;
    expect(validarPrograma(programa)).toEqual(['pergunta 2: número 1 fora de ordem (esperado 2)']);
  });

  it.each(['21', '0210', 'abc', 21, undefined])('rejeita código inválido: %p', (codigo) => {
    const programa = { ...criarPrograma(), codigo };
    expect(validarPrograma(programa)).toEqual([
      `código inválido: ${String(codigo)} (use 3 dígitos, ex.: "021")`,
    ]);
  });

  it('rejeita número de programa inválido', () => {
    expect(validarPrograma(criarPrograma({ numero: 0 }))).toEqual([
      'número do programa inválido: 0',
    ]);
  });

  it('rejeita "perguntas" que não é lista', () => {
    expect(
      validarPrograma({ numero: 1, codigo: '021', primeiraPergunta: 1, perguntas: {} }),
    ).toEqual(['"perguntas" precisa ser uma lista']);
  });

  it('rejeita entradas que não são objeto', () => {
    expect(validarPrograma(null)).toEqual(['programa não é um objeto']);
    const programa = criarPrograma();
    programa.perguntas[0] = 'A';
    expect(validarPrograma(programa)).toEqual(['pergunta 1: não é um objeto']);
  });

  describe('campos opcionais', () => {
    it('aceita enunciado e alternativas preenchidos', () => {
      const programa = criarPrograma();
      programa.perguntas[0].enunciado = 'Qual é a cor do Sonic?';
      programa.perguntas[0].alternativas = { A: 'Azul', B: 'Vermelho', C: 'Verde', D: 'Amarelo' };
      expect(validarPrograma(programa)).toEqual([]);
    });

    it('rejeita enunciado vazio', () => {
      const programa = criarPrograma();
      programa.perguntas[0].enunciado = '   ';
      expect(validarPrograma(programa)).toEqual(['pergunta 1: enunciado vazio']);
    });

    it('rejeita alternativas sem as quatro letras', () => {
      const programa = criarPrograma();
      programa.perguntas[0].alternativas = { A: 'x', B: 'y', C: 'z' };
      expect(validarPrograma(programa)).toEqual([
        'pergunta 1: "alternativas" precisa ter exatamente as chaves A, B, C e D',
      ]);
    });

    it('rejeita alternativa vazia', () => {
      const programa = criarPrograma();
      programa.perguntas[0].alternativas = { A: 'x', B: '', C: 'z', D: 'w' };
      expect(validarPrograma(programa)).toEqual(['pergunta 1: alternativa B vazia']);
    });

    it('rejeita alternativas que não são objeto', () => {
      const programa = criarPrograma();
      programa.perguntas[0].alternativas = ['x', 'y', 'z', 'w'];
      expect(validarPrograma(programa)).toEqual([
        'pergunta 1: "alternativas" precisa ser um objeto com as chaves A, B, C e D',
      ]);
    });
  });
});

describe('validarGabarito', () => {
  it('aceita programas distintos e corretos', () => {
    const gabarito = {
      programas: [
        criarPrograma(),
        criarPrograma({ numero: 2, codigo: '022', primeiraPergunta: 31 }),
      ],
    };
    expect(validarGabarito(gabarito)).toEqual([]);
  });

  it('detecta número e código repetidos', () => {
    const gabarito = { programas: [criarPrograma(), criarPrograma()] };
    expect(validarGabarito(gabarito)).toEqual([
      'Programa 1: número repetido',
      'Programa 1: código 021 repetido',
    ]);
  });

  it('prefixa os erros com o programa', () => {
    const gabarito = { programas: [criarPrograma({ quantidade: 2 })] };
    expect(validarGabarito(gabarito)).toEqual(['Programa 1: tem 2 perguntas (esperado 30)']);
  });

  it('rejeita gabarito sem lista de programas', () => {
    expect(validarGabarito({})).toEqual(['gabarito precisa ter a lista "programas"']);
    expect(validarGabarito(null)).toEqual(['gabarito precisa ter a lista "programas"']);
  });
});
