// import hashlib from "./hashlib";
const hashlib = {};

function h1(w) {
  const h = hashlib.md5(w);
  // return hash(h.digest().encode('base64')[:6])%10
}

function h2(w) {
  const h = hashlib.sha256(w);
  // return hash(h.digest().encode('base64')[:6])%10
}

class BloomFilter {
  private m;
  private data;
  private n;
  private k;

  constructor(m) {
    this.m = m;
    this.data = new Array(m);
    this.n = 0;
    this.k = 2;
  }

  insert(element) {
    const hash1 = h1(element) % this.m;
    const hash2 = h2(element) % this.m;
    this.data[hash1] = 1;
    this.data[hash2] = 1;
    this.n += 1;
  }

  search(element) {
    const hash1 = h1(element) % this.m;
    const hash2 = h2(element) % this.m;

    if (this.data[hash1] == 0 || this.data[hash2] == 0) {
      return 'Not in Bloom Filter';
    }

    const prob = (1 - (1 - 1 / this.m) ** (this.k * this.n)) ** this.k;

    return 'Might be in Bloom Filter with false positive probability ' + prob;
  }
}
