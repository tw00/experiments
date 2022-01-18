import BloomFilter from './src/bloomfilter-min';

// arg 1: probable number of elements in the filter.
// arg 2: optional false_postive_tolerance argument
const filter = new BloomFilter(100, 0.1);

filter.add('test-data 1');
filter.add('test-data 2');

console.log(filter.has('test-data 3'));
console.log(filter.has('test-data 4'));
console.log(filter.has('test-data 1'));
console.log(filter.has('test-data 2'));
