/**
 * Componente raiz: carrega as fontes, mostra a abertura e depois o aparelho.
 */

import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Abertura } from './src/components/abertura';
import { Aparelho } from './src/screens/aparelho';
import { FONTES } from './src/theme/fontes';

/**
 * App do Pense Bem.
 *
 * @returns {JSX.Element | null}
 */
export default function App() {
  const [fontesProntas] = useFonts(FONTES);
  const [abrindo, setAbrindo] = useState(true);
  const terminarAbertura = useCallback(() => setAbrindo(false), []);

  if (!fontesProntas) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={styles.app}>
        <Aparelho />
        {abrindo && <Abertura aoTerminar={terminarAbertura} />}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1 },
});
