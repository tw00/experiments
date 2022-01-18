/**
Jenkins one_at_a_time hash function.
https://en.wikipedia.org/wiki/Jenkins_hash_function

@author: Joy Ghosh
@version: 0.0.1

Selection of h2(k):

The secondary hash function h2(k) should have several characteristics:

- it should never yield an index of zero
- it should cycle through the whole table
- it should be very fast to compute
- it should be pair-wise independent of h1(k)
- The distribution characteristics of h2 are irrelevant. It is analogous to a
  random-number generator.
- All h2(k) be relatively prime to |T|.

In practice:

- If division hashing is used for both functions, the divisors are chosen as primes.
- If the T is a power of 2, the first and last requirements are usually satisfied
  by making h2(k) always return an odd number. This has the side effect of
  doubling the chance of collision due to one wasted bit.

The division method
  The division method involves mapping a key k into one of m slots by taking
  the remainder of k divided by m as expressed in the hash function

  h(k) = k mod m_{prime}
*/

/**
 * Jenkins's one at a time hash function.
 */
export default function one_at_a_time_hash(key) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash += key.charCodeAt(i);
    hash += hash << 10;
    hash = hash ^ (hash >> 6);
  }

  hash += hash << 3;
  hash = hash ^ (hash >> 11);
  hash += hash << 15;
  return hash;
}
