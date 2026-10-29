/**
 * Gera os sons do app (arquivos `.wav` em `assets/sons/`) a partir de notas simples.
 *
 * Os sons são criados do zero por este script, sem copiar áudio de lugar nenhum.
 * Uso: `npm run sons`.
 */

const fs = require('node:fs');
const path = require('node:path');

const TAXA = 22050;
const VOLUME = 0.45;
const BORDA_MS = 6;

/** Notas de cada som (veja `gerarWav` para o que cada campo faz). */
const SONS = Object.freeze({
  tecla: [{ hz: 900, ms: 45, ate: 450, suave: true, decai: true, volume: 0.6 }],
  acerto: [
    { hz: 880, ms: 70 },
    { hz: 1109, ms: 70 },
    { hz: 1319, ms: 150 },
  ],
  erro: [
    { hz: 330, ms: 150 },
    { hz: 247, ms: 280 },
  ],
  revelada: [
    { hz: 659, ms: 120 },
    { hz: 523, ms: 120 },
    { hz: 659, ms: 120 },
    { hz: 523, ms: 160 },
  ],
  fim: [
    { hz: 523, ms: 110 },
    { hz: 659, ms: 110 },
    { hz: 784, ms: 110 },
    { hz: 1047, ms: 280 },
  ],
  recorde: [
    { hz: 523, ms: 100 },
    { hz: 659, ms: 100 },
    { hz: 784, ms: 100 },
    { hz: 1047, ms: 140 },
    { hz: 0, ms: 40 },
    { hz: 1319, ms: 110 },
    { hz: 1568, ms: 340 },
  ],
});

function onda(hz, tempo) {
  let soma = 0;
  for (const harmonico of [1, 3, 5, 7]) {
    soma += Math.sin(2 * Math.PI * hz * harmonico * tempo) / harmonico;
  }
  return soma * 0.8;
}

function ondaSuave({ hz, ate }, tempo, duracao) {
  const fase = 2 * Math.PI * (hz * tempo + ((ate - hz) * tempo * tempo) / (2 * duracao));
  return Math.sin(fase);
}

function amostrasDaNota(nota) {
  const { hz, ms, suave = false, decai = false, volume = 1 } = nota;
  const total = Math.round((TAXA * ms) / 1000);
  const borda = Math.min(Math.round((TAXA * BORDA_MS) / 1000), Math.floor(total / 2));
  const deslizante = { hz, ate: nota.ate ?? hz };
  return Array.from({ length: total }, (_, indice) => {
    if (hz === 0) {
      return 0;
    }
    const tempo = indice / TAXA;
    const envelope = Math.min(1, indice / borda, (total - 1 - indice) / borda);
    if (!suave) {
      return onda(hz, tempo) * envelope * VOLUME;
    }
    const queda = decai ? Math.exp((-5 * indice) / total) : 1;
    return ondaSuave(deslizante, tempo, ms / 1000) * envelope * queda * VOLUME * volume;
  });
}

/**
 * Monta um arquivo WAV (PCM 16 bits, mono) com as notas em sequência.
 *
 * @param {{ hz: number, ms: number, ate?: number, suave?: boolean, decai?: boolean, volume?: number }[]} notas
 *   Frequência inicial (0 = silêncio) e duração de cada nota; `ate` desliza a frequência até
 *   esse valor, `suave` usa uma onda pura (sem o timbre de videogame), `decai` faz o som sumir
 *   aos poucos e `volume` (0 a 1) deixa a nota mais baixa.
 * @returns {Buffer} O conteúdo do arquivo `.wav`.
 */
function gerarWav(notas) {
  const amostras = notas.flatMap(amostrasDaNota);
  const dados = Buffer.alloc(amostras.length * 2);
  amostras.forEach((valor, indice) => {
    const limitado = Math.max(-1, Math.min(1, valor));
    dados.writeInt16LE(Math.round(limitado * 32767), indice * 2);
  });
  const cabecalho = Buffer.alloc(44);
  cabecalho.write('RIFF', 0, 'ascii');
  cabecalho.writeUInt32LE(36 + dados.length, 4);
  cabecalho.write('WAVE', 8, 'ascii');
  cabecalho.write('fmt ', 12, 'ascii');
  cabecalho.writeUInt32LE(16, 16);
  cabecalho.writeUInt16LE(1, 20);
  cabecalho.writeUInt16LE(1, 22);
  cabecalho.writeUInt32LE(TAXA, 24);
  cabecalho.writeUInt32LE(TAXA * 2, 28);
  cabecalho.writeUInt16LE(2, 32);
  cabecalho.writeUInt16LE(16, 34);
  cabecalho.write('data', 36, 'ascii');
  cabecalho.writeUInt32LE(dados.length, 40);
  return Buffer.concat([cabecalho, dados]);
}

/**
 * Grava todos os sons em uma pasta.
 *
 * @param {string} pasta Pasta de destino (criada se não existir).
 * @returns {string[]} Os caminhos dos arquivos gravados.
 */
function gerarTodos(pasta) {
  fs.mkdirSync(pasta, { recursive: true });
  return Object.entries(SONS).map(([nome, notas]) => {
    const arquivo = path.join(pasta, `${nome}.wav`);
    fs.writeFileSync(arquivo, gerarWav(notas));
    return arquivo;
  });
}

if (require.main === module) {
  const gravados = gerarTodos(path.join(__dirname, '..', 'assets', 'sons'));
  console.log(gravados.map((arquivo) => path.relative(process.cwd(), arquivo)).join('\n'));
}

module.exports = { SONS, TAXA, gerarWav, gerarTodos };
