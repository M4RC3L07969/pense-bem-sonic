
import { StyleSheet, View } from 'react-native';

import { TEMA } from '../theme';

const ANGULOS = Object.freeze(['0deg', '60deg', '120deg']);

export function Atomo({ tamanho = 96, cor = TEMA.cores.detalhe }) {
  const espessura = Math.max(2, Math.round(tamanho / 24));
  const nucleo = Math.round(tamanho / 6);
  return (
    <View
      style={{ width: tamanho, height: tamanho }}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
    >
      {ANGULOS.map((angulo) => (
        <View
          key={angulo}
          style={[
            styles.orbita,
            {
              width: tamanho,
              height: tamanho * 0.38,
              top: tamanho * 0.31,
              borderRadius: tamanho / 2,
              borderWidth: espessura,
              borderColor: cor,
              transform: [{ rotate: angulo }],
            },
          ]}
        />
      ))}
      <View
        style={[
          styles.nucleo,
          {
            width: nucleo,
            height: nucleo,
            borderRadius: nucleo / 2,
            top: (tamanho - nucleo) / 2,
            left: (tamanho - nucleo) / 2,
            backgroundColor: cor,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  orbita: { position: 'absolute', left: 0 },
  nucleo: { position: 'absolute' },
});
