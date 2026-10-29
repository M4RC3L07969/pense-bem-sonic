/**
 * Tela do aparelho: liga o teclado às regras do jogo e desenha o estado no visor.
 *
 * As regras ficam em `src/logic/aparelho.js`; aqui só ficam o que depende do tempo
 * (o avanço depois de cada aviso), os recordes salvos no celular e as teclas do computador.
 */

import { useEffect, useReducer } from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Carcaca } from '../components/carcaca';
import { Teclado } from '../components/teclado';
import { Visor } from '../components/visor';
import gabarito from '../data/gabarito.json';
import { ACOES, FASES, criarAparelho } from '../logic/aparelho';
import { acaoDaTeclaDoPc } from '../logic/teclas-do-pc';
import { tempoAteAvancar, visorDoEstado } from '../logic/tela';
import { carregarRecordes, salvarRecordes } from '../services/armazenamento';
import { TEMA } from '../theme';

const APARELHO = criarAparelho({ gabarito });
const ESPACO = 24;

function useRecordesSalvos(estado, enviar) {
  useEffect(() => {
    let ativo = true;
    carregarRecordes().then((recordes) => {
      if (ativo) {
        enviar({ tipo: ACOES.RECORDES_CARREGADOS, recordes });
      }
    });
    return () => {
      ativo = false;
    };
  }, [enviar]);

  useEffect(() => {
    if (estado.fase === FASES.RESULTADO) {
      salvarRecordes(estado.recordes);
    }
  }, [estado.fase, estado.recordes]);
}

function useAvancoAutomatico(estado, enviar) {
  useEffect(() => {
    const espera = tempoAteAvancar(estado);
    if (espera === null) {
      return undefined;
    }
    const temporizador = setTimeout(() => enviar({ tipo: ACOES.AVANCAR }), espera);
    return () => clearTimeout(temporizador);
  }, [estado, enviar]);
}

function useTeclasDoPc(enviar) {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return undefined;
    }
    function aoApertar(evento) {
      const acao = acaoDaTeclaDoPc(evento);
      if (!acao || evento.repeat) {
        return;
      }
      evento.preventDefault();
      evento.stopPropagation();
      enviar(acao);
    }
    window.addEventListener('keydown', aoApertar, true);
    return () => window.removeEventListener('keydown', aoApertar, true);
  }, [enviar]);
}

/**
 * Aparelho Pense Bem jogável.
 *
 * @returns {JSX.Element}
 */
export function Aparelho() {
  const [estado, enviar] = useReducer(APARELHO.reduzir, APARELHO.estadoInicial);
  const margens = useSafeAreaInsets();
  const { visor, corDestacada } = visorDoEstado(estado);

  useRecordesSalvos(estado, enviar);
  useAvancoAutomatico(estado, enviar);
  useTeclasDoPc(enviar);

  return (
    <ScrollView
      style={styles.fundo}
      contentContainerStyle={[
        styles.conteudo,
        {
          paddingTop: margens.top + ESPACO,
          paddingBottom: margens.bottom + ESPACO,
          paddingLeft: margens.left + ESPACO / 2,
          paddingRight: margens.right + ESPACO / 2,
        },
      ]}
    >
      <Carcaca>
        <Visor {...visor} />
        <Teclado onAcao={enviar} corDestacada={corDestacada} />
      </Carcaca>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fundo: { backgroundColor: TEMA.cores.fundo },
  conteudo: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
});
