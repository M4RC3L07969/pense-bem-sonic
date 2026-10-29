/**
 * Visor do aparelho: dígitos grandes e as informações da jogada.
 *
 * Componente só de apresentação: recebe o que mostrar e não conhece as regras do jogo.
 */

import { StyleSheet, Text, View } from 'react-native';

import { TEMA } from '../theme';
import { Digito } from './digito';

const { cores, fontes, formas } = TEMA;
const CASAS = 3;

function Marcador({ ativo, usado }) {
  return (
    <View
      style={[styles.marcador, (ativo || usado) && styles.marcadorCheio, usado && styles.usado]}
    />
  );
}

function Selo({ texto, fundo, cor }) {
  return (
    <View style={[styles.selo, { backgroundColor: fundo }]}>
      <Text style={[styles.textoSelo, { color: cor }]}>{texto}</Text>
    </View>
  );
}

/**
 * Visor do aparelho.
 *
 * @param {object} props
 * @param {string} [props.texto] O que aparece nos dígitos (até 3 caracteres, alinhado à direita).
 * @param {string} [props.legenda] Texto pequeno em cima, dizendo o que os dígitos significam.
 * @param {number | null} [props.tentativa] Tentativa atual (1 a `maxTentativas`), ou `null` para esconder.
 * @param {number} [props.maxTentativas] Quantas tentativas existem.
 * @param {'acerto' | 'erro' | null} [props.sinal] Aviso da última jogada.
 * @param {string | null} [props.corRevelada] Cor certa a mostrar depois de 3 erros.
 * @param {boolean} [props.recorde] Se mostra o aviso de novo recorde.
 * @returns {JSX.Element}
 */
export function Visor({
  texto = '',
  legenda,
  tentativa = null,
  maxTentativas = 3,
  sinal = null,
  corRevelada = null,
  recorde = false,
}) {
  const casas = texto.slice(-CASAS).padStart(CASAS, ' ').split('');
  const descricao = [legenda, texto.trim()].filter(Boolean).join(': ');

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={descricao || 'visor'}
      style={styles.visor}
    >
      <View style={styles.linha}>
        <Text style={styles.legenda}>{legenda ?? ''}</Text>
        {tentativa !== null && (
          <View style={styles.marcadores}>
            {Array.from({ length: maxTentativas }, (_, indice) => (
              <Marcador
                key={indice}
                ativo={indice + 1 === tentativa}
                usado={indice + 1 < tentativa}
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.digitos}>
        {casas.map((caractere, indice) => (
          <Digito key={indice} caractere={caractere} />
        ))}
      </View>

      <View style={[styles.linha, styles.rodape]}>
        {sinal === 'acerto' && <Selo texto="acertou" fundo={cores.acerto} cor={cores.sinalTexto} />}
        {sinal === 'erro' && (
          <Selo texto="errou, tente de novo" fundo={cores.erro} cor={cores.sinalTexto} />
        )}
        {corRevelada && (
          <Selo
            texto={`a certa era ${corRevelada}`}
            fundo={cores.resposta[corRevelada]}
            cor={cores.respostaTexto[corRevelada]}
          />
        )}
        {recorde && (
          <Selo texto="novo recorde" fundo={cores.detalhe} cor={cores.teclaConfirmarTexto} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  visor: {
    backgroundColor: cores.visorFundo,
    borderColor: cores.visorBorda,
    borderWidth: formas.bordaVisor,
    borderRadius: formas.raioVisor,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 22,
    gap: 8,
  },
  rodape: { justifyContent: 'flex-start', flexWrap: 'wrap' },
  legenda: { color: cores.visorTexto, fontFamily: fontes.texto, fontSize: 14 },
  marcadores: { flexDirection: 'row', gap: 6 },
  marcador: {
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: cores.visorAceso,
    borderRadius: formas.raioSelo,
  },
  marcadorCheio: { backgroundColor: cores.visorAceso },
  usado: { opacity: 0.45 },
  digitos: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, paddingRight: 4 },
  selo: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: formas.raioSelo },
  textoSelo: { fontFamily: fontes.texto, fontSize: 13 },
});
