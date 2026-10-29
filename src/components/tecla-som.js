/**
 * Botão pequeno que liga e desliga o som, com uma luz que mostra o estado.
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TEMA } from '../theme';

const { cores, fontes, formas } = TEMA;

/**
 * Botão de som.
 *
 * @param {object} props
 * @param {boolean} props.ligado Se o som está ligado.
 * @param {() => void} props.onPress Chamado ao tocar (quem usa troca o estado).
 * @returns {JSX.Element}
 */
export function TeclaSom({ ligado, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="switch"
      accessibilityLabel="som"
      aria-checked={ligado}
      hitSlop={8}
      style={({ pressed }) => [styles.tecla, pressed && styles.apertada]}
    >
      <View style={[styles.luz, ligado ? styles.luzAcesa : styles.luzApagada]} />
      <Text style={styles.rotulo}>{ligado ? 'SOM' : 'SEM SOM'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tecla: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 32,
    paddingHorizontal: 12,
    borderRadius: formas.raioTecla,
    backgroundColor: cores.teclaFuncao,
    boxShadow: formas.sombraTeclaApertada,
  },
  apertada: { transform: [{ translateY: 1 }] },
  luz: { width: 10, height: 10, borderRadius: 5 },
  luzAcesa: { backgroundColor: cores.luzAcesa, boxShadow: `0px 0px 6px ${cores.luzAcesa}` },
  luzApagada: { backgroundColor: cores.luzApagada },
  rotulo: { color: cores.teclaFuncaoTexto, fontFamily: fontes.tecla, fontSize: 12 },
});
