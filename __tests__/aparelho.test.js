import { beforeEach, describe, expect, it } from '@jest/globals';

import gabarito from '../src/data/gabarito.json';
import {
  ACOES,
  ERROS_DE_CODIGO,
  FASES,
  RETORNOS,
  corCerta,
  criarAparelho,
  perguntaAtual,
  pontosAteAgora,
  totalFinal,
} from '../src/logic/aparelho';
import { CORES } from '../src/logic/gabarito';
import { totalDePontos } from '../src/logic/pontuacao';

const livro = { tipo: ACOES.LIVRO };
const enter = { tipo: ACOES.ENTER };
const apagar = { tipo: ACOES.APAGAR };
const avancar = { tipo: ACOES.AVANCAR };
const digito = (valor) => ({ tipo: ACOES.DIGITO, digito: valor });
const cor = (valor) => ({ tipo: ACOES.COR, cor: valor });

let reduzir;
let estadoInicial;

function reduzirSemAlterar(estado, acao) {
  const antes = JSON.parse(JSON.stringify(estado));
  const novo = reduzir(estado, acao);
  expect(estado).toEqual(antes);
  return novo;
}

function aplicar(estado, ...acoes) {
  return acoes.reduce(reduzirSemAlterar, estado);
}

function digitarCodigo(estado, codigo) {
  return aplicar(estado, livro, ...[...codigo].map((c) => digito(Number(c))), enter);
}

function corErrada(estado) {
  return CORES.find((c) => c !== corCerta(estado));
}

function responderNaTentativa(estado, tentativa) {
  let atual = estado;
  for (let i = 1; i < tentativa; i += 1) {
    atual = aplicar(atual, cor(corErrada(atual)), avancar);
  }
  return aplicar(atual, cor(corCerta(atual)), avancar);
}

function errarTudo(estado) {
  let atual = estado;
  for (let i = 1; i <= 3; i += 1) {
    atual = aplicar(atual, cor(corErrada(atual)), avancar);
  }
  return atual;
}

function jogarPrograma(codigo, tentativas, estado = estadoInicial) {
  let atual = digitarCodigo(estado, codigo);
  tentativas.forEach((tentativa) => {
    atual = tentativa === null ? errarTudo(atual) : responderNaTentativa(atual, tentativa);
  });
  return atual;
}

beforeEach(() => {
  ({ reduzir, estadoInicial } = criarAparelho({ gabarito }));
});

describe('ligar e digitar o código', () => {
  it('começa na fase inicio e só reage ao LIVRO', () => {
    expect(estadoInicial.fase).toBe(FASES.INICIO);
    [enter, apagar, avancar, digito(1), cor('azul')].forEach((acao) => {
      expect(reduzir(estadoInicial, acao)).toBe(estadoInicial);
    });
    expect(reduzir(estadoInicial, livro).fase).toBe(FASES.CODIGO);
  });

  it('junta os dígitos e ignora o 4º', () => {
    const estado = aplicar(estadoInicial, livro, digito(0), digito(2), digito(1));
    expect(estado.digitos).toBe('021');
    expect(reduzir(estado, digito(5))).toBe(estado);
  });

  it('ignora dígitos inválidos', () => {
    const estado = aplicar(estadoInicial, livro);
    [10, -1, 1.5, '1', null, undefined].forEach((valor) => {
      expect(reduzir(estado, digito(valor))).toBe(estado);
    });
  });

  it('APAGAR tira o último dígito e não faz nada sem dígitos', () => {
    const estado = aplicar(estadoInicial, livro, digito(0), digito(2), apagar);
    expect(estado.digitos).toBe('0');
    const vazio = aplicar(estado, apagar);
    expect(vazio.digitos).toBe('');
    expect(reduzir(vazio, apagar)).toBe(vazio);
  });

  it('ENTER com menos de 3 dígitos avisa que está incompleto e mantém os dígitos', () => {
    const estado = aplicar(estadoInicial, livro, digito(0), digito(2), enter);
    expect(estado.fase).toBe(FASES.CODIGO);
    expect(estado.erroCodigo).toBe(ERROS_DE_CODIGO.INCOMPLETO);
    expect(estado.digitos).toBe('02');
    expect(reduzir(estado, enter)).toBe(estado);
    expect(aplicar(estado, digito(1)).erroCodigo).toBeNull();
  });

  it.each(['000', '020', '027', '999'])('código %s é inválido e limpa o visor', (codigo) => {
    const estado = digitarCodigo(estadoInicial, codigo);
    expect(estado.fase).toBe(FASES.CODIGO);
    expect(estado.erroCodigo).toBe(ERROS_DE_CODIGO.INVALIDO);
    expect(estado.digitos).toBe('');
  });

  it('APAGAR depois de um erro apaga a mensagem de erro', () => {
    const estado = digitarCodigo(estadoInicial, '999');
    expect(aplicar(estado, apagar).erroCodigo).toBeNull();
  });

  it.each(['021', '022', '023', '024', '025', '026'])(
    'código %s abre a primeira pergunta',
    (codigo) => {
      const estado = digitarCodigo(estadoInicial, codigo);
      expect(estado.fase).toBe(FASES.PERGUNTA);
      expect(estado.programa.codigo).toBe(codigo);
      expect(estado.programa.perguntas).toHaveLength(30);
      expect(estado.indice).toBe(0);
      expect(estado.tentativa).toBe(1);
    },
  );

  it('programa 021 começa na pergunta 1 e o 025 na 121', () => {
    expect(perguntaAtual(digitarCodigo(estadoInicial, '021')).numero).toBe(1);
    expect(perguntaAtual(digitarCodigo(estadoInicial, '025')).numero).toBe(121);
  });
});

