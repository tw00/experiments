import hash from './hash/tsh';
import one_at_a_time_hash from './hash/jenkins';

/**
 * Bloom filter object.
 * n represents number of elements in this filter.
 */
export default class BloomFilterMin {
  private m: number;
  private k: number;
  private state: Array<boolean>;

  constructor(n, false_postive_tolerance) {
    // Bits in Bloom filter.
    this.m = Math.ceil(-2 * n * Math.log(false_postive_tolerance));

    // Number of hash functions. Optimal.
    this.k = Math.ceil(0.7 * (this.m / n));

    // Initialize bit array for filter.
    this.state = new Array(this.m);
  }

  // Double hash technique, Dillinger & Manolios (2004b)
  // https://en.wikipedia.org/wiki/Double_hashing
  private calculateHash(x, m, i) {
    // return (hash(x) + i * one_at_a_time_hash(x)) % m;
    return (hash(x) + i * one_at_a_time_hash(x) + (i * i * i - i) / 6) % m;
  }

  // Adds data to filter.
  add(data) {
    let hash = data;

    for (let i = 0; i < this.k; i++) {
      hash = this.calculateHash(hash, this.m, i);
      this.state[hash] = true;
    }
  }

  // Looks for membership.
  has(data) {
    let hash = data;
    for (let i = 0; i < this.k; i++) {
      hash = this.calculateHash(hash, this.m, i);
      if (!this.state[hash]) {
        return false;
      }
    }
    return true;
  }
}
