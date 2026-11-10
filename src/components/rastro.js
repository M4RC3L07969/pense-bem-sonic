
import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { TEMA } from '../theme';
import { DRIVER_NATIVO, DURACOES, useMovimentoReduzido } from './animacoes';

const FAIXAS = Object.freeze([
  { largura: 0.5, topo: 0.3 },
  { largura: 0.75, topo: 0.47 },
  { largura: 0.4, topo: 0.64 },
]);

export function Rastro({ chave, passagens = 1, espessura = 6 }) {
  const reduzido = useMovimentoReduzido();
  const [tamanho, setTamanho] = useState({ largura: 0, altura: 0 });
  const [progresso] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (chave === null || reduzido || tamanho.largura === 0) {
      return undefined;
    }
    progresso.setValue(0);
    const animacao = Animated.loop(
      Animated.timing(progresso, {
        toValue: 1,
        duration: DURACOES.rastro,
        easing: Easing.in(Easing.quad),
        useNativeDriver: DRIVER_NATIVO,
      }),
      { iterations: passagens },
    );
    animacao.start();
    return () => animacao.stop();
  }, [chave, passagens, reduzido, tamanho.largura, progresso]);

  if (chave === null || reduzido) {
    return null;
  }

  const { largura, altura } = tamanho;
  const deslocamento = progresso.interpolate({
    inputRange: [0, 1],
    outputRange: [-largura, largura * 1.2],
  });
  const visibilidade = progresso.interpolate({
    inputRange: [0, 0.05, 0.9, 1],
    outputRange: [0, 0.85, 0.85, 0],
  });

  return (
    <View
      style={styles.camada}
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      onLayout={({ nativeEvent }) =>
        setTamanho({ largura: nativeEvent.layout.width, altura: nativeEvent.layout.height })
      }
    >
      {largura > 0 &&
        FAIXAS.map((faixa) => (
          <Animated.View
            key={faixa.topo}
            style={[
              styles.faixa,
              {
                width: largura * faixa.largura,
                height: espessura,
                top: altura * faixa.topo,
                opacity: visibilidade,
                transform: [{ translateX: deslocamento }, { skewX: '-30deg' }],
              },
            ]}
          />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  camada: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
  faixa: {
    position: 'absolute',
    left: 0,
    borderRadius: 2,
    backgroundColor: TEMA.cores.detalhe,
  },
});
