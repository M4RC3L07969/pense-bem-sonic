/**
 * Um dígito de 7 segmentos desenhado com `View`, como num visor de calculadora.
 *
 * Os segmentos apagados continuam levemente visíveis, como num LCD de verdade.
 */

import { StyleSheet, View } from 'react-native';

import { TEMA } from '../theme';
import { SEGMENTOS, segmentosDoCaractere } from './sete-segmentos';

const { cores, digito, formas } = TEMA;

function caixasDosSegmentos(largura, altura, espessura) {
  const folga = Math.max(1, Math.round(espessura / 4));
  const metade = (altura - espessura) / 2;
  const horizontal = { left: espessura / 2 + folga, width: largura - espessura - folga * 2 };
  const vertical = { width: espessura, height: metade - folga * 2 };
  return {
    a: { ...horizontal, top: 0, height: espessura },
    g: { ...horizontal, top: metade, height: espessura },
    d: { ...horizontal, top: altura - espessura, height: espessura },
    f: { ...vertical, left: 0, top: espessura / 2 + folga },
    b: { ...vertical, left: largura - espessura, top: espessura / 2 + folga },
    e: { ...vertical, left: 0, top: metade + espessura / 2 + folga },
    c: { ...vertical, left: largura - espessura, top: metade + espessura / 2 + folga },
  };
}

/**
 * Dígito de 7 segmentos.
 *
 * @param {{ caractere: string, escala?: number }} props `caractere` é um dígito, `-`, espaço ou
 *   uma das letras de `sete-segmentos.js`; `escala` multiplica o tamanho definido no tema.
 * @returns {JSX.Element}
 */
export function Digito({ caractere, escala = 1 }) {
  const largura = Math.round(digito.largura * escala);
  const altura = Math.round(digito.altura * escala);
  const espessura = Math.max(2, Math.round(digito.espessura * escala));
  const caixas = caixasDosSegmentos(largura, altura, espessura);
  const acesos = segmentosDoCaractere(caractere);

  return (
    <View
      style={[styles.digito, { width: largura, height: altura }]}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
    >
      {SEGMENTOS.map((segmento) => (
        <View
          key={segmento}
          style={[
            styles.segmento,
            caixas[segmento],
            {
              borderRadius: espessura / 2,
              backgroundColor: acesos.has(segmento) ? cores.visorAceso : cores.visorApagado,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  digito: { transform: [{ skewX: formas.inclinacaoDigito }] },
  segmento: { position: 'absolute' },
});
