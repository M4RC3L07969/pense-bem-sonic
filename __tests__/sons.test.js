import { describe, expect, test } from '@jest/globals';

import gabarito from '../src/data/gabarito.json';
import { ACOES, criarAparelho } from '../src/logic/aparelho';
import { CORES } from '../src/logic/gabarito';
import { SONS, somDaMudanca } from '../src/logic/sons';

const { estadoInicial, reduzir } = criarAparelho({ gabarito, aleatorio: () => 0 });
const PERGUNTAS = gabarito.programas.find((programa) => programa.codigo === '021').perguntas;
const certa = (indice) => ({ tipo: ACOES.COR, cor: PERGUNTAS[indice].resposta });
const errada = (indice) => ({
  tipo: ACOES.COR,
  cor: CORES.find((cor) => cor !== PERGUNTAS[indice].resposta),
});
const avancar = { tipo: ACOES.AVANCAR };
const codigo021 = [
  { tipo: ACOES.LIVRO },
  ...[0, 2, 1].map((digito) => ({ tipo: ACOES.DIGITO, digito })),
  { tipo: ACOES.ENTER },
];

const jogar = (acoes, estado = estadoInicial) => acoes.reduce(reduzir, estado);
const somDe = (estado, acao) => somDaMudanca(estado, reduzir(estado, acao));
const acertarTudo = PERGUNTAS.flatMap((_, indice) => [certa(indice), avancar]);

describe('somDaMudanca', () => {
  const naPergunta = jogar(codigo021);

  test('acerto', () => {
    expect(somDe(naPergunta, certa(0))).toBe(SONS.ACERTO);
  });

  test('erro com tentativa sobrando', () => {
    expect(somDe(naPergunta, errada(0))).toBe(SONS.ERRO);
  });

  test('terceiro erro revela a cor', () => {
    const naTerceira = jogar([errada(0), avancar, errada(0), avancar], naPergunta);
    expect(somDe(naTerceira, errada(0))).toBe(SONS.REVELADA);
  });

  test('fim com recorde novo e fim sem recorde novo', () => {
    const quaseNoFim = jogar(acertarTudo.slice(0, -1), naPergunta);
    expect(somDe(quaseNoFim, avancar)).toBe(SONS.RECORDE);

    const comRecorde = jogar([{ tipo: ACOES.RECORDES_CARREGADOS, recordes: { '021': 90 } }]);
    const quaseNoFimDeNovo = jogar([...codigo021, ...acertarTudo.slice(0, -1)], comRecorde);
    expect(somDe(quaseNoFimDeNovo, avancar)).toBe(SONS.FIM);
  });

  test.each([
    ['digitar', jogar([{ tipo: ACOES.LIVRO }]), { tipo: ACOES.DIGITO, digito: 1 }],
    ['entrar no programa', jogar(codigo021.slice(0, -1)), { tipo: ACOES.ENTER }],
    ['voltar para a pergunta depois do erro', null, avancar],
    ['apertar LIVRO no meio', null, { tipo: ACOES.LIVRO }],
    ['tecla ignorada', null, { tipo: ACOES.DIGITO, digito: 5 }],
  ])('sem som próprio ao %s', (_, estado, acao) => {
    const inicio = estado ?? jogar([errada(0)], naPergunta);
    expect(somDe(inicio, acao)).toBeNull();
  });

  test('o mesmo estado não toca nada', () => {
    expect(somDaMudanca(naPergunta, naPergunta)).toBeNull();
  });
});
