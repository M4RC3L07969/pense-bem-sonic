/**
 * Animações curtas do aparelho, feitas com o `Animated` do React Native.
 *
 * Todas respeitam o "Reduzir movimento" do celular: com ele ligado, nada se mexe.
 */

import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform } from 'react-native';

const DRIVER_NATIVO = Platform.OS !== 'web';

/** Duração de cada etapa das animações, em milissegundos. */
export const DURACOES = Object.freeze({ pulo: 120, piscada: 140, pulsacao: 380 });

function animar(valor, para, duracao) {
  return Animated.timing(valor, {
    toValue: para,
    duration: duracao,
    easing: Easing.out(Easing.quad),
    useNativeDriver: DRIVER_NATIVO,
  });
}

/**
 * Diz se o celular pede menos movimento na tela.
 *
 * @returns {boolean} `true` quando o "Reduzir movimento" está ligado.
 */
export function useMovimentoReduzido() {
  const [reduzido, setReduzido] = useState(false);

  useEffect(() => {
    let ativo = true;
    Promise.resolve(AccessibilityInfo.isReduceMotionEnabled?.())
      .then((valor) => {
        if (ativo) {
          setReduzido(Boolean(valor));
        }
      })
      .catch(() => {});
    const assinatura = AccessibilityInfo.addEventListener?.('reduceMotionChanged', (valor) =>
      setReduzido(Boolean(valor)),
    );
    return () => {
      ativo = false;
      assinatura?.remove?.();
    };
  }, []);

  return reduzido;
}

/**
 * Escala que dá um "pulo" (encolhe e volta um pouco maior) sempre que `chave` muda.
 *
 * @param {string | null} chave Identifica o evento; `null` não anima.
 * @returns {Animated.Value} Valor para usar em `transform: [{ scale }]`.
 */
export function usePulo(chave) {
  const [escala] = useState(() => new Animated.Value(1));
  const reduzido = useMovimentoReduzido();

  useEffect(() => {
    if (chave === null || reduzido) {
      escala.setValue(1);
      return undefined;
    }
    escala.setValue(0.8);
    const animacao = Animated.sequence([
      animar(escala, 1.1, DURACOES.pulo),
      animar(escala, 1, DURACOES.pulo),
    ]);
    animacao.start();
    return () => animacao.stop();
  }, [chave, reduzido, escala]);

  return escala;
}

/**
 * Opacidade que pisca `vezes` vezes sempre que `chave` muda.
 *
 * @param {string | null} chave Identifica o evento; `null` não anima.
 * @param {number} vezes Quantas piscadas (0 não anima).
 * @returns {Animated.Value} Valor para usar em `opacity`.
 */
export function usePiscar(chave, vezes) {
  const [opacidade] = useState(() => new Animated.Value(1));
  const reduzido = useMovimentoReduzido();

  useEffect(() => {
    opacidade.setValue(1);
    if (chave === null || reduzido || vezes <= 0) {
      return undefined;
    }
    const piscada = Animated.sequence([
      animar(opacidade, 0.15, DURACOES.piscada),
      animar(opacidade, 1, DURACOES.piscada),
    ]);
    const animacao = Animated.loop(piscada, { iterations: vezes });
    animacao.start();
    return () => animacao.stop();
  }, [chave, vezes, reduzido, opacidade]);

  return opacidade;
}

/**
 * Escala que pulsa (cresce e volta) enquanto `ativo` for verdadeiro.
 *
 * @param {boolean} ativo Se deve pulsar.
 * @param {number} [tamanhoParado] Escala usada quando ativo mas sem movimento (Reduzir movimento).
 * @returns {Animated.Value} Valor para usar em `transform: [{ scale }]`.
 */
export function usePulsar(ativo, tamanhoParado = 1.08) {
  const [escala] = useState(() => new Animated.Value(1));
  const reduzido = useMovimentoReduzido();

  useEffect(() => {
    if (!ativo) {
      escala.setValue(1);
      return undefined;
    }
    if (reduzido) {
      escala.setValue(tamanhoParado);
      return undefined;
    }
    const animacao = Animated.loop(
      Animated.sequence([
        animar(escala, 1.14, DURACOES.pulsacao),
        animar(escala, 1, DURACOES.pulsacao),
      ]),
    );
    animacao.start();
    return () => {
      animacao.stop();
      escala.setValue(1);
    };
  }, [ativo, reduzido, tamanhoParado, escala]);

  return escala;
}
