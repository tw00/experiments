/**
Fowler-Noll-Vo hash function.
https://en.wikipedia.org/wiki/Fowler-Noll-Vo_hash_function#FNV-1a_hash

@author: Joy Ghosh
@version: 0.0.1
*/

// FNV constants.
// const FNV_PRIME = 16777619;
const FNV_OFFSET_BASIS = 2166136261;

/**
FNV hash function. (32-bit version)
FNV step 1: hash = hash XOR byte_of_data.
FNV step 2: hash = hash * FNV_Prime.
*/
export default function fnv_1a(value: string): number {
  let hash = FNV_OFFSET_BASIS;

  for (let i = 0; i < value.length; ++i) {
    //Extract the 2 octets of value i.e. 16 bits (2 bytes).
    const c = value.charCodeAt(i);
    hash = fnv_xor(hash, c);
    hash = fnv_multiply(hash);
  }

  return hash >>> 0;
}

// FNV step 1: hash = hash XOR byte_of_data.
function fnv_xor(hash: number, byte_of_data: number): number {
  return hash ^ byte_of_data;
}

// FNV step 2: hash = hash * FNV_PRIME.
function fnv_multiply(hash: number): number {
  // Same as hash * FNV_PRIME
  // 1000000000000000110010011 (0,1,4,7,8,24)
  return (
    hash + //
    (hash << 1) +
    (hash << 4) +
    (hash << 7) +
    (hash << 8) +
    (hash << 24)
  );
}
