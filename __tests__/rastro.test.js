import { describe, expect, test } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { Atomo } from '../src/components/atomo';
import { Rastro } from '../src/components/rastro';

describe('Rastro', () => {
  test('sem chave, não desenha nada', async () => {
    const { toJSON } = await render(<Rastro chave={null} />);
    expect(toJSON()).toBeNull();
  });

  test('com chave, fica por cima sem bloquear toques e escondido do leitor de tela', async () => {
    const { toJSON } = await render(<Rastro chave="acerto" />);
    const camada = toJSON();
    expect(camada.props.pointerEvents).toBe('none');
    expect(camada.props.accessibilityElementsHidden).toBe(true);
    expect(StyleSheet.flatten(camada.props.style)).toMatchObject({
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });
  });
});

describe('Atomo', () => {
  test('tem três órbitas e o núcleo, escondidos do leitor de tela', async () => {
    const { toJSON } = await render(<Atomo tamanho={60} />);
    const atomo = toJSON();
    expect(atomo.children).toHaveLength(4);
    expect(atomo.props.accessibilityElementsHidden).toBe(true);
  });
});
