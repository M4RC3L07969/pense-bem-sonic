/**
 * Validação do gabarito (`src/data/gabarito.json`).
 *
 * Formato esperado de um programa:
 *
 * {
 *   "numero": 1,
 *   "codigo": "021",
 *   "primeiraPergunta": 1,
 *   "perguntas": [
 *     { "numero": 1, "resposta": "vermelho" },
 *     { "numero": 2, "resposta": "azul" }
 *   ]
 * }
 *
 * `numero` segue a numeração do livro (1 a 150); `resposta` é uma das {@link CORES}.
 */

export const PERGUNTAS_POR_PROGRAMA = 30;

/** Cores das alternativas, na ordem em que aparecem no livro e no documento de entrega. */
export const CORES = Object.freeze(['vermelho', 'amarelo', 'azul', 'verde']);

const FORMATO_DO_CODIGO = /^\d{3}$/;

function ehObjeto(valor) {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function validarPergunta(pergunta, numeroEsperado) {
  const rotulo = `pergunta ${numeroEsperado}`;
  if (!ehObjeto(pergunta)) {
    return [`${rotulo}: não é um objeto`];
  }

  const erros = [];
  if (pergunta.numero !== numeroEsperado) {
    erros.push(
      `${rotulo}: número ${String(pergunta.numero)} fora de ordem (esperado ${numeroEsperado})`,
    );
  }
  if (!CORES.includes(pergunta.resposta)) {
    erros.push(
      `${rotulo}: resposta "${String(pergunta.resposta)}" inválida (use ${CORES.join(', ')})`,
    );
  }
  return erros;
}

/**
 * Valida um programa do gabarito.
 *
 * @param {object} programa Programa no formato descrito no topo deste arquivo.
 * @param {{ exigirCompleto?: boolean }} [opcoes] Com `exigirCompleto: false`, aceita
 *   programas ainda em digitação (menos de 30 perguntas), mas continua validando as que existem.
 * @returns {string[]} Lista de erros; vazia quando o programa está correto.
 */
export function validarPrograma(programa, { exigirCompleto = true } = {}) {
  if (!ehObjeto(programa)) {
    return ['programa não é um objeto'];
  }

  const erros = [];
  if (!Number.isInteger(programa.numero) || programa.numero < 1) {
    erros.push(`número do programa inválido: ${String(programa.numero)}`);
  }
  if (typeof programa.codigo !== 'string' || !FORMATO_DO_CODIGO.test(programa.codigo)) {
    erros.push(`código inválido: ${String(programa.codigo)} (use 3 dígitos, ex.: "021")`);
  }
  if (!Number.isInteger(programa.primeiraPergunta) || programa.primeiraPergunta < 1) {
    erros.push(`primeiraPergunta inválida: ${String(programa.primeiraPergunta)}`);
  }
  if (!Array.isArray(programa.perguntas)) {
    erros.push('"perguntas" precisa ser uma lista');
    return erros;
  }

  const quantidade = programa.perguntas.length;
  if (quantidade > PERGUNTAS_POR_PROGRAMA) {
    erros.push(`tem ${quantidade} perguntas (máximo ${PERGUNTAS_POR_PROGRAMA})`);
  } else if (exigirCompleto && quantidade < PERGUNTAS_POR_PROGRAMA) {
    erros.push(`tem ${quantidade} perguntas (esperado ${PERGUNTAS_POR_PROGRAMA})`);
  }

  if (Number.isInteger(programa.primeiraPergunta)) {
    programa.perguntas.forEach((pergunta, indice) => {
      erros.push(...validarPergunta(pergunta, programa.primeiraPergunta + indice));
    });
  }
  return erros;
}

/**
 * Valida o gabarito inteiro: cada programa e a unicidade de números e códigos.
 *
 * @param {{ programas: object[] }} gabarito Conteúdo de `src/data/gabarito.json`.
 * @param {{ exigirCompleto?: boolean }} [opcoes] Repassado para {@link validarPrograma}.
 * @returns {string[]} Lista de erros, cada um prefixado com o programa; vazia quando está tudo certo.
 */
export function validarGabarito(gabarito, opcoes) {
  if (!ehObjeto(gabarito) || !Array.isArray(gabarito.programas)) {
    return ['gabarito precisa ter a lista "programas"'];
  }

  const erros = [];
  const numerosVistos = new Set();
  const codigosVistos = new Set();

  gabarito.programas.forEach((programa, indice) => {
    const rotulo = `Programa ${programa?.numero ?? `#${indice + 1}`}`;
    if (numerosVistos.has(programa?.numero)) {
      erros.push(`${rotulo}: número repetido`);
    }
    if (codigosVistos.has(programa?.codigo)) {
      erros.push(`${rotulo}: código ${programa.codigo} repetido`);
    }
    numerosVistos.add(programa?.numero);
    codigosVistos.add(programa?.codigo);
    erros.push(...validarPrograma(programa, opcoes).map((erro) => `${rotulo}: ${erro}`));
  });
  return erros;
}
