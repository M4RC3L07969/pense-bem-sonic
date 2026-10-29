/**
 * Tecla do aparelho (números e funções), que afunda ao ser tocada.
 */

import { Pressable, StyleSheet, Text } from 'react-native';

import { TEMA } from '../theme';

const { cores, fontes, formas } = TEMA;

/**
 * Tecla genérica.
 *
 * @param {object} props
 * @param {string} props.rotulo Texto da tecla.
 * @param {() => void} props.onPress Chamado ao tocar.
 * @param {'numero' | 'funcao' | 'confirmar'} [props.variante] Aparência da tecla.
 * @param {string} [props.descricao] Texto lido pelo leitor de tela (padrão: o rótulo).
 * @returns {JSX.Element}
 */
export function Tecla({ rotulo, onPress, variante = 'numero', descricao }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={descricao ?? rotulo}
      style={({ pressed }) => [styles.tecla, styles[variante], pressed && styles.apertada]}
    >
      <Text style={[styles.rotulo, styles[`rotulo_${variante}`]]}>{rotulo}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tecla: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: cores.teclaBorda,
    borderWidth: formas.bordaTecla,
    borderRadius: formas.raioTecla,
    boxShadow: formas.sombraTecla,
  },
  apertada: {
    boxShadow: formas.sombraTeclaApertada,
    transform: [{ translateY: formas.afundarAoApertar }],
  },
  numero: { backgroundColor: cores.tecla },
  funcao: { backgroundColor: cores.teclaFuncao },
  confirmar: { backgroundColor: cores.teclaConfirmar },
  rotulo: { fontFamily: fontes.tecla, fontVariant: ['tabular-nums'] },
  rotulo_numero: { color: cores.teclaTexto, fontSize: 24 },
  rotulo_funcao: { color: cores.teclaFuncaoTexto, fontSize: 16 },
  rotulo_confirmar: { color: cores.teclaConfirmarTexto, fontSize: 16 },
});
