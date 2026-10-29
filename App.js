/**
 * Componente raiz: carrega as fontes e mostra o aparelho.
 */

import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Aparelho } from './src/screens/aparelho';
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
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Aparelho />
    </SafeAreaProvider>
  );
}
