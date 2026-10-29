/**
 * Carcaça do aparelho: o corpo onde ficam o título, o visor e o teclado.
 *
 * Ao lado do título ficam três faixas amarelas de velocidade, o detalhe do tema.
 */

import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { TEMA } from '../theme';

const { cores, fontes, formas, larguraMaxima, larguraDeTelaEstreita } = TEMA;
const LARGURAS_DAS_FAIXAS = Object.freeze([56, 42, 28]);

function Faixas() {
  return (
    <View
      style={styles.faixas}
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
    >
      {LARGURAS_DAS_FAIXAS.map((largura) => (
        <View key={largura} style={[styles.faixa, { width: largura }]} />
      ))}
    </View>
  );
}

/**
 * Corpo do aparelho.
 *
 * @param {object} props
 * @param {import('react').ReactNode} props.children Visor e teclado.
 * @param {string} [props.titulo] Nome do jogo, no alto.
 * @param {string} [props.subtitulo] Linha abaixo do título.
 * @returns {JSX.Element}
 */
export function Carcaca({
  children,
  titulo = 'Pense Bem',
  subtitulo = 'Uma aventura científica com Sonic',
}) {
  const estreita = useWindowDimensions().width < larguraDeTelaEstreita;

  return (
    <View style={[styles.carcaca, estreita && styles.carcacaEstreita]}>
      <View style={styles.cabecalho}>
        <View style={styles.linhaDoTitulo}>
          <Text
            accessibilityRole="header"
            numberOfLines={1}
            style={[styles.titulo, estreita && styles.tituloEstreito]}
          >
            {titulo}
          </Text>
          <Faixas />
        </View>
        <Text style={[styles.subtitulo, estreita && styles.subtituloEstreito]}>{subtitulo}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  carcaca: {
    width: '100%',
    maxWidth: larguraMaxima,
    backgroundColor: cores.carcaca,
    borderColor: cores.carcacaBorda,
    borderWidth: formas.bordaCarcaca,
    borderRadius: formas.raioCarcaca,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 34,
    gap: 18,
    overflow: 'hidden',
  },
  carcacaEstreita: { paddingHorizontal: 14 },
  cabecalho: { gap: 2 },
  linhaDoTitulo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  titulo: {
    flex: 1,
    color: cores.carcacaTexto,
    fontFamily: fontes.titulo,
    fontSize: 34,
    lineHeight: 40,
    transform: [{ skewX: formas.inclinacaoTitulo }],
  },
  tituloEstreito: { fontSize: 28, lineHeight: 34 },
  subtitulo: { color: cores.carcacaTextoSuave, fontFamily: fontes.texto, fontSize: 15 },
  subtituloEstreito: { fontSize: 13 },
  faixas: { alignItems: 'flex-end', gap: 6 },
  faixa: { height: 8, backgroundColor: cores.detalhe, transform: [{ skewX: '-30deg' }] },
});
