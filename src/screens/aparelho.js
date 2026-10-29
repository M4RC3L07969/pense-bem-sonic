/**
 * Tela do aparelho: liga o teclado às regras do jogo e desenha o estado no visor.
 *
 * As regras ficam em `src/logic/aparelho.js`; aqui só ficam o que depende do tempo
 * (o avanço depois de cada aviso), os recordes e a preferência do som salvos no celular,
 * os sons e as teclas do computador.
 */

import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Carcaca } from '../components/carcaca';
import { TeclaSom } from '../components/tecla-som';
import { Teclado } from '../components/teclado';
import { Visor } from '../components/visor';
import gabarito from '../data/gabarito.json';
import { ACOES, FASES, criarAparelho } from '../logic/aparelho';
import { SONS, somDaMudanca } from '../logic/sons';
import { acaoDaTeclaDoPc } from '../logic/teclas-do-pc';
import { tempoAteAvancar, visorDoEstado } from '../logic/tela';
import {
  carregarRecordes,
  carregarSomLigado,
  salvarRecordes,
  salvarSomLigado,
} from '../services/armazenamento';
import { prepararSons, tocar } from '../services/sons';
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

function useSomLigado() {
  const [ligado, setLigado] = useState(true);

  useEffect(() => {
    let ativo = true;
    carregarSomLigado().then((salvo) => {
      if (ativo) {
        setLigado(salvo);
      }
    });
    return () => {
      ativo = false;
    };
  }, []);

  const alternar = useCallback(() => {
    setLigado((atual) => {
      salvarSomLigado(!atual);
      return !atual;
    });
  }, []);

  return [ligado, alternar];
}

function useSonsDoJogo(estado, somLigado) {
  const anterior = useRef(estado);

  useEffect(() => {
    prepararSons();
  }, []);

  useEffect(() => {
    const som = somDaMudanca(anterior.current, estado);
    anterior.current = estado;
    if (som && somLigado) {
      tocar(som);
    }
  }, [estado, somLigado]);
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
  const [somLigado, alternarSom] = useSomLigado();
  const margens = useSafeAreaInsets();
  const { visor, corDestacada } = visorDoEstado(estado);

  const apertar = useCallback(
    (acao) => {
      if (somLigado && acao.tipo !== ACOES.COR) {
        tocar(SONS.TECLA);
      }
      enviar(acao);
    },
    [somLigado],
  );

  useRecordesSalvos(estado, enviar);
  useAvancoAutomatico(estado, enviar);
  useSonsDoJogo(estado, somLigado);
  useTeclasDoPc(apertar);

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
      <Carcaca rodape={<TeclaSom ligado={somLigado} onPress={alternarSom} />}>
        <Visor {...visor} />
        <Teclado onAcao={apertar} corDestacada={corDestacada} />
      </Carcaca>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fundo: { backgroundColor: TEMA.cores.fundo },
  conteudo: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
});
