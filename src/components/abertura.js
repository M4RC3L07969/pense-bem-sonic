
import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text } from 'react-native';

import { TEMA } from '../theme';
import { DRIVER_NATIVO, DURACOES, useMovimentoReduzido } from './animacoes';
import { Atomo } from './atomo';
import { Rastro } from './rastro';

const { cores, fontes, formas } = TEMA;
const TEMPO_PARADA = 700;

function animar(valor, para, duracao, atraso = 0) {
  return Animated.timing(valor, {
    toValue: para,
    duration: duracao,
    delay: atraso,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: DRIVER_NATIVO,
  });
}

export function Abertura({ aoTerminar }) {
  const reduzido = useMovimentoReduzido();
  const [entrada] = useState(() => new Animated.Value(0));
  const [giro] = useState(() => new Animated.Value(0));
  const [saida] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (reduzido) {
      entrada.setValue(1);
      const temporizador = setTimeout(aoTerminar, TEMPO_PARADA);
      return () => clearTimeout(temporizador);
    }
    const animacao = Animated.parallel([
      animar(entrada, 1, 500, 150),
      animar(giro, 1, 1400),
      Animated.sequence([Animated.delay(DURACOES.abertura - 300), animar(saida, 0, 300)]),
    ]);
    animacao.start(({ finished }) => {
      if (finished) {
        aoTerminar();
      }
    });
    return () => animacao.stop();
  }, [reduzido, aoTerminar, entrada, giro, saida]);

  const deslizar = entrada.interpolate({ inputRange: [0, 1], outputRange: [-60, 0] });
  const rotacao = giro.interpolate({ inputRange: [0, 1], outputRange: ['-90deg', '270deg'] });

  return (
    <Animated.View style={[styles.tela, { opacity: saida }]}>
      <Pressable
        style={styles.toque}
        onPress={aoTerminar}
        accessibilityRole="button"
        accessibilityLabel="Pense Bem, uma aventura científica com Sonic. Toque para começar."
      >
        <Rastro chave="abertura" passagens={2} espessura={14} />
        <Animated.View style={{ opacity: entrada, transform: [{ rotate: rotacao }] }}>
          <Atomo tamanho={120} />
        </Animated.View>
        <Animated.View
          style={[styles.textos, { opacity: entrada, transform: [{ translateX: deslizar }] }]}
        >
          <Text style={styles.titulo}>Pense Bem</Text>
          <Text style={styles.subtitulo}>Uma aventura científica com Sonic</Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tela: { ...StyleSheet.absoluteFill, backgroundColor: cores.fundo, zIndex: 10 },
  toque: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 28, padding: 24 },
  textos: { alignItems: 'center', gap: 6 },
  titulo: {
    color: cores.carcacaTexto,
    fontFamily: fontes.titulo,
    fontSize: 48,
    lineHeight: 56,
    transform: [{ skewX: formas.inclinacaoTitulo }],
  },
  subtitulo: {
    color: cores.carcacaTextoSuave,
    fontFamily: fontes.texto,
    fontSize: 16,
    textAlign: 'center',
  },
});
