import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  CHAVE_DO_SOM,
  CHAVE_DOS_RECORDES,
  carregarRecordes,
  carregarSomLigado,
  salvarRecordes,
  salvarSomLigado,
} from '../src/services/armazenamento';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

beforeEach(async () => {
  jest.restoreAllMocks();
  await AsyncStorage.clear();
});

describe('armazenamento dos recordes', () => {
  it('sem nada salvo, carrega {}', async () => {
    expect(await carregarRecordes()).toEqual({});
  });

  it('salva e carrega de volta', async () => {
    expect(await salvarRecordes({ '021': 72, '026': 30 })).toBe(true);
    expect(await carregarRecordes()).toEqual({ '021': 72, '026': 30 });
  });

  it('grava na chave do app, em JSON', async () => {
    await salvarRecordes({ '021': 72 });
    expect(JSON.parse(await AsyncStorage.getItem(CHAVE_DOS_RECORDES))).toEqual({ '021': 72 });
  });

  it('limpa entradas inválidas ao salvar e ao carregar', async () => {
    await salvarRecordes({ '021': 72, '022': 500 });
    expect(await carregarRecordes()).toEqual({ '021': 72 });
    await AsyncStorage.setItem(CHAVE_DOS_RECORDES, JSON.stringify({ '023': -5, '024': 10 }));
    expect(await carregarRecordes()).toEqual({ '024': 10 });
  });

  it('JSON quebrado carrega {}', async () => {
    await AsyncStorage.setItem(CHAVE_DOS_RECORDES, '{quebrado');
    expect(await carregarRecordes()).toEqual({});
  });

  it('erro ao ler carrega {}', async () => {
    await salvarRecordes({ '021': 72 });
    jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('sem armazenamento'));
    expect(await carregarRecordes()).toEqual({});
  });

  it('erro ao gravar devolve false', async () => {
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('sem espaço'));
    expect(await salvarRecordes({ '021': 72 })).toBe(false);
  });
});

describe('preferência do som', () => {
  it('sem nada salvo, o som começa ligado', async () => {
    expect(await carregarSomLigado()).toBe(true);
  });

  it('salva desligado e carrega de volta', async () => {
    expect(await salvarSomLigado(false)).toBe(true);
    expect(await AsyncStorage.getItem(CHAVE_DO_SOM)).toBe('desligado');
    expect(await carregarSomLigado()).toBe(false);
    await salvarSomLigado(true);
    expect(await carregarSomLigado()).toBe(true);
  });

  it('valor desconhecido conta como ligado', async () => {
    await AsyncStorage.setItem(CHAVE_DO_SOM, 'talvez');
    expect(await carregarSomLigado()).toBe(true);
  });

  it('erro ao ler deixa o som ligado', async () => {
    await salvarSomLigado(false);
    jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('sem armazenamento'));
    expect(await carregarSomLigado()).toBe(true);
  });

  it('erro ao gravar devolve false', async () => {
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('sem espaço'));
    expect(await salvarSomLigado(false)).toBe(false);
  });

  it('não mistura com os recordes', async () => {
    await salvarRecordes({ '021': 72 });
    await salvarSomLigado(false);
    expect(await carregarRecordes()).toEqual({ '021': 72 });
  });
});
