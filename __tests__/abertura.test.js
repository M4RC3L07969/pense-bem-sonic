import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo, StyleSheet } from 'react-native';

import { Abertura } from '../src/components/abertura';
import { DURACOES } from '../src/components/animacoes';

const NOME = 'Pense Bem, uma aventura científica com Sonic. Toque para começar.';

async function esperar(milissegundos) {
  await act(async () => {
    jest.advanceTimersByTime(milissegundos);
  });
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('Abertura', () => {
  test('mostra o nome do jogo e termina sozinha em menos de 2 segundos', async () => {
    const aoTerminar = jest.fn();
    await render(<Abertura aoTerminar={aoTerminar} />);
    expect(screen.getByText('Pense Bem')).toBeTruthy();
    expect(screen.getByText('Uma aventura científica com Sonic')).toBeTruthy();
    await esperar(DURACOES.abertura - 400);
    expect(aoTerminar).not.toHaveBeenCalled();
    await esperar(800);
    expect(aoTerminar).toHaveBeenCalledTimes(1);
  });

  test('um toque pula a abertura', async () => {
    const aoTerminar = jest.fn();
    await render(<Abertura aoTerminar={aoTerminar} />);
    await fireEvent.press(screen.getByRole('button', { name: NOME }));
    expect(aoTerminar).toHaveBeenCalledTimes(1);
  });

  test('com "Reduzir movimento", aparece parada e termina logo', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
    const aoTerminar = jest.fn();
    await render(<Abertura aoTerminar={aoTerminar} />);
    await act(async () => {});
    await esperar(800);
    expect(aoTerminar).toHaveBeenCalledTimes(1);
  });

  test('cobre a tela inteira, por cima do jogo', async () => {
    const { toJSON } = await render(<Abertura aoTerminar={jest.fn()} />);
    expect(StyleSheet.flatten(toJSON().props.style)).toMatchObject({
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });
  });
});
