import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

import gabarito from '../src/data/gabarito.json';
import { CORES } from '../src/logic/gabarito';
import { TEMPOS_DE_AVISO } from '../src/logic/tela';
import { Aparelho } from '../src/screens/aparelho';
import { CHAVE_DO_SOM, CHAVE_DOS_RECORDES } from '../src/services/armazenamento';

const { __tocados: tocados } = require('expo-audio');
const sonsTocados = () => [...tocados];

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo-audio', () => {
  const ordem = ['tecla', 'acerto', 'erro', 'revelada', 'fim', 'recorde'];
  const tocados = [];
  let criados = 0;
  return {
    __tocados: tocados,
    createAudioPlayer: () => {
      const nome = ordem[criados];
      criados += 1;
      return { seekTo: () => Promise.resolve(), play: () => tocados.push(nome) };
    },
  };
});
jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);

const PERGUNTAS_021 = gabarito.programas.find((programa) => programa.codigo === '021').perguntas;
const corErrada = (certa) => CORES.find((cor) => cor !== certa);

async function apertar(nome) {
  await fireEvent.press(screen.getByRole('button', { name: nome }));
}

async function esperar(milissegundos) {
  await act(async () => {
    jest.advanceTimersByTime(milissegundos);
  });
}

async function ligar() {
  await render(<Aparelho />);
  await act(async () => {});
}

async function escolher021() {
  await apertar('livro: escolher programa');
  for (const numero of ['0', '2', '1']) {
    await apertar(numero);
  }
  await apertar('enter: confirmar');
}

async function errarTudo() {
  for (const { resposta } of PERGUNTAS_021) {
    const errada = `responder ${corErrada(resposta)}`;
    await apertar(errada);
    await esperar(TEMPOS_DE_AVISO.erro);
    await apertar(errada);
    await esperar(TEMPOS_DE_AVISO.erro);
    await apertar(errada);
    expect(screen.getByRole('button', { name: `responder ${resposta}` })).toBeSelected();
    await esperar(TEMPOS_DE_AVISO.revelando);
  }
}

beforeEach(async () => {
  jest.useFakeTimers();
  await AsyncStorage.clear();
  tocados.length = 0;
});

afterEach(() => {
  jest.useRealTimers();
});

