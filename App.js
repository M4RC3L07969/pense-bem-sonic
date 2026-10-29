/**
 * Componente raiz: carrega as fontes e mostra o aparelho.
 *
 * Por enquanto o aparelho fica parado (as teclas ainda não mudam o visor); a Fase 4 liga
 * o teclado às regras do jogo.
 */

import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet } from 'react-native';

import { Carcaca } from './src/components/carcaca';
import { Teclado } from './src/components/teclado';
import { Visor } from './src/components/visor';
import { TEMA } from './src/theme';
import { FONTES } from './src/theme/fontes';

/**
 * App do Pense Bem.
 *
 * @returns {JSX.Element | null}
 */
export default function App() {
  const [fontesProntas] = useFonts(FONTES);

  if (!fontesProntas) {
    return null;
  }

  return (
    <ScrollView
      style={styles.fundo}
      contentContainerStyle={styles.conteudo}
      contentInsetAdjustmentBehavior="automatic"
    >
      <StatusBar style="light" />
      <Carcaca>
        <Visor texto="---" legenda="digite o código do programa" />
        <Teclado onAcao={() => {}} />
      </Carcaca>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fundo: { backgroundColor: TEMA.cores.fundo },
  conteudo: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 24,
  },
});
