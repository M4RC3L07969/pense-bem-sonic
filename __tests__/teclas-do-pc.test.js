import { describe, expect, test } from '@jest/globals';

import { ACOES } from '../src/logic/aparelho';
import { acaoDaTeclaDoPc } from '../src/logic/teclas-do-pc';

describe('acaoDaTeclaDoPc', () => {
  test.each([...'0123456789'])('a tecla %s digita o número', (tecla) => {
    expect(acaoDaTeclaDoPc({ key: tecla })).toEqual({ tipo: ACOES.DIGITO, digito: Number(tecla) });
  });

  test.each([
    ['Enter', ACOES.ENTER],
    ['Backspace', ACOES.APAGAR],
    ['Escape', ACOES.LIVRO],
  ])('%s vira %s', (tecla, tipo) => {
    expect(acaoDaTeclaDoPc({ key: tecla })).toEqual({ tipo });
  });

  test.each(['a', 'F5', 'Tab', ' ', '10'])('a tecla "%s" não faz nada', (tecla) => {
    expect(acaoDaTeclaDoPc({ key: tecla })).toBeNull();
  });

  test('atalhos com Ctrl, Cmd ou Alt ficam com o navegador', () => {
    expect(acaoDaTeclaDoPc({ key: '1', ctrlKey: true })).toBeNull();
    expect(acaoDaTeclaDoPc({ key: 'Enter', metaKey: true })).toBeNull();
    expect(acaoDaTeclaDoPc({ key: 'Backspace', altKey: true })).toBeNull();
  });
});
