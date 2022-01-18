/**
 * Bloom filter.
 * @author: Joy Ghosh
 * @version: 0.0.1
 */

import BitView from './bitview';
// import BitView from './bitview-simple';
import fnv_1a from './hash/fnv_1a';
import one_at_a_time_hash from './hash/jenkins';

// Constants.
const BITS_IN_BYTE = 8;
const DEFAULT_FALSE_POSITIVE_TOLERANCE = 0.000001;

/**
 * Bloom filter object.
 * n represents number of elements in this filter.
 */
export default class BloomFilter {
  private n: number;
  private m: number;
  private k: number;
  private size: number;
  private bitview;

  // deserialize from json.
  static from(serialized) {
    const data = JSON.parse(serialized);
    const filter = new BloomFilter(0, 1);
    filter.n = data.n;
    filter.m = data.m;
    filter.k = data.k;
    filter.size = data.size;
    filter.bitview = BitView.from(data.state);
    return filter;
  }

  constructor(n, false_postive_tolerance = DEFAULT_FALSE_POSITIVE_TOLERANCE) {
    this.n = n;

    // Bits in Bloom filter.
    this.m = BloomFilter.sizeFromFalsePositiveRate(n, false_postive_tolerance);

    // Number of hash functions. Optimal.
    this.k = BloomFilter.optimalK(this.m, n);

    // Normalize size.
    // default size is a byte.
    this.size =
      this.m > BITS_IN_BYTE //
        ? Math.ceil(this.m / BITS_IN_BYTE)
        : 1;

    // Initialize bit array for filter.
    this.bitview = new BitView(this.size);
  }

  private static sizeFromFalsePositiveRate(
    n: number,
    false_postive_tolerance: number,
  ) {
    // ln(e) = - ( ln(2) ^ 2 ) * m/n
    return Math.ceil(-2.08 * n * Math.log(false_postive_tolerance));
  }

  private static optimalK(m: number, n: number) {
    // k_opt = ln(2) * (m / n);
    return Math.ceil(0.69 * (m / n));
  }

  // Generate hash value.
  private static calculateHash(x, m, i) {
    // Double hash technique
    // Dillinger & Manolios (2004b)
    // https://en.wikipedia.org/wiki/Double_hashing
    return (fnv_1a(x) + i * one_at_a_time_hash(x)) % m;
  }

  // Looks for membership.
  has(data) {
    let hash = data;
    for (let i = 0; i < this.k; i++) {
      hash = BloomFilter.calculateHash(hash, this.m, i);
      if (!this.bitview.get(hash)) {
        return false;
      }
    }
    return true;
  }

  // Adds data to filter.
  add(data) {
    let hash = data;
    for (let i = 0; i < this.k; i++) {
      hash = BloomFilter.calculateHash(hash, this.m, i);
      this.bitview.set(hash);
    }
  }

  // Return the bitview object.
  view() {
    return this.bitview.view();
  }

  // Return a serialized object.
  serialize() {
    return JSON.stringify({
      ...this,
      bitview: undefined,
      state: this.bitview.serialize(),
    });
  }
}
