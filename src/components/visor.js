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

function coresDoAviso(tom) {
  if (tom === 'acerto') {
    return { fundo: cores.acerto, texto: cores.sinalTexto };
  }
  if (tom === 'erro') {
    return { fundo: cores.erro, texto: cores.sinalTexto };
  }
  if (tom === 'destaque') {
    return { fundo: cores.detalhe, texto: cores.teclaConfirmarTexto };
  }
  if (Object.hasOwn(cores.resposta, tom)) {
    return { fundo: cores.resposta[tom], texto: cores.respostaTexto[tom] };
  }
  return { fundo: 'transparent', texto: cores.visorTexto };
}

function Aviso({ texto, tom }) {
  const { fundo, texto: corDoTexto } = coresDoAviso(tom);
  return (
    <View style={[styles.aviso, { backgroundColor: fundo }, tom === 'neutro' && styles.neutro]}>
      <Text style={[styles.textoAviso, { color: corDoTexto }]}>{texto}</Text>
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
 * @param {{ texto: string, tom: string } | null} [props.aviso] Aviso embaixo dos dígitos. `tom`:
 *   `acerto`, `erro`, `destaque`, `neutro` (só contorno) ou uma das 4 cores de resposta.
 * @returns {JSX.Element}
 */
export function Visor({ texto = '', legenda, tentativa = null, maxTentativas = 3, aviso = null }) {
  const casas = texto.slice(-CASAS).padStart(CASAS, ' ').split('');
  const descricao = [[legenda, texto.trim()].filter(Boolean).join(': '), aviso?.texto]
    .filter(Boolean)
    .join('. ');

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={descricao || 'visor'}
      accessibilityLiveRegion="polite"
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
        {aviso && <Aviso texto={aviso.texto} tom={aviso.tom} />}
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
  aviso: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: formas.raioSelo },
  neutro: { borderWidth: 2, borderColor: cores.visorTexto, paddingVertical: 2 },
  textoAviso: { fontFamily: fontes.texto, fontSize: 13 },
});
