/**
 * Teclado do aparelho: funções, números de 1 a 0 e as 4 teclas de resposta.
 *
 * Cada toque vira uma ação no formato de `ACOES` (`src/logic/aparelho.js`), pronta para o `reduzir`.
 */

import { StyleSheet, View } from 'react-native';

import { ACOES } from '../logic/aparelho';
import { CORES } from '../logic/gabarito';
import { Tecla } from './tecla';
import { TeclaCor } from './tecla-cor';

const LINHAS_DE_NUMEROS = Object.freeze([
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 0],
]);

/**
 * Teclado completo.
 *
 * @param {object} props
 * @param {(acao: { tipo: string }) => void} props.onAcao Recebe a ação de cada tecla tocada.
 * @param {string | null} [props.corDestacada] Cor de resposta a realçar.
 * @returns {JSX.Element}
 */
export function Teclado({ onAcao, corDestacada = null }) {
  return (
    <View style={styles.teclado}>
      <View style={styles.linha}>
        <Tecla
          rotulo="LIVRO"
          variante="funcao"
          descricao="livro: escolher programa"
          onPress={() => onAcao({ tipo: ACOES.LIVRO })}
        />
        <Tecla
          rotulo="APAGAR"
          variante="funcao"
          descricao="apagar dígito"
          onPress={() => onAcao({ tipo: ACOES.APAGAR })}
        />
        <Tecla
          rotulo="ENTER"
          variante="confirmar"
          descricao="enter: confirmar"
          onPress={() => onAcao({ tipo: ACOES.ENTER })}
        />
      </View>

      {LINHAS_DE_NUMEROS.map((linha) => (
        <View key={linha.join('')} style={styles.linha}>
          {linha.map((digito) => (
            <Tecla
              key={digito}
              rotulo={String(digito)}
              onPress={() => onAcao({ tipo: ACOES.DIGITO, digito })}
            />
          ))}
        </View>
      ))}

      <View style={[styles.linha, styles.respostas]}>
        {CORES.map((cor) => (
          <TeclaCor
            key={cor}
            cor={cor}
            destacada={cor === corDestacada}
            onPress={() => onAcao({ tipo: ACOES.COR, cor })}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  teclado: { gap: 12 },
  linha: { flexDirection: 'row', gap: 10 },
  respostas: { marginTop: 6 },
});
