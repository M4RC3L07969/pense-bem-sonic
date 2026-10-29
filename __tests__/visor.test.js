import { describe, expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

import { Visor } from '../src/components/visor';

describe('Visor', () => {
  test('o leitor de tela lê a legenda e o número', async () => {
    await render(<Visor texto="17" legenda="pergunta" />);
    expect(screen.getByLabelText('pergunta: 17')).toBeTruthy();
  });

  test('sem nada para mostrar, se apresenta como visor', async () => {
    await render(<Visor />);
    expect(screen.getByLabelText('visor')).toBeTruthy();
  });

  test.each([
    [{ sinal: 'acerto' }, 'acertou'],
    [{ sinal: 'erro' }, 'errou, tente de novo'],
    [{ corRevelada: 'azul' }, 'a certa era azul'],
    [{ recorde: true }, 'novo recorde'],
  ])('mostra o aviso certo para %j', async (props, aviso) => {
    await render(<Visor texto="1" {...props} />);
    expect(screen.getByText(aviso)).toBeTruthy();
  });

  test('não mostra aviso quando não há nada a avisar', async () => {
    await render(<Visor texto="021" legenda="código do programa" />);
    for (const aviso of ['acertou', 'errou, tente de novo', 'novo recorde']) {
      expect(screen.queryByText(aviso)).toBeNull();
    }
  });
});
