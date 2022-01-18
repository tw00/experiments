import hash from './murmur3';

export default function itemHash(v: string, bits: number, k: number): bigint {
  const o = 0n;
  const m = BigInt(bits);
  const buf = v;
  let a = hash(buf, 0n);
  if (a < 0n) a *= -1n;
  a ^= 0x6740bca37be0516dn;

  let delta = Rotl64(a, 17n) | 1n;
  let _k = BigInt(k);
  for (let i = 0n; i < _k; ++i) {
    delta += i;
    let bit = a % m;
    o |= 1n << bit;
    a = (a + delta) & mask64;
  }
  return o;
}
