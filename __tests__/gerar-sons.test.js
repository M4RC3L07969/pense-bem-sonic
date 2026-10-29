import { describe, expect, test } from '@jest/globals';

const { SONS, TAXA, gerarWav } = require('../scripts/gerar-sons');

function lerWav(buffer) {
  const amostras = [];
  for (let posicao = 44; posicao < buffer.length; posicao += 2) {
    amostras.push(buffer.readInt16LE(posicao));
  }
  return {
    riff: buffer.toString('ascii', 0, 4),
    wave: buffer.toString('ascii', 8, 12),
    formato: buffer.readUInt16LE(20),
    canais: buffer.readUInt16LE(22),
    taxa: buffer.readUInt32LE(24),
    bits: buffer.readUInt16LE(34),
    tamanhoDosDados: buffer.readUInt32LE(40),
    amostras,
  };
}

describe('gerar-sons', () => {
  test('existem os 6 sons usados pelo app', () => {
    expect(Object.keys(SONS).sort()).toEqual(
      ['acerto', 'erro', 'fim', 'recorde', 'revelada', 'tecla'].sort(),
    );
  });

  test.each(Object.entries(SONS))('%s é um WAV válido, curto e sem estourar', (_, notas) => {
    const buffer = gerarWav(notas);
    const wav = lerWav(buffer);
    expect(wav).toMatchObject({
      riff: 'RIFF',
      wave: 'WAVE',
      formato: 1,
      canais: 1,
      taxa: TAXA,
      bits: 16,
    });
    expect(wav.tamanhoDosDados).toBe(buffer.length - 44);
    const segundos = wav.amostras.length / TAXA;
    expect(segundos).toBeGreaterThan(0.02);
    expect(segundos).toBeLessThan(1.5);
    const pico = Math.max(...wav.amostras.map(Math.abs));
    expect(pico).toBeGreaterThan(1000);
    expect(pico).toBeLessThan(32767);
  });

  test('começa e termina em silêncio (sem estalo)', () => {
    const { amostras } = lerWav(gerarWav(SONS.acerto));
    expect(Math.abs(amostras[0])).toBeLessThan(200);
    expect(Math.abs(amostras[amostras.length - 1])).toBeLessThan(200);
  });

  test('a duração bate com as notas', () => {
    const { amostras } = lerWav(
      gerarWav([
        { hz: 440, ms: 100 },
        { hz: 0, ms: 50 },
      ]),
    );
    expect(amostras.length).toBe(Math.round(TAXA * 0.1) + Math.round(TAXA * 0.05));
  });
});
