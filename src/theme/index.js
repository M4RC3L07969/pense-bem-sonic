/**
 * Tema do aparelho (visual "Turbo"): cores, fontes e formas usadas pelos componentes.
 *
 * Cores e tamanhos ficam só aqui; os componentes leem estes valores em vez de repetir números.
 */

const AZUL_ESCURO = '#0A2178';
const AMARELO = '#FFD21F';

/** Tokens do tema. */
export const TEMA = Object.freeze({
  fontes: Object.freeze({
    titulo: 'RussoOne_400Regular',
    tecla: 'RussoOne_400Regular',
    texto: 'Exo2_700Bold_Italic',
  }),
  cores: Object.freeze({
    fundo: '#081446',
    carcaca: '#1740C8',
    carcacaBorda: AZUL_ESCURO,
    carcacaTexto: '#FFFFFF',
    carcacaTextoSuave: AMARELO,
    detalhe: AMARELO,
    visorFundo: '#C8D5B0',
    visorBorda: AZUL_ESCURO,
    visorAceso: '#17240F',
    visorApagado: '#B5C39C',
    visorTexto: '#17240F',
    tecla: '#F4F7FF',
    teclaTexto: AZUL_ESCURO,
    teclaBorda: AZUL_ESCURO,
    teclaFuncao: AZUL_ESCURO,
    teclaFuncaoTexto: '#FFFFFF',
    teclaConfirmar: AMARELO,
    teclaConfirmarTexto: AZUL_ESCURO,
    luzAcesa: AMARELO,
    luzApagada: '#4A5C9E',
    resposta: Object.freeze({
      vermelho: '#C8221E',
      amarelo: '#FFC400',
      azul: '#0F6FD6',
      verde: '#0B7D37',
    }),
    respostaTexto: Object.freeze({
      vermelho: '#FFFFFF',
      amarelo: '#2B1F00',
      azul: '#FFFFFF',
      verde: '#FFFFFF',
    }),
    respostaBorda: '#FFFFFF',
    sinalTexto: '#FFFFFF',
    acerto: '#0B7D37',
    erro: '#C8221E',
  }),
  formas: Object.freeze({
    raioCarcaca: 40,
    raioVisor: 16,
    raioSelo: 4,
    raioTecla: 12,
    raioTeclaCor: 22,
    bordaCarcaca: 4,
    bordaVisor: 3,
    bordaTecla: 2,
    bordaTeclaCor: 3,
    bordaTeclaCorDestacada: 6,
    sombraTecla: `0px 4px 0px ${AZUL_ESCURO}`,
    sombraTeclaApertada: `0px 1px 0px ${AZUL_ESCURO}`,
    afundarAoApertar: 3,
    inclinacaoTitulo: '-10deg',
    inclinacaoDigito: '-8deg',
  }),
  digito: Object.freeze({ largura: 36, altura: 62, espessura: 8 }),
  larguraMaxima: 440,
  larguraDeTelaEstreita: 360,
});
