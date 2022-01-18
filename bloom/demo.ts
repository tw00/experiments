import hash from './src/hash/fnv_1a';
import BitView from './src/bitview';
// import BitView from './src/bitview-simple';
import BloomFilter from './src/bloomfilter';

console.log('='.repeat(process.stdout.columns));

console.log('hash(abc)', hash('abc'));
console.log('hash(def)', hash('def'));
console.log('hash stable', hash('abc') === hash('abc'));

console.log('='.repeat(process.stdout.columns));

const bits = new BitView(2);
bits.set(3);
bits.set(5);
bits.set(9);
bits.clear(5);
console.log('bits.view', bits.view());
console.log('bits.length', bits.length);
console.log(
  'bits.get(*)',
  Array.from({ length: 8 * bits.length }).map((_, i) => bits.get(i)),
);

console.log('='.repeat(process.stdout.columns));

// arg1: probable number of elements in the filter.
// arg2: optional false_postive_tolerance argument
const filter = new BloomFilter(100, 0.1);

filter.add('test-data 1');
filter.add('test-data 2');

console.log(filter.has('test-data 3'));
console.log(filter.has('test-data 4'));
console.log(filter.has('test-data 1'));
console.log(filter.has('test-data 2'));

console.log('='.repeat(process.stdout.columns));

// serialization
const json = filter.serialize();
console.log('Serialized Bloom Filter:', json);
const filter2 = BloomFilter.from(json);
console.log(filter2.has('test-data 1'));

console.log('='.repeat(process.stdout.columns));