describe('Aparelho', () => {
  test('ligado, pede para apertar LIVRO', async () => {
    await ligar();
    expect(screen.getByLabelText('aperte LIVRO para começar: ---')).toBeTruthy();
  });

  test('acertando tudo de primeira no 021, termina com 90 e salva o recorde', async () => {
    await ligar();
    await escolher021();
    expect(
      screen.getByLabelText(`021 · pergunta 1 de 30: ${PERGUNTAS_021[0].numero}`),
    ).toBeTruthy();

    for (const { resposta } of PERGUNTAS_021) {
      await apertar(`responder ${resposta}`);
      await esperar(TEMPOS_DE_AVISO.acerto);
    }

    expect(
      screen.getByLabelText('pontos de 90 · ENTER joga de novo: 90. novo recorde'),
    ).toBeTruthy();
    await act(async () => {});
    expect(JSON.parse(await AsyncStorage.getItem(CHAVE_DOS_RECORDES))).toEqual({ '021': 90 });
  });

  test('errando tudo, revela e destaca a cor certa de cada pergunta e termina com 0', async () => {
    await ligar();
    await escolher021();
    await errarTudo();
    expect(
      screen.getByLabelText('pontos de 90 · ENTER joga de novo: 0. novo recorde'),
    ).toBeTruthy();
  });

  test('mostra o recorde guardado quando não há recorde novo', async () => {
    await AsyncStorage.setItem(CHAVE_DOS_RECORDES, JSON.stringify({ '021': 75 }));
    await ligar();
    await escolher021();
    await errarTudo();
    expect(screen.getByLabelText('pontos de 90 · ENTER joga de novo: 0. recorde: 75')).toBeTruthy();
  });

  test('LIVRO no meio de um aviso cancela o avanço', async () => {
    await ligar();
    await escolher021();
    await apertar(`responder ${PERGUNTAS_021[0].resposta}`);
    await apertar('livro: escolher programa');
    await esperar(TEMPOS_DE_AVISO.revelando * 2);
    expect(screen.getByLabelText('código do programa')).toBeTruthy();
  });

  test('um aviso cancelado não adianta os avisos seguintes', async () => {
    const [primeira, segunda] = PERGUNTAS_021;
    await ligar();
    await escolher021();
    await apertar(`responder ${corErrada(primeira.resposta)}`);
    await apertar('livro: escolher programa');
    await escolher021();
    await apertar(`responder ${primeira.resposta}`);
    await esperar(TEMPOS_DE_AVISO.acerto);
    await apertar(`responder ${corErrada(segunda.resposta)}`);
    await esperar(TEMPOS_DE_AVISO.erro - TEMPOS_DE_AVISO.acerto);
    expect(screen.getByLabelText(/errou, tente de novo/)).toBeTruthy();
  });

  test('teclas sem efeito durante o aviso não mudam nada', async () => {
    await ligar();
    await escolher021();
    await apertar(`responder ${corErrada(PERGUNTAS_021[0].resposta)}`);
    await apertar('7');
    await apertar(`responder ${PERGUNTAS_021[0].resposta}`);
    expect(screen.getByLabelText(/errou, tente de novo/)).toBeTruthy();
    await esperar(TEMPOS_DE_AVISO.erro);
    await apertar(`responder ${PERGUNTAS_021[0].resposta}`);
    expect(screen.getByLabelText(/acertou! \+2/)).toBeTruthy();
  });

  test('cada momento do jogo tem o seu som', async () => {
    const [primeira, segunda] = PERGUNTAS_021;
    await ligar();
    await escolher021();
    expect(sonsTocados()).toEqual(['tecla', 'tecla', 'tecla', 'tecla', 'tecla']);

    tocados.length = 0;
    await apertar(`responder ${primeira.resposta}`);
    expect(sonsTocados()).toEqual(['acerto']);
    await esperar(TEMPOS_DE_AVISO.acerto);

    tocados.length = 0;
    const errada = `responder ${corErrada(segunda.resposta)}`;
    await apertar(errada);
    await esperar(TEMPOS_DE_AVISO.erro);
    await apertar(errada);
    await esperar(TEMPOS_DE_AVISO.erro);
    await apertar(errada);
    expect(sonsTocados()).toEqual(['erro', 'erro', 'revelada']);
  });

  test('no fim toca o som do recorde', async () => {
    await ligar();
    await escolher021();
    for (const { resposta } of PERGUNTAS_021) {
      await apertar(`responder ${resposta}`);
      await esperar(TEMPOS_DE_AVISO.acerto);
    }
    expect(sonsTocados().at(-1)).toBe('recorde');
  });

  test('o botão de som desliga tudo e a escolha fica salva', async () => {
    await ligar();
    const botao = screen.getByRole('switch', { name: 'som' });
    expect(botao).toBeChecked();
    await fireEvent.press(botao);
    expect(screen.getByRole('switch', { name: 'som' })).not.toBeChecked();
    await act(async () => {});
    expect(await AsyncStorage.getItem(CHAVE_DO_SOM)).toBe('desligado');

    await escolher021();
    await apertar(`responder ${PERGUNTAS_021[0].resposta}`);
    expect(sonsTocados()).toEqual([]);
  });

  test('abre com o som desligado se foi essa a escolha salva', async () => {
    await AsyncStorage.setItem(CHAVE_DO_SOM, 'desligado');
    await ligar();
    expect(screen.getByRole('switch', { name: 'som' })).not.toBeChecked();
    await apertar('livro: escolher programa');
    expect(sonsTocados()).toEqual([]);
  });
});