describe('responder', () => {
  let noPrograma;

  beforeEach(() => {
    noPrograma = digitarCodigo(estadoInicial, '021');
  });

  it('acerto na 1ª tentativa vale 3 pontos e avisa o acerto', () => {
    const estado = aplicar(noPrograma, cor(corCerta(noPrograma)));
    expect(estado.fase).toBe(FASES.RETORNO);
    expect(estado.retorno).toBe(RETORNOS.ACERTO);
    expect(pontosAteAgora(estado)).toBe(3);
    const seguinte = aplicar(estado, avancar);
    expect(seguinte.fase).toBe(FASES.PERGUNTA);
    expect(perguntaAtual(seguinte).numero).toBe(2);
    expect(seguinte.tentativa).toBe(1);
  });

  it('erro avisa e volta para a mesma pergunta na tentativa seguinte', () => {
    const estado = aplicar(noPrograma, cor(corErrada(noPrograma)));
    expect(estado.fase).toBe(FASES.RETORNO);
    expect(estado.retorno).toBe(RETORNOS.ERRO);
    expect(estado.tentativa).toBe(2);
    const deNovo = aplicar(estado, avancar);
    expect(deNovo.fase).toBe(FASES.PERGUNTA);
    expect(perguntaAtual(deNovo).numero).toBe(1);
    expect(pontosAteAgora(deNovo)).toBe(0);
  });

  it.each([
    [2, 2],
    [3, 1],
  ])('acerto na %iª tentativa vale %i pontos', (tentativa, pontos) => {
    expect(pontosAteAgora(responderNaTentativa(noPrograma, tentativa))).toBe(pontos);
  });

  it('depois de 3 erros revela a cor certa, vale 0 e passa para a próxima', () => {
    let estado = aplicar(noPrograma, cor(corErrada(noPrograma)), avancar);
    estado = aplicar(estado, cor(corErrada(estado)), avancar);
    const certa = corCerta(estado);
    estado = aplicar(estado, cor(corErrada(estado)));
    expect(estado.fase).toBe(FASES.REVELANDO);
    expect(corCerta(estado)).toBe(certa);
    expect(estado.resultados).toEqual([null]);
    const seguinte = aplicar(estado, avancar);
    expect(perguntaAtual(seguinte).numero).toBe(2);
    expect(pontosAteAgora(seguinte)).toBe(0);
  });

  it('teclas sem efeito na fase errada não mudam o estado', () => {
    [digito(1), apagar, enter, avancar, cor('roxo'), { tipo: 'XYZ' }, null].forEach((acao) => {
      expect(reduzir(noPrograma, acao)).toBe(noPrograma);
    });
    const retorno = aplicar(noPrograma, cor(corCerta(noPrograma)));
    [cor('azul'), digito(1), enter, apagar].forEach((acao) => {
      expect(reduzir(retorno, acao)).toBe(retorno);
    });
  });

  it('LIVRO no meio do jogo recomeça pedindo o código', () => {
    const estado = aplicar(responderNaTentativa(noPrograma, 1), livro);
    expect(estado.fase).toBe(FASES.CODIGO);
    expect(estado.digitos).toBe('');
    expect(estado.programa).toBeNull();
    expect(estado.resultados).toEqual([]);
  });
});

