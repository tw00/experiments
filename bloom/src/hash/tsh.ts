/**
 * TinySimpleHash
 * 32-bit hash in 89 chars with better quality randomness than FNV or DJB2
 */

export default function TSH(str) {
  let h = 9;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 9 ** 9);
  }
  return h ^ (h >>> 9);
}
