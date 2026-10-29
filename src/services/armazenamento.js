/**
 * Armazenamento no celular (AsyncStorage): os recordes e a preferência do som.
 *
 * Nenhuma função daqui lança erro: sem armazenamento disponível, o app continua funcionando,
 * só que sem lembrar os recordes e com o som ligado.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

import { normalizarRecordes } from '../logic/recorde';

/** Chave usada no AsyncStorage. O `v1` permite mudar o formato no futuro sem ler dados antigos. */
export const CHAVE_DOS_RECORDES = 'pense-bem-sonic:recordes:v1';

/** Chave da preferência do som (`"ligado"` ou `"desligado"`). */
export const CHAVE_DO_SOM = 'pense-bem-sonic:som:v1';

/**
 * Lê os recordes salvos.
 *
 * @returns {Promise<Record<string, number>>} Os recordes (já limpos), ou `{}` se não houver nada
 *   salvo ou se a leitura falhar.
 */
export async function carregarRecordes() {
  try {
    const texto = await AsyncStorage.getItem(CHAVE_DOS_RECORDES);
    return texto === null ? {} : normalizarRecordes(JSON.parse(texto));
  } catch {
    return {};
  }
}

/**
 * Salva os recordes.
 *
 * @param {Record<string, number>} recordes Recordes a salvar (são limpos antes de gravar).
 * @returns {Promise<boolean>} `true` se gravou, `false` se a gravação falhou.
 */
export async function salvarRecordes(recordes) {
  try {
    await AsyncStorage.setItem(CHAVE_DOS_RECORDES, JSON.stringify(normalizarRecordes(recordes)));
    return true;
  } catch {
    return false;
  }
}

/**
 * Lê se o som está ligado.
 *
 * @returns {Promise<boolean>} `false` só se o jogador desligou o som; `true` quando não há nada
 *   salvo, quando o valor é desconhecido ou quando a leitura falha.
 */
export async function carregarSomLigado() {
  try {
    return (await AsyncStorage.getItem(CHAVE_DO_SOM)) !== 'desligado';
  } catch {
    return true;
  }
}

/**
 * Salva se o som está ligado.
 *
 * @param {boolean} ligado Escolha do jogador.
 * @returns {Promise<boolean>} `true` se gravou, `false` se a gravação falhou.
 */
export async function salvarSomLigado(ligado) {
  try {
    await AsyncStorage.setItem(CHAVE_DO_SOM, ligado ? 'ligado' : 'desligado');
    return true;
  } catch {
    return false;
  }
}
