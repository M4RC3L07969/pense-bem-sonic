/**
 * Contraste entre duas cores, pela fórmula do WCAG 2.
 *
 * Referência: 4,5:1 é o mínimo para texto pequeno e 3:1 para texto grande ou elementos gráficos.
 */

const FORMATO_HEX = /^#([0-9a-f]{6})$/i;

function canalLinear(valor) {
  const c = valor / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/**
 * Luminância relativa de uma cor.
 *
 * @param {string} hex Cor no formato `#rrggbb`.
 * @returns {number} Valor de 0 (preto) a 1 (branco).
 * @throws {TypeError} Se a cor não estiver no formato `#rrggbb`.
 */
export function luminancia(hex) {
  const encontrado = FORMATO_HEX.exec(String(hex));
  if (!encontrado) {
    throw new TypeError(`cor inválida: ${String(hex)} (use #rrggbb)`);
  }
  const numero = parseInt(encontrado[1], 16);
  const r = canalLinear((numero >> 16) & 255);
  const g = canalLinear((numero >> 8) & 255);
  const b = canalLinear(numero & 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Razão de contraste entre duas cores (a ordem não importa).
 *
 * @param {string} corA Cor no formato `#rrggbb`.
 * @param {string} corB Cor no formato `#rrggbb`.
 * @returns {number} De 1 (iguais) a 21 (preto e branco).
 */
export function contraste(corA, corB) {
  const [clara, escura] = [luminancia(corA), luminancia(corB)].sort((a, b) => b - a);
  return (clara + 0.05) / (escura + 0.05);
}