describe('jogo completo', () => {
  it('tudo na 1ª tentativa = 90 pontos', () => {
    const fim = jogarPrograma('021', Array(30).fill(1));
    expect(fim.fase).toBe(FASES.RESULTADO);
    expect(totalFinal(fim)).toBe(90);
  });

  it('tudo errado = 0 pontos', () => {
    expect(totalFinal(jogarPrograma('022', Array(30).fill(null)))).toBe(0);
  });

  it('jogo misto bate com totalDePontos', () => {
    const tentativas = Array.from({ length: 30 }, (_, i) => [1, 2, 3, null][i % 4]);
    const fim = jogarPrograma('023', tentativas);
    expect(fim.resultados).toEqual(tentativas);
    expect(totalFinal(fim)).toBe(totalDePontos(tentativas));
  });

  it('totalFinal só existe no resultado', () => {
    expect(totalFinal(digitarCodigo(estadoInicial, '021'))).toBeNull();
  });

  it('programa 026 é jogável até o fim, em ordem crescente', () => {
    let estado = digitarCodigo(estadoInicial, '026');
    const numeros = [];
    for (let i = 0; i < 30; i += 1) {
      numeros.push(perguntaAtual(estado).numero);
      estado = responderNaTentativa(estado, 1);
    }
    expect(numeros).toEqual([...numeros].sort((a, b) => a - b));
    expect(totalFinal(estado)).toBe(90);
  });

  it('no resultado, ENTER repete o mesmo programa e LIVRO pede outro código', () => {
    const fim = jogarPrograma('024', Array(30).fill(2));
    const repetido = aplicar(fim, enter);
    expect(repetido.fase).toBe(FASES.PERGUNTA);
    expect(repetido.programa.codigo).toBe('024');
    expect(repetido.resultados).toEqual([]);
    expect(aplicar(fim, livro).fase).toBe(FASES.CODIGO);
  });

  it('ENTER no resultado do 026 faz um sorteio novo', () => {
    let chamada = 0;
    const sequencias = [() => 0, () => 0.999];
    ({ reduzir, estadoInicial } = criarAparelho({
      gabarito,
      aleatorio: () => sequencias[Math.min(chamada, 1)](),
    }));
    let estado = digitarCodigo(estadoInicial, '026');
    const primeiro = estado.programa.perguntas.map((p) => p.numero);
    for (let i = 0; i < 30; i += 1) estado = responderNaTentativa(estado, 1);
    chamada = 1;
    const segundo = aplicar(estado, enter).programa.perguntas.map((p) => p.numero);
    expect(segundo).not.toEqual(primeiro);
  });
});

describe('recorde', () => {
  it('a primeira partida vira recorde', () => {
    const fim = jogarPrograma('021', Array(30).fill(2));
    expect(fim.recordes).toEqual({ '021': 60 });
    expect(fim.novoRecorde).toBe(true);
  });

  it('só é novo recorde quando supera o anterior', () => {
    const primeira = jogarPrograma('021', Array(30).fill(2));
    const pior = jogarPrograma('021', Array(30).fill(3), aplicar(primeira, livro));
    expect(pior.recordes).toEqual({ '021': 60 });
    expect(pior.novoRecorde).toBe(false);
    const melhor = jogarPrograma('021', Array(30).fill(1), aplicar(pior, livro));
    expect(melhor.recordes).toEqual({ '021': 90 });
    expect(melhor.novoRecorde).toBe(true);
  });

  it('os recordes sobrevivem ao LIVRO e ao ENTER', () => {
    const fim = jogarPrograma('021', Array(30).fill(1));
    expect(aplicar(fim, livro).recordes).toEqual({ '021': 90 });
    expect(aplicar(fim, enter).recordes).toEqual({ '021': 90 });
  });

  it('RECORDES_CARREGADOS guarda os recordes limpos e mantém o maior de cada programa', () => {
    const fim = jogarPrograma('021', Array(30).fill(1));
    const estado = aplicar(fim, {
      tipo: ACOES.RECORDES_CARREGADOS,
      recordes: { '021': 40, '022': 70, '023': 'lixo' },
    });
    expect(estado.recordes).toEqual({ '021': 90, '022': 70 });
    expect(estado.fase).toBe(FASES.RESULTADO);
  });

  it('RECORDES_CARREGADOS com lixo não quebra', () => {
    const estado = aplicar(estadoInicial, { tipo: ACOES.RECORDES_CARREGADOS, recordes: null });
    expect(estado.recordes).toEqual({});
  });
});

describe('criarAparelho', () => {
  it('exige um gabarito com programas', () => {
    expect(() => criarAparelho()).toThrow(TypeError);
    expect(() => criarAparelho({ gabarito: {} })).toThrow(TypeError);
  });

  it('nunca altera o estado recebido (conferido a cada tecla nos testes)', () => {
    expect(() => jogarPrograma('025', Array(30).fill(1))).not.toThrow();
  });
});
