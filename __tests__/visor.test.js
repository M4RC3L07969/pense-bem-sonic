import { describe, expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

import { Visor } from '../src/components/visor';

describe('Visor', () => {
  test('o leitor de tela lê a legenda e o número', async () => {
    await render(<Visor texto="17" legenda="pergunta" />);
    expect(screen.getByLabelText('pergunta: 17')).toBeTruthy();
  });

  test('o leitor de tela também lê o aviso', async () => {
    await render(
      <Visor texto="17" legenda="pergunta" aviso={{ texto: 'acertou! +3', tom: 'acerto' }} />,
    );
    expect(screen.getByLabelText('pergunta: 17. acertou! +3')).toBeTruthy();
  });

  test('sem nada para mostrar, se apresenta como visor', async () => {
    await render(<Visor />);
    expect(screen.getByLabelText('visor')).toBeTruthy();
  });

  test.each(['acerto', 'erro', 'destaque', 'neutro', 'vermelho', 'amarelo', 'azul', 'verde'])(
    'mostra o aviso com o tom %s',
    async (tom) => {
      await render(<Visor texto="1" aviso={{ texto: 'aviso de teste', tom }} />);
      expect(screen.getByText('aviso de teste')).toBeTruthy();
    },
  );

  test('sem aviso, não mostra texto embaixo dos dígitos', async () => {
    await render(<Visor texto="021" legenda="código do programa" />);
    expect(screen.queryByText('aviso de teste')).toBeNull();
    expect(screen.getAllByText(/./)).toHaveLength(1);
  });
});
