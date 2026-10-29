import { describe, expect, test } from '@jest/globals';

import gabarito from '../src/data/gabarito.json';
import { ACOES, criarAparelho } from '../src/logic/aparelho';
import { CORES } from '../src/logic/gabarito';
import { TEMPOS_DE_AVISO, tempoAteAvancar, visorDoEstado } from '../src/logic/tela';

const { estadoInicial, reduzir } = criarAparelho({ gabarito, aleatorio: () => 0 });
const PROGRAMA_021 = gabarito.programas.find((programa) => programa.codigo === '021');
const respostaDa = (indice) => PROGRAMA_021.perguntas[indice].resposta;
const corErradaDa = (indice) => CORES.find((cor) => cor !== respostaDa(indice));

const livro = { tipo: ACOES.LIVRO };
const enter = { tipo: ACOES.ENTER };
const avancar = { tipo: ACOES.AVANCAR };
const digito = (valor) => ({ tipo: ACOES.DIGITO, digito: valor });
const cor = (valor) => ({ tipo: ACOES.COR, cor: valor });
const codigo021 = [livro, digito(0), digito(2), digito(1), enter];

function jogar(acoes, estado = estadoInicial) {
  return acoes.reduce(reduzir, estado);
}

function acertarTudo() {
  return PROGRAMA_021.perguntas.flatMap((_, indice) => [cor(respostaDa(indice)), avancar]);
}

describe('visorDoEstado', () => {
  test('ligado, pede para apertar LIVRO', () => {
    expect(visorDoEstado(estadoInicial)).toEqual({
      visor: { texto: '---', legenda: 'aperte LIVRO para começar', tentativa: null, aviso: null },
      corDestacada: null,
    });
  });

  test('mostra o código enquanto ele é digitado', () => {
    const { visor } = visorDoEstado(jogar([livro, digito(0), digito(2)]));
    expect(visor).toEqual({
      texto: '02',
      legenda: 'código do programa',
      tentativa: null,
      aviso: null,
    });
  });

  test('avisa quando o código está incompleto', () => {
    const { visor } = visorDoEstado(jogar([livro, digito(0), enter]));
    expect(visor.texto).toBe('0');
    expect(visor.aviso).toEqual({ texto: 'digite os 3 números', tom: 'erro' });
  });

  test('avisa quando o código não existe e limpa os dígitos', () => {
    const { visor } = visorDoEstado(jogar([livro, digito(9), digito(9), digito(9), enter]));
    expect(visor.texto).toBe('');
    expect(visor.aviso).toEqual({ texto: 'código inválido', tom: 'erro' });
  });

  test('na pergunta, mostra o número do livro, o programa e a tentativa', () => {
    const estado = jogar([...codigo021, cor(respostaDa(0)), avancar]);
    expect(visorDoEstado(estado)).toEqual({
      visor: {
        texto: String(PROGRAMA_021.perguntas[1].numero),
        legenda: '021 · pergunta 2 de 30',
        tentativa: 1,
        aviso: null,
      },
      corDestacada: null,
    });
  });

  test.each([
    [0, 3],
    [1, 2],
    [2, 1],
  ])('acerto depois de %i erro(s) mostra +%i', (erros, pontos) => {
    const tentativasErradas = Array.from({ length: erros }, () => [cor(corErradaDa(0)), avancar]);
    const estado = jogar([...codigo021, ...tentativasErradas.flat(), cor(respostaDa(0))]);
    expect(visorDoEstado(estado).visor.aviso).toEqual({
      texto: `acertou! +${pontos}`,
      tom: 'acerto',
    });
  });

  test('erro com tentativa sobrando avisa e já marca a próxima tentativa', () => {
    const { visor } = visorDoEstado(jogar([...codigo021, cor(corErradaDa(0))]));
    expect(visor.aviso).toEqual({ texto: 'errou, tente de novo', tom: 'erro' });
    expect(visor.tentativa).toBe(2);
  });

  test('depois de 3 erros, mostra a cor certa e destaca a tecla dela', () => {
    const errada = cor(corErradaDa(0));
    const estado = jogar([...codigo021, errada, avancar, errada, avancar, errada]);
    expect(visorDoEstado(estado)).toEqual({
      visor: expect.objectContaining({
        tentativa: 3,
        aviso: { texto: `a certa era ${respostaDa(0)}`, tom: respostaDa(0) },
      }),
      corDestacada: respostaDa(0),
    });
  });

  test('no fim, mostra o total, o máximo e o novo recorde', () => {
    const { visor } = visorDoEstado(jogar([...codigo021, ...acertarTudo()]));
    expect(visor).toEqual({
      texto: '90',
      legenda: 'pontos de 90 · ENTER joga de novo',
      tentativa: null,
      aviso: { texto: 'novo recorde', tom: 'destaque' },
    });
  });

  test('no fim, sem recorde novo, mostra o recorde guardado', () => {
    const comRecorde = jogar([{ tipo: ACOES.RECORDES_CARREGADOS, recordes: { '021': 90 } }]);
    const erros = PROGRAMA_021.perguntas.flatMap((_, indice) => {
      const errada = cor(corErradaDa(indice));
      return [errada, avancar, errada, avancar, errada, avancar];
    });
    const { visor } = visorDoEstado(jogar([...codigo021, ...erros], comRecorde));
    expect(visor.texto).toBe('0');
    expect(visor.aviso).toEqual({ texto: 'recorde: 90', tom: 'neutro' });
  });
});

describe('tempoAteAvancar', () => {
  test('espera uma tecla fora dos avisos', () => {
    expect(tempoAteAvancar(estadoInicial)).toBeNull();
    expect(tempoAteAvancar(jogar(codigo021))).toBeNull();
  });

  test('cada aviso tem o seu tempo', () => {
    expect(tempoAteAvancar(jogar([...codigo021, cor(respostaDa(0))]))).toBe(TEMPOS_DE_AVISO.acerto);
    expect(tempoAteAvancar(jogar([...codigo021, cor(corErradaDa(0))]))).toBe(TEMPOS_DE_AVISO.erro);
    const errada = cor(corErradaDa(0));
    const revelando = jogar([...codigo021, errada, avancar, errada, avancar, errada]);
    expect(tempoAteAvancar(revelando)).toBe(TEMPOS_DE_AVISO.revelando);
  });
});
