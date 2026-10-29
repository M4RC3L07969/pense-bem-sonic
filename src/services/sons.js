/**
 * Toca os sons do aparelho com o `expo-audio`.
 *
 * Nenhuma função daqui lança erro: se o celular não conseguir tocar, o jogo segue mudo.
 * O som segue o modo silencioso do celular.
 */

import { createAudioPlayer } from 'expo-audio';

const ARQUIVOS = Object.freeze({
  tecla: require('../../assets/sons/tecla.wav'),
  acerto: require('../../assets/sons/acerto.wav'),
  erro: require('../../assets/sons/erro.wav'),
  revelada: require('../../assets/sons/revelada.wav'),
  fim: require('../../assets/sons/fim.wav'),
  recorde: require('../../assets/sons/recorde.wav'),
});

let tocadores = null;

function criarTocadores() {
  const criados = {};
  for (const [nome, arquivo] of Object.entries(ARQUIVOS)) {
    try {
      criados[nome] = createAudioPlayer(arquivo);
    } catch {
      criados[nome] = null;
    }
  }
  return criados;
}

/**
 * Carrega os sons, para o primeiro toque não atrasar. Pode ser chamada mais de uma vez.
 */
export function prepararSons() {
  if (tocadores === null) {
    tocadores = criarTocadores();
  }
}

/**
 * Toca um som do começo.
 *
 * @param {string} nome Um dos nomes de `SONS` (`src/logic/sons.js`).
 * @returns {boolean} `true` se mandou tocar, `false` se o som não existe ou não pôde tocar.
 */
export function tocar(nome) {
  prepararSons();
  const tocador = tocadores[nome];
  if (!tocador) {
    return false;
  }
  try {
    Promise.resolve(tocador.seekTo(0)).catch(() => {});
    tocador.play();
    return true;
  } catch {
    return false;
  }
}
