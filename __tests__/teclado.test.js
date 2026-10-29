import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { Teclado } from '../src/components/teclado';
import { ACOES } from '../src/logic/aparelho';
import { CORES } from '../src/logic/gabarito';

async function montar(props = {}) {
  const onAcao = jest.fn();
  await render(<Teclado onAcao={onAcao} {...props} />);
  return onAcao;
}

describe('Teclado', () => {
  test.each([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])('a tecla %i envia o dígito', async (digito) => {
    const onAcao = await montar();
    await fireEvent.press(screen.getByRole('button', { name: String(digito) }));
    expect(onAcao).toHaveBeenCalledWith({ tipo: ACOES.DIGITO, digito });
  });

  test.each(CORES)('a tecla %s envia a cor', async (cor) => {
    const onAcao = await montar();
    await fireEvent.press(screen.getByRole('button', { name: `responder ${cor}` }));
    expect(onAcao).toHaveBeenCalledWith({ tipo: ACOES.COR, cor });
  });

  test.each([
    ['livro: escolher programa', ACOES.LIVRO],
    ['apagar dígito', ACOES.APAGAR],
    ['enter: confirmar', ACOES.ENTER],
  ])('a tecla "%s" envia a ação certa', async (nome, tipo) => {
    const onAcao = await montar();
    await fireEvent.press(screen.getByRole('button', { name: nome }));
    expect(onAcao).toHaveBeenCalledWith({ tipo });
  });

  test('cada toque envia uma ação só', async () => {
    const onAcao = await montar();
    await fireEvent.press(screen.getByRole('button', { name: '7' }));
    expect(onAcao).toHaveBeenCalledTimes(1);
  });

  test('mostra o nome das 4 cores', async () => {
    await montar();
    for (const cor of CORES) {
      expect(screen.getByText(cor)).toBeTruthy();
    }
  });

  test('marca como selecionada só a cor destacada', async () => {
    await montar({ corDestacada: 'azul' });
    expect(screen.getByRole('button', { name: 'responder azul' })).toBeSelected();
    expect(screen.getByRole('button', { name: 'responder verde' })).not.toBeSelected();
  });

  test('com uma cor destacada, as outras 3 ficam apagadas', async () => {
    await montar({ corDestacada: 'azul' });
    expect(screen.getByRole('button', { name: 'responder azul' })).not.toHaveStyle({
      opacity: 0.35,
    });
    for (const cor of ['vermelho', 'amarelo', 'verde']) {
      expect(screen.getByRole('button', { name: `responder ${cor}` })).toHaveStyle({
        opacity: 0.35,
      });
    }
  });

  test('sem cor destacada, nenhuma tecla fica apagada', async () => {
    await montar();
    for (const cor of CORES) {
      expect(screen.getByRole('button', { name: `responder ${cor}` })).not.toHaveStyle({
        opacity: 0.35,
      });
    }
  });
});
