/**
 * Tecla de resposta: uma das 4 cores, com o nome da cor em letra pequena.
 */

import { Animated, Pressable, StyleSheet, Text, useWindowDimensions } from 'react-native';

import { TEMA } from '../theme';
import { usePulsar } from './animacoes';

const { cores, fontes, formas } = TEMA;

/**
 * Tecla colorida de resposta.
 *
 * @param {object} props
 * @param {'vermelho' | 'amarelo' | 'azul' | 'verde'} props.cor Cor da tecla.
 * @param {() => void} props.onPress Chamado ao tocar.
 * @param {boolean} [props.destacada] Realça a tecla (usado para revelar a cor certa).
 * @param {boolean} [props.apagada] Deixa a tecla esmaecida (as outras cores, enquanto uma está destacada).
 * @returns {JSX.Element}
 */
export function TeclaCor({ cor, onPress, destacada = false, apagada = false }) {
  const estreita = useWindowDimensions().width < TEMA.larguraDeTelaEstreita;
  const escala = usePulsar(destacada);

  return (
    <Animated.View style={[styles.moldura, { transform: [{ scale: escala }] }]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`responder ${cor}`}
        aria-selected={destacada}
        style={({ pressed }) => [
          styles.tecla,
          { backgroundColor: cores.resposta[cor] },
          destacada && styles.destacada,
          apagada && styles.apagada,
          pressed && styles.apertada,
        ]}
      >
        <Text
          style={[
            styles.nome,
            estreita && styles.nomeEstreito,
            { color: cores.respostaTexto[cor] },
          ]}
        >
          {cor}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  moldura: { flex: 1 },
  tecla: {
    flex: 1,
    minHeight: 72,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
    borderColor: cores.respostaBorda,
    borderWidth: formas.bordaTeclaCor,
    borderRadius: formas.raioTeclaCor,
    boxShadow: formas.sombraTecla,
  },
  destacada: { borderWidth: formas.bordaTeclaCorDestacada },
  apagada: { opacity: 0.35 },
  apertada: {
    boxShadow: formas.sombraTeclaApertada,
    transform: [{ translateY: formas.afundarAoApertar }],
  },
  nome: { fontFamily: fontes.texto, fontSize: 12 },
  nomeEstreito: { fontSize: 10 },
});
