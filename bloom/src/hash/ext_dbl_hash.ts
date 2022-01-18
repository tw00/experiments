import h1 from './murmur3';
import h2 from './jenkins';

/*
Double hashing:
  Double hashing is one of the best methods available for open addressing
  because the permutations produced have many of the characteristics of randomly
  chosen permutations. Double hashing uses a hash function of the form

  h(k, i) = (h1(k) + ih2(k)) mod m,
*/

// Calculate k hash values from two underlying hash functions
// h1() and h2() using enhanced double hashing.
// On return,
//  hashes[i] = h1(x) + i*h2(x) + (i*i*i - i)/6.

// Takes advantage of automatic wrapping (modular reduction)
// of unsigned types in C.

export default function ext_dbl_hash(x, n: number) {
  const hashes = new Array(n);
  let a = h1(x, 0);
  let b = h2(x);

  for (let i = 0; i < n; i++) {
    hashes[i] = a;
    a += b; // Add quadratic difference to get cubic
    b += i; // Add linear difference to get quadratic
    // i++ adds constant difference to get linear
  }

  return hashes;
}
